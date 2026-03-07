import fs from 'fs';
import path from 'path';

export function BriefingSample() {
  // Read the HTML at build time (server component)
  const htmlPath = path.join(process.cwd(), 'src/data/sample-briefing.html');

  let html = '';
  try {
    html = fs.readFileSync(htmlPath, 'utf-8');
  } catch (error) {
    console.error('Failed to read briefing HTML:', error);
    return (
      <div className="border-border bg-surface border p-6">
        <p className="text-muted font-mono text-sm">
          Sample briefing not available. Run{' '}
          <code className="bg-surface rounded px-1.5 py-0.5">npm run import-briefing</code>
        </p>
      </div>
    );
  }

  return (
    <div
      className="border-border bg-surface briefing-content border overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
