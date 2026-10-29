-- Adds the projects from github.com/phasenull/relics (2026-10-29). Safe to run more than once.
-- Apply to production with: cf d1 query <database-id> --batch (see seeds/README.md)
-- Upload relics_vehicle_render.png to uploads/ first.

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793232000, 'Minecraft Minigames', 'Minigames I wrote in %{GHOSTLINK}%Skript|https://github.com/SkriptLang/Skript%{GHOSTLINK}% for Turkish Minecraft community servers, before I got into Roblox.
%{HEADLINE}%Features| %{HEADLINE}%
- Game hub: signs teleport players into a game and back to the lobby, with commands to add and remove games
- Tron: a light-cycle minigame, players ride an invisible vehicle and get eliminated if they stop or crash
- Dice: a two-dice roll shown to every player with titles, sounds and a "double" bonus
- Guess the number: the server picks a number and answers "higher" or "lower" in chat

Source code is available on GitHub %{GHOSTLINK}%here|https://github.com/phasenull/relics/tree/master/scripts%{GHOSTLINK}%', 1572555600, 1612126800, NULL, NULL, NULL, NULL, 'https://github.com/phasenull/relics', 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Minecraft Minigames');

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793232000, 'Minecraft Vehicles', 'Vehicles and effects in vanilla Minecraft, made in Skript without any mods: every vehicle is a set of invisible armor stands wearing blocks, moved along with the player.
%{HEADLINE}%Features| %{HEADLINE}%
- Planes you can fly, rebuilt around the player every tick
- A rocket launch with a server-wide 10 second countdown
- A controllable rocket launcher: fly up with an elytra and fireworks, then call a TNT strike on the spot you marked
- An animated block display that cycles through blocks on an armor stand

Source code is available on GitHub %{GHOSTLINK}%here|https://github.com/phasenull/relics/tree/master/scripts%{GHOSTLINK}%', 1572555600, 1612126800, NULL, NULL, NULL, NULL, 'https://github.com/phasenull/relics', 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Minecraft Vehicles');

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793232000, 'Blockbench Vehicle Models', 'Low-poly vehicle models for Minecraft, made in %{GHOSTLINK}%Blockbench|https://www.blockbench.net/%{GHOSTLINK}% as Java block models.
%{HEADLINE}%Features| %{HEADLINE}%
- Limousine (95 elements)
- Monster truck (65 elements, with a separate wheels model)
- A dragon model, "EJDERYA"

%{IMAGE}%Vehicle model render|https://cdn.phasenull.dev/uploads/relics_vehicle_render.png%{IMAGE}%

Source code is available on GitHub %{GHOSTLINK}%here|https://github.com/phasenull/relics/tree/master/arabalar%{GHOSTLINK}%', 1572555600, 1612126800, NULL, NULL, NULL, NULL, 'https://github.com/phasenull/relics', 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Blockbench Vehicle Models');

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793232000, 'Minecraft SkriptLang Projects', 'Utility plugins I wrote in %{GHOSTLINK}%Skript|https://github.com/SkriptLang/Skript%{GHOSTLINK}% for the Minecraft servers I helped run.
%{HEADLINE}%Features| %{HEADLINE}%
- Bank: deposit and withdraw in-game money, with a PIN that opens a 10 second withdraw window
- Login gate: players set a password in chat on first join and have to enter it before they can move
- Bot protection on join, and custom join and leave messages
- Region alerts: entering a listed "dangerous" region blinds the player, plus a kill counter for zombies
- Countdowns broadcast to every player that run a command when they finish
- A pet shop menu (never finished)

Source code is available on GitHub %{GHOSTLINK}%here|https://github.com/phasenull/relics/tree/master/scripts%{GHOSTLINK}%', 1531083600, 1612126800, NULL, NULL, NULL, NULL, 'https://github.com/phasenull/relics', 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Minecraft SkriptLang Projects');

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793232000, 'LEDO String Obfuscator', 'A small Python tool to obfuscate strings for LEDO, my Roblox group.
A seed between 50 and 1000 shifts every character and pads it with random noise, and the creation time is hidden inside the output so it can be read back later with the same seed.

Source code is available on GitHub %{GHOSTLINK}%here|https://github.com/phasenull/relics/blob/master/LEDOStringObfuscator.py%{GHOSTLINK}%', 1675198800, 1675198800, NULL, NULL, 'Naive project, not real encryption', NULL, 'https://github.com/phasenull/relics/blob/master/LEDOStringObfuscator.py', 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'LEDO String Obfuscator');

WITH m(title, key) AS (VALUES
	('LEDO String Obfuscator', 'Python')
)
INSERT OR IGNORE INTO project_to_stack (project_id, stack_id)
SELECT p.id, s.id FROM m JOIN projects p ON p.title = m.title JOIN stack s ON s.key = m.key;
