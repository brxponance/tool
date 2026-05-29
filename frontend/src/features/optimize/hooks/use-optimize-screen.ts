"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getOptimizeCandidates,
  runOptimizer,
} from "../api/get-optimize-data";
import {
  DEFAULT_CONSTRAINTS,
  type ForcedManagerInput,
  type OptimizerCandidate,
  type OptimizerConstraints,
  type OptimizerResponse,
  type PeerGroup,
} from "../types";

type CandidatesState = {
  data: OptimizerCandidate[];
  loading: boolean;
  error: string | null;
};

type ResultState = {
  data: OptimizerResponse | null;
  loading: boolean;
  error: string | null;
};

const initialCandidates: CandidatesState = { data: [], loading: false, error: null };
const initialResult: ResultState = { data: null, loading: false, error: null };

export function useOptimizeScreen() {
  const [peerGroup, setPeerGroup] = useState<PeerGroup>("EAFE");
  const [constraints, setConstraints] = useState<OptimizerConstraints>(DEFAULT_CONSTRAINTS);
  const [forcedManagers, setForcedManagers] = useState<ForcedManagerInput[]>([]);
  const [candidates, setCandidates] = useState<CandidatesState>(initialCandidates);
  const [result, setResult] = useState<ResultState>(initialResult);
  const candidatesCache = useRef<Map<string, OptimizerCandidate[]>>(new Map());

  const loadCandidates = useCallback(async (group: string) => {
    const cached = candidatesCache.current.get(group);
    if (cached) {
      setCandidates({ data: cached, loading: false, error: null });
      return;
    }
    setCandidates((curr) => ({ ...curr, loading: true, error: null }));
    try {
      const res = await getOptimizeCandidates(group);
      candidatesCache.current.set(group, res.candidates);
      setCandidates({ data: res.candidates, loading: false, error: null });
    } catch (err) {
      setCandidates({
        data: [],
        loading: false,
        error:
          err instanceof Error
            ? err.message
            : "Unable to load eligible candidates.",
      });
    }
  }, []);

  useEffect(() => {
    void loadCandidates(peerGroup);
  }, [peerGroup, loadCandidates]);

  const updateConstraint = useCallback(
    <K extends keyof OptimizerConstraints>(key: K, value: OptimizerConstraints[K]) => {
      setConstraints((curr) => ({ ...curr, [key]: value }));
    },
    [],
  );

  const addForcedManager = useCallback((fm: ForcedManagerInput) => {
    setForcedManagers((curr) => {
      // Disallow same name+tab twice. User can update the existing entry instead.
      if (curr.some((m) => m.name === fm.name && m.tab === fm.tab)) {
        return curr;
      }
      return [...curr, fm];
    });
  }, []);

  const updateForcedManager = useCallback(
    (index: number, partial: Partial<ForcedManagerInput>) => {
      setForcedManagers((curr) =>
        curr.map((m, i) => (i === index ? { ...m, ...partial } : m)),
      );
    },
    [],
  );

  const removeForcedManager = useCallback((index: number) => {
    setForcedManagers((curr) => curr.filter((_, i) => i !== index));
  }, []);

  const runOptimization = useCallback(async () => {
    setResult({ data: null, loading: true, error: null });
    try {
      const res = await runOptimizer({
        peer_group: peerGroup,
        forced_managers: forcedManagers,
        ...constraints,
      });
      setResult({ data: res, loading: false, error: null });
    } catch (err) {
      setResult({
        data: null,
        loading: false,
        error:
          err instanceof Error
            ? err.message
            : "Optimizer request failed.",
      });
    }
  }, [peerGroup, forcedManagers, constraints]);

  return {
    peerGroup,
    setPeerGroup,
    constraints,
    updateConstraint,
    forcedManagers,
    addForcedManager,
    updateForcedManager,
    removeForcedManager,
    candidates,
    result,
    runOptimization,
  };
}
