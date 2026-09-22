// The Quarterly Portfolio Report PDF is one landscape Letter page per entry
// here, in order. Each id wraps a slice of the report sheet in
// report-route.tsx:
//   page 1  cover · client restrictions / preferences · holdings ·
//           V-G positioning + skill / ownership · FactSet risk
//   page 2  exposures (four cards across) · trailing performance ·
//           calendar years
//   page 3  quarterly excess · ideal complements
//   page 4  guideline compliance · five largest active risks (illustrative
//           stress) · worst quarters · positioning vs house views
// Market cycle and MCR are not part of the report (removed 2026-09-09, user
// request).
export const PDF_CAPTURE_PAGES = [
  "rpt-pdf-page-1",
  "rpt-pdf-page-2",
  "rpt-pdf-page-3",
  "rpt-pdf-page-4",
] as const;
