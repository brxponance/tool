// Client Restrictions / Client Preferences shown at the top of the report,
// under the cover and above the Holdings table.
//
// PLACEHOLDER CONTENT (2026-09-09): the same example text is shown for every
// client until guidelines are stored per client (weights workbook or DB).
// Replace the lookup in getClientGuidelines() when that lands.
export type ClientGuidelines = {
  restrictions: string[];
  preferences: string[];
};

const EXAMPLE_GUIDELINES: ClientGuidelines = {
  restrictions: [
    "New managers must be below $5 billion total AUM.",
    "Client allocation must not be greater than 25% of product AUM.",
    "New Managers must not have been in business greater than 10 years.",
  ],
  preferences: ["At least 50% of managers in portfolio majority DWBE."],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getClientGuidelines(_client: string): ClientGuidelines {
  return EXAMPLE_GUIDELINES;
}
