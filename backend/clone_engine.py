"""
Clone Engine - Python port of the R LASSO+QP cloning methodology
alpha=0.00005 because returns are decimal (not % as in original R code)
Uses osqp for fast constrained QP (45x faster than scipy SLSQP), falls back to scipy if unavailable.
"""
import numpy as np
from sklearn.linear_model import Lasso
from scipy.optimize import minimize

try:
    import osqp
    from scipy import sparse as _sparse
    _HAS_OSQP = True
except ImportError:
    _HAS_OSQP = False


def lasso_qp(X, Y, _cache=None):
    """
    LASSO factor selection + constrained QP.
    _cache: dict reused across rolling iterations to avoid OSQP re-setup.
    Returns (result_dict, updated_cache).
    """
    X = np.array(X, dtype=float)
    Y = np.array(Y, dtype=float)
    # Standardize to match glmnet default — numpy is 8x faster than StandardScaler
    mu  = X.mean(axis=0)
    sig = X.std(axis=0, ddof=0); sig[sig < 1e-10] = 1.0
    X_s = (X - mu) / sig
    lasso = Lasso(alpha=0.005, max_iter=1000000, fit_intercept=False, positive=False)
    lasso.fit(X_s, Y)
    # Threshold the LASSO active set at 1e-8 rather than > 0. Coordinate
    # descent + threaded BLAS can leave a coefficient at ~1e-15 instead of
    # exactly 0 (or vice versa) depending on FP add-order, which made the
    # active set flap between runs. A 1e-8 floor absorbs that noise without
    # excluding any factor that meaningfully contributes — anything LASSO
    # actually wants in the model lands well above this threshold, and
    # anything below it would carry effectively zero weight in the QP.
    selector = np.where(lasso.coef_ > 1e-8)[0]
    if len(selector) == 0:
        return None, _cache
    Xr = X[:, selector]
    n  = Xr.shape[1]
    if n == 1:
        betas = np.array([1.0])
    elif _HAS_OSQP:
        q_vec = -2.0 * (Xr.T @ Y)
        # Reuse cached OSQP problem when selector unchanged (most iterations)
        same = (_cache is not None and _cache.get('n') == n and
                np.array_equal(_cache.get('sel'), selector))
        if same:
            _cache['prob'].update(q=q_vec)
            sol = _cache['prob'].solve()
        else:
            P = _sparse.csc_matrix(2.0 * Xr.T @ Xr)
            A = _sparse.vstack([np.ones((1, n)), _sparse.eye(n)], format='csc')
            l = np.concatenate([[1.0], np.zeros(n)])
            u = np.concatenate([[1.0], np.ones(n)])
            prob = osqp.OSQP()
            prob.setup(P, q_vec, A, l, u, warm_starting=True, verbose=False,
                       polish=False, eps_abs=1e-8, eps_rel=1e-8, max_iter=10000)
            sol  = prob.solve()
            _cache = {'prob': prob, 'sel': selector.copy(), 'n': n}
        betas = np.clip(sol.x, 0, 1)
        s = betas.sum()
        if s > 1e-10: betas = betas / s
    else:
        def obj(w):  return np.sum((Y - Xr @ w) ** 2)
        def grad(w): return -2 * Xr.T @ (Y - Xr @ w)
        res = minimize(obj, np.ones(n)/n, jac=grad, method='SLSQP',
                       bounds=[(0,1)]*n,
                       constraints=[{'type':'eq','fun':lambda w:np.sum(w)-1}],
                       options={'ftol':1e-12,'maxiter':10000})
        betas = res.x
    Yhat   = Xr @ betas
    ss_tot = np.sum((Y - np.mean(Y))**2)
    ss_res = np.sum((Y - Yhat)**2)
    return {
        'betas': betas, 'Yhat': Yhat,
        'factor_selector': selector,
        'r_squared': 1 - ss_res/ss_tot if ss_tot > 0 else 0
    }, _cache


def clone_fun(X_all, Y_all, is_dynamic=False):
    """Rolling clone. X and Y are most-recent-first."""
    Y_all = np.array(Y_all, dtype=float)
    X_all = np.array(X_all, dtype=float)
    n = len(Y_all); nf = X_all.shape[1]
    Y_rev = Y_all[::-1]; X_rev = X_all[::-1,:]
    out_ts   = np.full(n, np.nan)
    r2_ts    = np.full(n, np.nan)
    beta_all = np.full((n, nf), np.nan)
    first24  = True
    _cache   = None
    for t in range(n):
        # `valid` must drop dates where EITHER the manager return Y or any
        # factor value in X is missing — sklearn's Lasso refuses to fit on
        # NaN, and OSQP would crash on the QP step too. The earlier version
        # only checked Y, which let NaNs in X slip through whenever the
        # factor history is shorter than the manager's (e.g. recently-added
        # factors in the FactSet file).
        Y_window = Y_rev[:t+1]
        X_window = X_rev[:t+1, :]
        valid = np.where(np.isfinite(Y_window) &
                         np.all(np.isfinite(X_window), axis=1))[0]
        if len(valid) < 24: continue
        if is_dynamic and len(valid) > 36:
            valid = valid[len(valid)-36:]
            _cache = None  # dynamic window shifts: reset cache
        sol, _cache = lasso_qp(X_rev[valid], Y_rev[valid], _cache)
        if sol is None: continue
        if first24:
            ini = len(sol['Yhat']); s = t-(ini-1)
            out_ts[s:t+1] = sol['Yhat']
            for row in range(s, t+1):
                beta_all[row, sol['factor_selector']] = sol['betas']
                mask = np.ones(nf, bool); mask[sol['factor_selector']] = False
                beta_all[row, mask] = 0.0
            first24 = False
        else:
            out_ts[t]  = sol['Yhat'][-1]
            r2_ts[t]   = sol['r_squared']
            beta_all[t, sol['factor_selector']] = sol['betas']
            mask = np.ones(nf, bool); mask[sol['factor_selector']] = False
            beta_all[t, mask] = 0.0
    return {'outTS': out_ts[::-1], 'beta_all': beta_all[::-1,:], 'R2': r2_ts[::-1]}


FACTOR_CATEGORIES = {
    'EAFE_full': [
        'MSCI ACWI Ex USA NR USD', 'Russell Dev exUS LC Dynamic NR USD', 'Russell Dev exUS LC Defensive NR USD',
        'MSCI ACWI Ex USA Growth NR USD', 'MSCI ACWI Ex USA Value NR USD', 'MSCI ACWI ex USA Quality NR USD',
        'MSCI ACWI ex USA HDY NR USD', 'MSCI ACWI ex USA Min Vol (USD) NR USD',
        'MSCI ACWI Ex USA Small NR USD', 'MSCI ACWI Ex USA Small Growth NR USD', 'MSCI ACWI Ex USA Small Value NR USD',
        'MSCI EM NR USD', 'Russell EM LC Dynamic NR USD', 'Russell EM LC Defensive NR USD',
        'MSCI EM Growth NR USD', 'MSCI EM Value NR USD', 'MSCI EM High Dividend Yield NR USD',
        'MSCI EM Small NR USD', 'MSCI EM Small Value NR USD',
        'MSCI EAFE NR USD', 'EAFE Dynamic', 'EAFE Defensive',
        'MSCI EAFE Growth NR USD', 'MSCI EAFE Value NR USD', 'MSCI EAFE High Div Yld NR USD',
        'MSCI EAFE Minimum Vol (USD) NR USD', 'MSCI EAFE Small Cap NR USD',
        'MSCI EAFE Small Growth NR USD', 'MSCI EAFE Small Value NR USD',
        'MSCI United Kingdom NR USD', 'MSCI Europe Ex UK NR USD', 'MSCI Japan NR USD',
        'EAFE Quality'
    ],
    'EAFE_3factor': [
        'MSCI ACWI Ex USA NR USD', 'MSCI ACWI Ex USA Growth NR USD', 'MSCI ACWI Ex USA Value NR USD',
        'MSCI ACWI Ex USA Small NR USD', 'MSCI ACWI Ex USA Small Growth NR USD', 'MSCI ACWI Ex USA Small Value NR USD',
        'MSCI EM NR USD', 'MSCI EM Growth NR USD', 'MSCI EM Value NR USD',
        'MSCI EAFE NR USD', 'MSCI EAFE Growth NR USD', 'MSCI EAFE Value NR USD',
        'MSCI EAFE Small Cap NR USD', 'MSCI EAFE Small Growth NR USD', 'MSCI EAFE Small Value NR USD'
    ],
    'ISC_full': [
        'MSCI EAFE Small Cap NR USD', 'MSCI EAFE Small Growth NR USD', 'MSCI EAFE Small Value NR USD',
        'EM SC Dynamic', 'EM SC Defensive', 'EAFE SC Dynamic', 'EAFE SC Defensive',
        'UK SC', 'EuroxUK SC', 'Japan SC',
        'MSCI ACWI Ex USA Small NR USD', 'MSCI ACWI Ex USA Small Growth NR USD', 'MSCI ACWI Ex USA Small Value NR USD',
        'MSCI EM Small NR USD', 'MSCI EM Small Growth NR USD', 'MSCI EM Small Value NR USD',
        'EAFE SC Quality', 'EAFE SC Div Yld', 'EAFE SC Low Vol', 'EAFE Quality'
    ],
    'ISC_3factor': [
        'MSCI EAFE Small Cap NR USD', 'MSCI EAFE Small Growth NR USD', 'MSCI EAFE Small Value NR USD',
        'MSCI ACWI Ex USA Small NR USD', 'MSCI ACWI Ex USA Small Growth NR USD', 'MSCI ACWI Ex USA Small Value NR USD',
        'MSCI EM Small NR USD', 'MSCI EM Small Growth NR USD', 'MSCI EM Small Value NR USD'
    ],
    'ACWI_full': [
        'MSCI EM NR USD', 'Russell EM LC Dynamic NR USD', 'Russell EM LC Defensive NR USD',
        'MSCI EM Growth NR USD', 'MSCI EM Value NR USD', 'MSCI EM High Dividend Yield NR USD',
        'MSCI EM Small NR USD', 'MSCI EM Small Growth NR USD', 'MSCI EM Small Value NR USD',
        'MSCI EAFE NR USD', 'MSCI EAFE Growth NR USD', 'MSCI EAFE Value NR USD',
        'MSCI EAFE High Div Yld NR USD', 'MSCI EAFE Minimum Vol (USD) NR USD',
        'MSCI EAFE Small Cap NR USD', 'MSCI EAFE Small Growth NR USD', 'MSCI EAFE Small Value NR USD',
        'MSCI United Kingdom NR USD', 'MSCI Europe Ex UK NR USD', 'MSCI Japan NR USD',
        'MSCI ACWI NR USD', 'MSCI ACWI Growth NR USD', 'MSCI ACWI Value NR USD',
        'MSCI ACWI Quality NR USD', 'MSCI ACWI High Dividend Yield NR USD', 'MSCI ACWI Minimum Vol (USD) NR USD',
        'MSCI ACWI Small NR USD', 'MSCI ACWI Small Growth NR USD', 'MSCI ACWI Small Value NR USD',
        'Russell Global Dynamic NR USD', 'Russell Global Defensive NR USD',
        'EAFE Quality',
        'Russell 1000 TR USD', 'Russell 1000 Pure Growth TR USD', 'Russell 1000 Pure Value TR USD',
        'Russell 1000 Quality Fctr TR USD', 'Russell 1000 Yield Fctr TR USD', 'Russell 1000 Volatility Fctr TR USD',
        'Russell 2000 TR USD', 'Russell 2000 Pure Growth TR USD', 'Russell 2000 Pure Value TR USD'
    ],
    'ACWI_3factor': [
        'MSCI EM NR USD', 'MSCI EM Growth NR USD', 'MSCI EM Value NR USD',
        'MSCI EM Small NR USD', 'MSCI EM Small Growth NR USD', 'MSCI EM Small Value NR USD',
        'MSCI EAFE NR USD', 'MSCI EAFE Growth NR USD', 'MSCI EAFE Value NR USD',
        'MSCI EAFE Small Cap NR USD', 'MSCI EAFE Small Growth NR USD', 'MSCI EAFE Small Value NR USD',
        'MSCI ACWI NR USD', 'MSCI ACWI Growth NR USD', 'MSCI ACWI Value NR USD',
        'MSCI ACWI Small NR USD', 'MSCI ACWI Small Growth NR USD', 'MSCI ACWI Small Value NR USD',
        'Russell 1000 TR USD', 'Russell 1000 Pure Growth TR USD', 'Russell 1000 Pure Value TR USD',
        'Russell 2000 TR USD', 'Russell 2000 Pure Growth TR USD', 'Russell 2000 Pure Value TR USD'
    ],
    'EM_full': [
        'MSCI EM Value NR USD', 'MSCI EM High Dividend Yield NR USD', 'MSCI EM Small Value NR USD',
        'Russell EM LC Dynamic NR USD', 'Russell EM LC Defensive NR USD',
        'MSCI EM Growth NR USD', 'MSCI EM Small Growth NR USD',
        'MSCI EM Quality NR USD', 'MSCI EM Minimum Vol (USD) NR USD',
        'MSCI EM NR USD', 'MSCI EM Small NR USD',
        'MSCI China NR USD', 'MSCI EM Latin America NR USD', 'Frontier'
    ],
    'EM_3factor': [
        'MSCI EM Value NR USD', 'MSCI EM Small Value NR USD',
        'MSCI EM Growth NR USD', 'MSCI EM Small Growth NR USD',
        'MSCI EM NR USD', 'MSCI EM Small NR USD', 'Frontier'
    ],
    'US_full': [
        'Russell 1000 TR USD', 'Russell 1000 Dynamic - Backfilled', 'Russell 1000 Pure Growth TR USD',
        'Russell 1000 Pure Value TR USD', 'Russell 1000 Momentum Fctr TR USD',
        'Russell 1000 Quality Fctr TR USD', 'Russell 1000 Yield Fctr TR USD',
        'Russell 1000 Volatility Fctr TR USD', 'Russell 1000 Defensive TR USD',
        'Russell 2000 TR USD', 'Russell 2000 Dynamic - Backfilled', 'Russell 2000 Defensive - Backfilled',
        'Russell 2000 Pure Growth TR USD', 'Russell 2000 Pure Value TR USD',
        'Russell Mid Cap TR USD', 'Russell Midcap Dynamic TR USD', 'Russell Midcap Defensive TR USD',
        'Russell Midcap Pure Growth TR USD', 'Russell Midcap Pure Value TR USD'
    ],
    'US_3factor': [
        'Russell 1000 TR USD', 'Russell 1000 Pure Growth TR USD', 'Russell 1000 Pure Value TR USD',
        'Russell 2000 TR USD', 'Russell 2000 Pure Growth TR USD', 'Russell 2000 Pure Value TR USD'
    ],
    # US small-cap peer group. Kept separate from US (LC) so small-cap managers
    # are percentile-ranked against each other rather than being diluted by the
    # large-cap universe. Factor set mirrors US_full but drops Russell 1000 /
    # Midcap exposures, which wouldn't represent a SC manager's style.
    'USSC_full': [
        'Russell 2000 TR USD', 'Russell 2000 Dynamic - Backfilled', 'Russell 2000 Defensive - Backfilled',
        'Russell 2000 Pure Growth TR USD', 'Russell 2000 Pure Value TR USD',
        'Russell 2000 Momentum - Backfilled', 'Russell 2000 Quality Factor - Backfilled',
        'Russell 2000 Yield Factor - Backfilled', 'Russell 2000 Low Volatility - Backfilled',
    ],
    'USSC_3factor': [
        'Russell 2000 TR USD', 'Russell 2000 Pure Growth TR USD', 'Russell 2000 Pure Value TR USD'
    ]
}

# Style bucket groupings for the exposure summary view
# Maps each factor to a style bucket label
STYLE_BUCKET_MAP = {
    # Core / Blend
    'MSCI EAFE NR USD': 'Core', 'MSCI EM NR USD': 'Core', 'MSCI ACWI NR USD': 'Core',
    'MSCI ACWI Ex USA NR USD': 'Core', 'Russell 1000 TR USD': 'Core', 'Russell 2000 TR USD': 'Core',
    'Russell Mid Cap TR USD': 'Core', 'MSCI EAFE Small Cap NR USD': 'Core',
    'MSCI ACWI Ex USA Small NR USD': 'Core', 'MSCI EM Small NR USD': 'Core',
    # Growth
    'MSCI EAFE Growth NR USD': 'Growth', 'MSCI EM Growth NR USD': 'Growth',
    'MSCI ACWI Growth NR USD': 'Growth', 'MSCI ACWI Ex USA Growth NR USD': 'Growth',
    'Russell 1000 Pure Growth TR USD': 'Growth', 'Russell 2000 Pure Growth TR USD': 'Growth',
    'Russell Midcap Pure Growth TR USD': 'Growth',
    'MSCI EAFE Small Growth NR USD': 'Growth', 'MSCI ACWI Ex USA Small Growth NR USD': 'Growth',
    'MSCI EM Small Growth NR USD': 'Growth', 'MSCI ACWI Small Growth NR USD': 'Growth',
    # Value
    'MSCI EAFE Value NR USD': 'Value', 'MSCI EM Value NR USD': 'Value',
    'MSCI ACWI Value NR USD': 'Value', 'MSCI ACWI Ex USA Value NR USD': 'Value',
    'Russell 1000 Pure Value TR USD': 'Value', 'Russell 2000 Pure Value TR USD': 'Value',
    'Russell Midcap Pure Value TR USD': 'Value',
    'MSCI EAFE Small Value NR USD': 'Value', 'MSCI ACWI Ex USA Small Value NR USD': 'Value',
    'MSCI EM Small Value NR USD': 'Value', 'MSCI ACWI Small Value NR USD': 'Value',
    # Deep Value / Dividend
    'MSCI EAFE High Div Yld NR USD': 'Yield', 'MSCI EM High Dividend Yield NR USD': 'Yield',
    'MSCI ACWI High Dividend Yield NR USD': 'Yield', 'MSCI ACWI ex USA HDY NR USD': 'Yield',
    'Russell 1000 Yield Fctr TR USD': 'Yield', 'EAFE SC Div Yld': 'Yield',
    'Russell 2000 Yield Factor - Backfilled': 'Yield',
    # Quality
    'MSCI ACWI ex USA Quality NR USD': 'Quality', 'MSCI ACWI Quality NR USD': 'Quality',
    'Russell 1000 Quality Fctr TR USD': 'Quality', 'EAFE Quality': 'Quality',
    'EAFE SC Quality': 'Quality', 'MSCI EM Quality NR USD': 'Quality',
    'Russell 2000 Quality Factor - Backfilled': 'Quality',
    # Dynamic (Cyclical)
    'Russell Dev exUS LC Dynamic NR USD': 'Dynamic', 'Russell EM LC Dynamic NR USD': 'Dynamic',
    'EAFE Dynamic': 'Dynamic', 'EM SC Dynamic': 'Dynamic', 'EAFE SC Dynamic': 'Dynamic',
    'ACWIxUS SC Dynamic': 'Dynamic', 'Russell Global Dynamic NR USD': 'Dynamic',
    'Russell 1000 Dynamic - Backfilled': 'Dynamic', 'Russell 2000 Dynamic - Backfilled': 'Dynamic',
    'Russell Midcap Dynamic TR USD': 'Dynamic', 'ACWI SC Dynamic': 'Dynamic',
    # Defensive
    'Russell Dev exUS LC Defensive NR USD': 'Defensive', 'Russell EM LC Defensive NR USD': 'Defensive',
    'EAFE Defensive': 'Defensive', 'EM SC Defensive': 'Defensive', 'EAFE SC Defensive': 'Defensive',
    'ACWIxUS SC Defensive': 'Defensive', 'Russell Global Defensive NR USD': 'Defensive',
    'Russell 1000 Defensive TR USD': 'Defensive', 'Russell 2000 Defensive - Backfilled': 'Defensive',
    'Russell Midcap Defensive TR USD': 'Defensive', 'ACWI SC Def': 'Defensive',
    # Low Vol / Min Vol
    'MSCI EAFE Minimum Vol (USD) NR USD': 'Low Vol', 'MSCI EM Minimum Vol (USD) NR USD': 'Low Vol',
    'MSCI ACWI Minimum Vol (USD) NR USD': 'Low Vol', 'MSCI ACWI ex USA Min Vol (USD) NR USD': 'Low Vol',
    'Russell 1000 Volatility Fctr TR USD': 'Low Vol', 'Russell 2000 Low Volatility - Backfilled': 'Low Vol',
    'EAFE SC Low Vol': 'Low Vol',
    # Momentum
    'MSCI EAFE Momentum NR USD': 'Momentum', 'MSCI EM Momentum NR USD': 'Momentum',
    'MSCI ACWI Momentum NR USD': 'Momentum', 'MSCI World ex US Momentum NR USD': 'Momentum',
    'Russell 1000 Momentum Fctr TR USD': 'Momentum', 'Russell 2000 Momentum - Backfilled': 'Momentum',
    # Regional
    'MSCI United Kingdom NR USD': 'Core', 'MSCI Europe Ex UK NR USD': 'Core',
    'MSCI Japan NR USD': 'Core', 'MSCI China NR USD': 'Core',
    'MSCI EM Latin America NR USD': 'Core', 'Frontier': 'Core',
    'UK SC': 'Core', 'EuroxUK SC': 'Core', 'Japan SC': 'Core',
    'China SC': 'Core', 'Latin America SC': 'Core',
    # Small Cap regional
    'MSCI ACWI Small NR USD': 'Small Cap',
}

# Small cap factor names (for % small calculation)
SMALL_CAP_FACTORS = {
    'MSCI EAFE Small Cap NR USD', 'MSCI EAFE Small Growth NR USD', 'MSCI EAFE Small Value NR USD',
    'MSCI ACWI Ex USA Small NR USD', 'MSCI ACWI Ex USA Small Growth NR USD', 'MSCI ACWI Ex USA Small Value NR USD',
    'MSCI EM Small NR USD', 'MSCI EM Small Growth NR USD', 'MSCI EM Small Value NR USD',
    'MSCI ACWI Small NR USD', 'MSCI ACWI Small Growth NR USD', 'MSCI ACWI Small Value NR USD',
    'EAFE SC Dynamic', 'EAFE SC Defensive', 'EM SC Dynamic', 'EM SC Defensive',
    'ACWIxUS SC Dynamic', 'ACWIxUS SC Defensive', 'EAFE SC Quality', 'EAFE SC Div Yld', 'EAFE SC Low Vol',
    'UK SC', 'EuroxUK SC', 'Japan SC', 'China SC', 'Latin America SC',
    'Russell 2000 TR USD', 'Russell 2000 Pure Growth TR USD', 'Russell 2000 Pure Value TR USD',
    'Russell 2000 Dynamic - Backfilled', 'Russell 2000 Defensive - Backfilled',
    'Russell 2000 Momentum - Backfilled', 'Russell 2000 Quality Factor - Backfilled',
    'Russell 2000 Yield Factor - Backfilled', 'Russell 2000 Low Volatility - Backfilled',
}

# EM factor names (for % EM calculation)
EM_FACTORS = {
    'MSCI EM NR USD', 'Russell EM LC Dynamic NR USD', 'Russell EM LC Defensive NR USD',
    'MSCI EM Growth NR USD', 'MSCI EM Value NR USD', 'MSCI EM Momentum NR USD',
    'MSCI EM Quality NR USD', 'MSCI EM High Dividend Yield NR USD', 'MSCI EM Minimum Vol (USD) NR USD',
    'MSCI EM Small NR USD', 'MSCI EM Small Growth NR USD', 'MSCI EM Small Value NR USD',
    'MSCI China NR USD', 'MSCI EM Latin America NR USD', 'Frontier',
    'EM SC Dynamic', 'EM SC Defensive', 'China SC', 'Latin America SC',
}

VALUE_FACTORS = {
    'MSCI EAFE Value NR USD','MSCI EM Value NR USD','MSCI ACWI Value NR USD',
    'MSCI ACWI Ex USA Value NR USD','Russell 1000 Pure Value TR USD',
    'Russell 2000 Pure Value TR USD','Russell Midcap Pure Value TR USD',
    'MSCI EAFE Small Value NR USD','MSCI ACWI Ex USA Small Value NR USD',
    'MSCI EM Small Value NR USD','MSCI ACWI Small Value NR USD',
    'MSCI EAFE High Div Yld NR USD','MSCI EM High Dividend Yield NR USD',
    'MSCI ACWI High Dividend Yield NR USD','MSCI ACWI ex USA HDY NR USD',
    'Russell 1000 Yield Fctr TR USD','EAFE SC Div Yld',
    'MSCI ACWI ex USA Quality NR USD','MSCI ACWI Quality NR USD',
    'Russell 1000 Quality Fctr TR USD','EAFE Quality','EAFE SC Quality','MSCI EM Quality NR USD',
}

GROWTH_FACTORS = {
    'MSCI EAFE Growth NR USD','MSCI EM Growth NR USD','MSCI ACWI Growth NR USD',
    'MSCI ACWI Ex USA Growth NR USD','Russell 1000 Pure Growth TR USD',
    'Russell 2000 Pure Growth TR USD','Russell Midcap Pure Growth TR USD',
    'MSCI EAFE Small Growth NR USD','MSCI ACWI Ex USA Small Growth NR USD',
    'MSCI EM Small Growth NR USD','MSCI ACWI Small Growth NR USD',
}
