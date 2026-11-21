-- Updates TypeTorch for the typetorch.dev docs, the live demo and the mobile app (2026-11-21). Safe to run more than once.
-- Upload typetorch_docs_*.png (from typetorch.dev/screenshots) to uploads/ first.

UPDATE projects SET description = 'Framework and deploy toolchain for %{GHOSTLINK}%roblox-ts|https://roblox-ts.com%{GHOSTLINK}% games that updates live Roblox games without restarting their servers. Each build is uploaded once as a private model asset, and every live server hot-swaps to it in a few seconds while players stay in the game.
Shutting servers down for every update kills player counts, so i built this and my own games (The Prison, Zomvival, Slime Merge) now deploy through it.

Docs are at %{GHOSTLINK}%typetorch.dev|https://www.typetorch.dev%{GHOSTLINK}%, and there''s a %{GHOSTLINK}%Live demo|https://demo.typetorch.dev%{GHOSTLINK}% of the backend explorer with anonymized data from The Prison, running entirely in your browser.
%{HEADLINE}%Features| %{HEADLINE}%
- Hot-swap deploys: server and client code swap mid-session, and state marked to survive the swap carries over
- Safe deploys: a cloud test before every prod publish, a health window that rolls a failing build back on each server, and deploy --wait rolls the whole branch back when a build fails on 20% of servers
- Rollbacks & promotes: roll prod back to any earlier build or promote a tested dev build, every build carries its git identity
- Branches & channels: public servers run prod while private and reserved servers can run any branch, and owners can switch a live server to another branch in place
- Prod signing: prod builds are Ed25519-signed on your own machine and checked by every prod server, and agents or scripts can only propose a deploy that a person approves, with no hosted CI
- Framework: hot-swappable modules with dependency injection and lifecycles, troves, guarded & rate-limited networking, cross-server messaging, signed live config, scheduled live events, hot assets and an in-game dev menu
- Studio loop: typetorch serve and the Studio plugin run local code with the real kernel, reload a running playtest on save, publish hot assets and have a Claude tab
- Self-hosted backend & web explorer (optional): live servers with alerts, error logs and debug bundles, live debug of a single server, analytics with experiments, funnels, retention, first-session recordings and heatmaps, notifications, player feedback and live events
- Mobile app (Android, early): Roblox analytics and tools for your games, your backend''s pages, home-screen widgets with live numbers and server health, and milestone pushes
- Compiler: uses %{GHOSTLINK}%goblox|https://github.com/typetorch/goblox-ts%{GHOSTLINK}%, my Go port of roblox-ts, when it''s installed, for ~8x faster builds
- Agent friendly: llms.txt, an agent playbook and a Claude Code skill to move existing games over, including a codemod for Flamework games

Source code is on GitHub %{GHOSTLINK}%here|https://github.com/typetorch%{GHOSTLINK}% and the packages are on npm %{GHOSTLINK}%here|https://www.npmjs.com/org/typetorch%{GHOSTLINK}%

%{IMAGE_CAROUSEL}%TypeTorch|https://cdn.phasenull.dev/uploads/typetorch_docs_overview.png,https://cdn.phasenull.dev/uploads/typetorch_docs_fleet.png,https://cdn.phasenull.dev/uploads/typetorch_docs_recordings.png,https://cdn.phasenull.dev/uploads/typetorch_docs_mobile_projects.png,https://cdn.phasenull.dev/uploads/typetorch_docs_mobile_analytics.png,https://cdn.phasenull.dev/uploads/typetorch_docs_mobile_fleet.png,https://cdn.phasenull.dev/uploads/typetorch_docs_mobile_widgets_home.png,https://cdn.phasenull.dev/uploads/typetorch_docs_mobile_widgets_settings.png,https://cdn.phasenull.dev/uploads/typetorch_01.png,https://cdn.phasenull.dev/uploads/typetorch_02.png,https://cdn.phasenull.dev/uploads/typetorch_03.png,https://cdn.phasenull.dev/uploads/typetorch_04.png,https://cdn.phasenull.dev/uploads/typetorch_05.png,https://cdn.phasenull.dev/uploads/typetorch_06.png,https://cdn.phasenull.dev/uploads/typetorch_07.png,https://cdn.phasenull.dev/uploads/typetorch_08.png,https://cdn.phasenull.dev/uploads/typetorch_09.png,https://cdn.phasenull.dev/uploads/typetorch_10.png,https://cdn.phasenull.dev/uploads/typetorch_11.png,https://cdn.phasenull.dev/uploads/typetorch_12.png,https://cdn.phasenull.dev/uploads/typetorch_13.png,https://cdn.phasenull.dev/uploads/typetorch_14.png,https://cdn.phasenull.dev/uploads/typetorch_15.png,https://cdn.phasenull.dev/uploads/typetorch_16.png,https://cdn.phasenull.dev/uploads/typetorch_17.png%{IMAGE_CAROUSEL}%', url = 'https://www.typetorch.dev/docs' WHERE title = 'TypeTorch';

UPDATE stack SET url = 'https://www.typetorch.dev' WHERE key = 'TypeTorch';
