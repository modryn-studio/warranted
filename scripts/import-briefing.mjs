import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure marked for GitHub-style rendering
marked.setOptions({
  gfm: true,
  breaks: true,
});

async function importBriefing() {
  console.log('[import-briefing] Fetching briefing from GitHub...');

  // Change this URL to display a different briefing
  const briefingUrl =
    'https://raw.githubusercontent.com/modryn-studio/trend-detector/main/briefings/briefing_2026-03-05.md';

  // Get GitHub token from environment (needed for private repos)
  const githubToken = process.env.GITHUB_TOKEN;

  const headers = {};
  if (githubToken) {
    headers['Authorization'] = `Bearer ${githubToken}`;
    console.log('[import-briefing] Using GITHUB_TOKEN for authentication');
  } else {
    console.log('[import-briefing] Warning: GITHUB_TOKEN not found. This will fail for private repos.');
  }

  try {
    const response = await fetch(briefingUrl, { headers });
    if (!response.ok) {
      if (response.status === 404 && !githubToken) {
        throw new Error(`Failed to fetch: ${response.statusText}. The repository might be private. Set GITHUB_TOKEN environment variable.`);
      }
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const markdown = await response.text();
    console.log('[import-briefing] Converting markdown to HTML...');

    // Convert markdown to HTML
    const html = marked.parse(markdown);

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save HTML
    const htmlPath = path.join(dataDir, 'sample-briefing.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`[import-briefing] ✓ Saved HTML to ${htmlPath}`);

    // Also save raw markdown for reference
    const mdPath = path.join(dataDir, 'sample-briefing.md');
    fs.writeFileSync(mdPath, markdown);
    console.log(`[import-briefing] ✓ Saved markdown to ${mdPath}`);

    console.log('[import-briefing] Done!');
  } catch (error) {
    console.error('[import-briefing] Error:', error);
    process.exit(1);
  }
}

importBriefing();
