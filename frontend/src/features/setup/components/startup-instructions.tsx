import { DEFAULT_BACKEND_URL } from "@/lib/constants";

const blocks = [
  {
    title: "Start the Python backend",
    lines: ['cd "clone_tool"', "python run.py"],
    footnote: `Expected backend url: ${DEFAULT_BACKEND_URL}`,
  },
  {
    title: "Start the Next.js frontend",
    lines: ['cd "frontend"', "npm run dev"],
    footnote: "Frontend runs on http://127.0.0.1:3000 by default.",
  },
];

export function StartupInstructions() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {blocks.map((block) => (
        <article
          key={block.title}
          className="rounded-[22px] border border-line bg-panel-strong p-5 text-white"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/60">
            Local workflow
          </p>
          <h4 className="mt-3 text-lg font-medium tracking-[-0.03em]">{block.title}</h4>
          <div className="mt-4 rounded-[18px] border border-white/10 bg-black/20 p-4 font-mono text-sm">
            {block.lines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-white/70">{block.footnote}</p>
        </article>
      ))}
    </div>
  );
}