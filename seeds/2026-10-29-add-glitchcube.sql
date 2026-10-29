-- Adds Glitch Cube Minecraft Server (2026-10-29). Safe to run more than once.
-- Upload glitchcube_01.png .. glitchcube_13.png to uploads/ first.

INSERT INTO projects (created_at, title, description, project_start_date, project_end_date, thumbnail_url, org_id, disclaimer, url, repo_url, is_visible)
SELECT 1793232000, 'Glitch Cube Minecraft Server', 'A Minecraft server built on custom plugins and a custom resource pack, aiming for %{GHOSTLINK}%Unturned|https://store.steampowered.com/app/304930/Unturned/%{GHOSTLINK}%-like survival gameplay inside Minecraft.
%{HEADLINE}%Features| %{HEADLINE}%
- Guns with magazines and ammo counts (Glock, rifles) and a rocket launcher, all with custom 3D models
- Drivable cars: a sedan and a convertible, with Turkish license plates
- A SWAT helicopter with a minigun (work in progress)
- Low-poly vehicle and weapon models made in %{GHOSTLINK}%Blockbench|https://www.blockbench.net/%{GHOSTLINK}%, shipped in the server''s resource pack
- Survival HUD with health and stamina, and a spawn town with loot spots

%{IMAGE_CAROUSEL}%Glitch Cube|https://cdn.phasenull.dev/uploads/glitchcube_01.png,https://cdn.phasenull.dev/uploads/glitchcube_02.png,https://cdn.phasenull.dev/uploads/glitchcube_03.png,https://cdn.phasenull.dev/uploads/glitchcube_04.png,https://cdn.phasenull.dev/uploads/glitchcube_05.png,https://cdn.phasenull.dev/uploads/glitchcube_06.png,https://cdn.phasenull.dev/uploads/glitchcube_07.png,https://cdn.phasenull.dev/uploads/glitchcube_08.png,https://cdn.phasenull.dev/uploads/glitchcube_09.png,https://cdn.phasenull.dev/uploads/glitchcube_10.png,https://cdn.phasenull.dev/uploads/glitchcube_11.png,https://cdn.phasenull.dev/uploads/glitchcube_12.png,https://cdn.phasenull.dev/uploads/glitchcube_13.png%{IMAGE_CAROUSEL}%', 1543611600, 1551387600, NULL, NULL, NULL, NULL, NULL, 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Glitch Cube Minecraft Server');
