# seeds

One-off SQL for the production D1 database (`phasenull-dev`). Each file is safe to run more than once.

## 2026-10-29-add-projects.sql

Adds TypeTorch, Zomvival, Slime Merge, Cart or Die, @rbxts/react-query and FKart, renames "Project CECOT (The Prison)"
to "The Prison", adds the repo link to nexus, and adds the TypeTorch stack (linked to The Prison, Zomvival and
Slime Merge).

1. Upload the screenshots the descriptions reference (from `../new-project-media/`):

   ```sh
   for f in cartordie_icon.png cartordie_thumb_{1..4}.png slimemerge_{1..5}.png; do
     npx wrangler r2 object put "phasenull-dev/uploads/$f" --file "../new-project-media/$f" \
       --content-type image/png --cache-control "public, max-age=31536000, immutable" --remote
   done
   # stack icon, at the cdn root like the other stack icons
   npx wrangler r2 object put "phasenull-dev/typetorch.svg" --file "../new-project-media/typetorch.svg" \
     --content-type image/svg+xml --cache-control "public, max-age=31536000, immutable" --remote
   ```

2. Insert the projects:

   ```sh
   npx wrangler d1 execute phasenull-dev --remote --file seeds/2026-10-29-add-projects.sql
   ```

3. The public `/projects/all` response is cached in KV for 7 days. Refresh it by saving any project in the admin
   panel, or delete the cache key:

   ```sh
   npx wrangler kv key delete projects_all --binding KV --remote
   ```
