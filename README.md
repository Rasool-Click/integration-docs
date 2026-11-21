# WESSAAL Developers — Integration API Docs

Source for WESSAAL Linked Devices integration API documentation.

## Build / preview

- Install: npm ci
- Build: npm run build
- Local preview: npm run preview -- --host 127.0.0.1 --port 4176
- Static deployment: upload CONTENTS of dist/ so index.html is the hosting root.
- Editable source: keep the source repository and build in the hosting pipeline.

## WhatsApp group messaging (added 2026-11-04)

- /#whatsapp-groups — guide (connect, import, list, send, track).
- /#groups-list — GET /integration/v1/groups; manage_instances.
- /#sync-address-book — POST /integration/v1/instances/{instanceId}/sync-address-book; manage_instances.
- /#send-group — POST /integration/v1/messages/send-group; send_message; unique Idempotency-Key header (1–128 characters).
- /#message-status — GET /integration/v1/messages/{messageId}/status; read_messages.

Source of truth: Rasool-Click/linked-devices dev, routes/integrations.php and
app/Http/Controllers/Api/Integration/GroupController.php, inspected 2026-11-04.

## Delivery and staging limitations

This site documents implemented routes; real WhatsApp group delivery is not
yet independently proven. Sending is feature-gated. Staging dry_run=true
validates key scope and outbound policy only; it does not contact WhatsApp,
create a send job, or bill. Real staging group delivery requires an isolated,
approved test group and dedicated provider. An import API 202 means only the
import jobs were queued; it is NOT a guarantee that contacts/groups imported.

Never commit an actual API key or put it in a frontend application.
All example values are placeholders.

## Release status

Updated locally and ready for your review/upload. Not pushed to GitHub or
deployed automatically. Original documentation UI styling is preserved.

## WSL-024 — production SEO / SSG deployment gate

The `build` script uses **vite-ssg build** (not `vite build`). Page sections are hash-based; `/` is the canonical prerendered page. The legacy `/linked` path redirects to `/`.

After an approved **CI** build, run `node scripts/check-ssg-output.mjs` against `dist/`. It fails if the homepage is a blank SPA shell or SEO outputs are missing.

Before deploying to docs.wessaal.com:
1. Verify the active Nginx `root` and existing `location` directives. Upload the contents of `dist/` to that root.
2. Review the example `deploy/nginx-docs-locations.conf.example` and **replace** the existing fallback `location /` with the documented 404-safe rule (do not append conflicting locations).
3. Validate Nginx configuration with `sudo nginx -t` before an approved reload; do not alter other server blocks.
4. Live acceptance: `curl -i https://docs.wessaal.com/` must contain `Integrate with WESSAAL` in its initial HTML; `robots.txt` returns 200 text/plain; `sitemap.xml` returns 200 XML; a random nonexistent path must return a real 404.

These instructions do **not** represent a production deployment or a verified CI build.
