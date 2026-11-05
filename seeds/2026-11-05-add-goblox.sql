-- Adds goblox and the Go stack (2026-11-05). Safe to run more than once.
-- Upload go.svg to the cdn root first.

INSERT INTO stack (key, description, created_at, url, type, image_url)
SELECT 'Go', 'Go is an open source programming language that makes it simple to build secure, scalable systems.', 1793836800, 'https://go.dev/', 'language', 'https://cdn.phasenull.dev/go.svg'
WHERE NOT EXISTS (SELECT 1 FROM stack WHERE key = 'Go');

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793836800, 'goblox', 'Native Go port of the %{GHOSTLINK}%roblox-ts|https://roblox-ts.com%{GHOSTLINK}% compiler (TypeScript to Luau), built on %{GHOSTLINK}%typescript-go|https://github.com/microsoft/typescript-go%{GHOSTLINK}%, the native TypeScript 7 compiler. It''s a drop-in replacement for rbxtsc: same flags, same tsconfig.json, same Luau output.
rbxtsc builds of my games kept getting slower, so i ported the compiler. A 40 second build of Zomvival (~500 files) now takes 5 seconds, and an edit rebuilds in under a second.
%{HEADLINE}%Features| %{HEADLINE}%
- ~8x faster fresh builds than rbxtsc and up to 36x faster rebuilds, with ~25% less memory
- Incremental builds that only recompile the files a change can reach, and skip comment-only edits
- Watch mode: ~0.6 s from saving a file to "Found 0 errors"
- Same output as rbxtsc: 73/73 transform fixtures byte for byte, 874/874 runtime specs under Lune, 169/169 diagnostic fixtures
- %{GHOSTLINK}%@typetorch/transformer|https://github.com/typetorch/transformer%{GHOSTLINK}% ported to Go, running in-process and in parallel across files
- Prebuilt native binaries for Windows, macOS and Linux on npm, and %{GHOSTLINK}%TypeTorch|https://github.com/typetorch%{GHOSTLINK}% uses it automatically

Available on npm %{GHOSTLINK}%here|https://www.npmjs.com/package/goblox%{GHOSTLINK}%.', 1793221200, NULL, NULL, NULL, NULL, 'https://www.npmjs.com/package/goblox', 'https://github.com/typetorch/goblox-ts', 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'goblox');

INSERT OR IGNORE INTO project_to_stack (project_id, stack_id)
SELECT p.id, s.id FROM projects p, stack s
WHERE p.title = 'goblox' AND s.key IN ('Go', 'TypeScript', 'roblox-ts', 'luau');
