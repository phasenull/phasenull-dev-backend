-- Adds new portfolio projects (2026-10-29). Safe to run more than once: rows whose title already exists are skipped.
-- Apply to production with: npx wrangler d1 execute phasenull-dev --remote --file seeds/2026-10-29-add-projects.sql
-- Upload the images first (see seeds/README.md), the descriptions reference them on cdn.phasenull.dev.

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793232000, 'TypeTorch', 'Hot-swap deploy toolchain for %{GHOSTLINK}%roblox-ts|https://roblox-ts.com%{GHOSTLINK}% games. Every build is uploaded as a private model asset and live Roblox servers swap to it in a few seconds, without restarting servers or kicking players.
Shutting servers down for every update kills player counts, so i built this and my own games (The Prison, Zomvival, Slime Merge) now deploy through it.
%{HEADLINE}%Features| %{HEADLINE}%
- Hot-swap deploys: live servers swap to a new build mid-session, and state marked to survive the swap carries over
- Rollbacks & promotes: roll prod back to any earlier build or promote a tested dev build, every build carries its git identity
- Branches & channels: git branches map to TypeTorch branches, public servers run prod while private servers can run any branch
- Fleet management: every live server and what it did with each deploy, alerts within seconds when something breaks (reported by the kernel, so it works even when a build is broken), and kick / ban / shut down / migrate servers from the in-game dev menu
- Analytics: self-hosted on DuckDB or Cloudflare, every event tagged with the build that was live so builds and experiments can be compared, plus per-minute error logs
- Cross-server messaging and a live server list for game code
- Prod signing: prod releases are Ed25519-signed on your own machine and checked by every prod server, so nothing running inside the game can make prod load code
- Deploy approvals: agents and scripts can only propose a deploy and a person approves it, no hosted CI
- Framework: hot-swappable modules with dependency injection, lifecycles, troves, guarded & rate-limited networking and an in-game dev menu
- Tooling: a roblox-ts transformer (generated type guards, DI metadata), a Studio plugin (live sync, pushing code into running playtests, hot assets) and remote-claude for prompting Claude Code from inside a live dev server

Source code and docs are available on GitHub %{GHOSTLINK}%here|https://github.com/typetorch%{GHOSTLINK}% and the packages on npm %{GHOSTLINK}%here|https://www.npmjs.com/org/typetorch%{GHOSTLINK}%', 1790802000, NULL, NULL, NULL, 'Early stage, APIs still change', 'https://www.npmjs.com/org/typetorch', 'https://github.com/typetorch', 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'TypeTorch');

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793232000, 'Zomvival', 'Round-based zombie survival game on Roblox, written in roblox-ts on top of %{GHOSTLINK}%TypeTorch|https://github.com/typetorch%{GHOSTLINK}% so updates go live without restarting servers.
%{HEADLINE}%Features| %{HEADLINE}%
- Map vote and round loop (Corridor, Hedge Maze, Rooftops)
- Item shop with melee, ranged, explosive and support weapons
- Downed & revive system with physics ragdolls
- Mobs driven by behaviour trees
- In-game admin console for testing and support

Teaser trailer on YouTube is available %{GHOSTLINK}%here|https://www.youtube.com/watch?v=6dtTSBfBYw0%{GHOSTLINK}%
Available on ROBLOX %{GHOSTLINK}%here|https://www.roblox.com/games/91583828298577/Gnome-Game%{GHOSTLINK}%', 1790802000, NULL, NULL, NULL, 'Work in progress', 'https://www.roblox.com/games/91583828298577/Gnome-Game', NULL, 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Zomvival');

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793232000, 'Slime Merge', 'Roblox game where you merge slimes into higher tiers on your plot, written in roblox-ts and deployed with %{GHOSTLINK}%TypeTorch|https://github.com/typetorch%{GHOSTLINK}%.
%{HEADLINE}%Features| %{HEADLINE}%
- Slime merging with 26 tiers and server-authoritative slime replication
- Upgrades, rebirths and chapter-based progression
- Economy balanced around documented cash sources, sinks and pacing checks
- Lane-defence battle system (planned)

%{IMAGE_CAROUSEL}%Screenshots|https://cdn.phasenull.dev/uploads/slimemerge_1.png,https://cdn.phasenull.dev/uploads/slimemerge_2.png,https://cdn.phasenull.dev/uploads/slimemerge_3.png,https://cdn.phasenull.dev/uploads/slimemerge_4.png,https://cdn.phasenull.dev/uploads/slimemerge_5.png%{IMAGE_CAROUSEL}%', 1785531600, NULL, NULL, NULL, 'Work in progress, not released yet', NULL, NULL, 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Slime Merge');

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793232000, 'Cart or Die', 'Roblox game where you ride a shopping cart down a giant slide and see how far you can get, made with roblox-ts, %{GHOSTLINK}%Flamework|https://flamework.fireboltofdeath.dev%{GHOSTLINK}% and @rbxts/react.
I also wrote a small %{GHOSTLINK}%backend|https://github.com/phasenull/cart-game-backend%{GHOSTLINK}% for it using Hono, Drizzle and Cloudflare D1 (with OpenAPI docs) for player sessions, leaderboards and in-game feedback.
%{HEADLINE}%Features| %{HEADLINE}%
- Physics-driven carts with tunable handling
- Checkpoints, cart customization and a shop
- Discord rewards for supporters
- Async data in the UI using my own %{GHOSTLINK}%@rbxts/react-query|https://github.com/phasenull/rbxts-react-query%{GHOSTLINK}%

As of October 2026 it has 56K+ visits.

%{IMAGE_CAROUSEL}%Thumbnails|https://cdn.phasenull.dev/uploads/cartordie_thumb_1.png,https://cdn.phasenull.dev/uploads/cartordie_thumb_2.png,https://cdn.phasenull.dev/uploads/cartordie_thumb_3.png,https://cdn.phasenull.dev/uploads/cartordie_thumb_4.png%{IMAGE_CAROUSEL}%

Available on ROBLOX %{GHOSTLINK}%here|https://www.roblox.com/games/111117843453520%{GHOSTLINK}% and the source code on GitHub %{GHOSTLINK}%here|https://github.com/phasenull/robloxts-cart-game%{GHOSTLINK}%', 1769893200, 1772312400, 'https://cdn.phasenull.dev/uploads/cartordie_icon.png', NULL, NULL, 'https://www.roblox.com/games/111117843453520', 'https://github.com/phasenull/robloxts-cart-game', 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Cart or Die');

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793232000, '@rbxts/react-query', 'Port of %{GHOSTLINK}%@tanstack/react-query|https://tanstack.com/query%{GHOSTLINK}% for roblox-ts, published on npm.
I made it for my own games since there wasn''t a proper way to fetch, cache and mutate async data in @rbxts/react components.
%{HEADLINE}%Features| %{HEADLINE}%
- useQuery with stale time, retries (exponential backoff), refetch intervals, select, initial & placeholder data
- useMutation with retries and onSuccess / onError / onSettled callbacks
- useInfiniteQuery for paginated data
- QueryClient: invalidateQueries, setQueryData, prefetchQuery, fetchQuery and per-query defaults

Available on npm %{GHOSTLINK}%here|https://www.npmjs.com/package/@rbxts/react-query%{GHOSTLINK}% (v2 is in beta) and the source code on GitHub %{GHOSTLINK}%here|https://github.com/phasenull/rbxts-react-query%{GHOSTLINK}%', 1767214800, 1772312400, NULL, NULL, NULL, 'https://www.npmjs.com/package/@rbxts/react-query', 'https://github.com/phasenull/rbxts-react-query', 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = '@rbxts/react-query');

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793232000, 'FKart', 'Open-source public transit app & data archive for Kocaeli (also supports 23 other cities that use %{GHOSTLINK}%KentKart|https://www.kentkart.com/%{GHOSTLINK}%).
Rewrite of FKart [Legacy] from scratch with Expo, after the old codebase got out of hand.
%{HEADLINE}%Features| %{HEADLINE}%
- Realtime tracking of every bus in the city
- Passenger information: realtime bus locations, route details, card balances etc.
- Realtime vehicle tracking archive collected by %{GHOSTLINK}%kentkart-vts-observer|https://github.com/phasenull/kentkart-vts-observer%{GHOSTLINK}%
- Bus images matched to license plates and media uploads by community editors
- Account-less session settings saved to the FKart database

Source code is available on GitHub %{GHOSTLINK}%here|https://github.com/phasenull/FKart-Rewritten%{GHOSTLINK}%', 1701378000, 1767214800, NULL, NULL, NULL, NULL, 'https://github.com/phasenull/FKart-Rewritten', 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'FKart');

-- The Prison: drop the internal code name from the title
UPDATE projects SET title = 'The Prison' WHERE title = 'Project CECOT (The Prison)';

-- nexus: now open source, so add the repo link and drop the "can't be open sourced" disclaimer (repo_url is only shown in the admin preview, so also link it in the description)
UPDATE projects SET repo_url = 'https://github.com/phasenull/nexus', disclaimer = NULL,
  description = rtrim(description, char(10)) || '
Source code is available on GitHub %{GHOSTLINK}%here|https://github.com/phasenull/nexus%{GHOSTLINK}%'
WHERE title = 'nexus' AND repo_url IS NULL;

-- roundcube-mobile: reword the 'Vibe coded project' disclaimer
UPDATE projects SET disclaimer = 'Pre smart-LLM era project (frontend written with Claude Sonnet 4)' WHERE title = 'roundcube-mobile' AND disclaimer = 'Vibe coded project';

-- TypeTorch stack (icon: typetorch/docs brand/typetorch.svg, uploaded to the cdn root like the other stack icons)
INSERT INTO stack (key, description, created_at, url, type, image_url)
SELECT 'TypeTorch', 'Hot-swap deploys for roblox-ts games.
TypeTorch updates live Roblox games without restarting their servers: every build is uploaded as a private model asset and live servers swap to it in a few seconds while players stay in the game.', 1793232000, 'https://github.com/typetorch', 'framework', 'https://cdn.phasenull.dev/typetorch.svg'
WHERE NOT EXISTS (SELECT 1 FROM stack WHERE key = 'TypeTorch');

-- games that run on TypeTorch
INSERT OR IGNORE INTO project_to_stack (project_id, stack_id)
SELECT p.id, s.id FROM projects p, stack s
WHERE s.key = 'TypeTorch' AND p.title IN ('The Prison', 'Zomvival', 'Slime Merge');

-- tech stack links for every project, taken from each repo's dependencies (no visible project had any before)
WITH m(title, key) AS (VALUES
	('TypeTorch', 'TypeScript'),
	('TypeTorch', 'roblox-ts'),
	('TypeTorch', 'luau'),
	('Slime Merge', 'TypeScript'),
	('Slime Merge', 'roblox-ts'),
	('Zomvival', 'TypeScript'),
	('Zomvival', 'roblox-ts'),
	('Zomvival', 'ReactJS'),
	('The Prison', 'TypeScript'),
	('The Prison', 'roblox-ts'),
	('Cart or Die', 'TypeScript'),
	('Cart or Die', 'roblox-ts'),
	('Cart or Die', 'ReactJS'),
	('Cart or Die', 'HonoJS'),
	('@rbxts/react-query', 'TypeScript'),
	('@rbxts/react-query', 'roblox-ts'),
	('@rbxts/react-query', 'ReactJS'),
	('FKart', 'TypeScript'),
	('FKart', 'React Native'),
	('FKart', 'Expo'),
	('FKart', 'Tailwind CSS'),
	('FKart [Legacy]', 'TypeScript'),
	('FKart [Legacy]', 'React Native'),
	('FKart [Legacy]', 'Expo'),
	('FKart [Legacy]', 'Tailwind CSS'),
	('roundcube-mobile', 'TypeScript'),
	('roundcube-mobile', 'React Native'),
	('roundcube-mobile', 'Expo'),
	('roundcube-mobile', 'Tailwind CSS'),
	('MyFone', 'TypeScript'),
	('MyFone', 'React Native'),
	('MyFone', 'Expo'),
	('STO-DiscordBot', 'TypeScript'),
	('STO-DiscordBot', 'DiscordJS'),
	('STO-DiscordBot', 'ExpressJS'),
	('nexus', 'JavaScript'),
	('nexus', 'ReactJS'),
	('nexus', 'ExpressJS'),
	('nexus', 'MongoDB'),
	('nexus', 'Tailwind CSS'),
	('nexus', 'luau'),
	('PattisBot', 'Python'),
	('Robbery Bag System', 'luau')
)
INSERT OR IGNORE INTO project_to_stack (project_id, stack_id)
SELECT p.id, s.id FROM m JOIN projects p ON p.title = m.title JOIN stack s ON s.key = m.key;
