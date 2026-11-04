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
