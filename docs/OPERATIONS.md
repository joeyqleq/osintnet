# Run OSINTNET

Use Python 3.11 or newer. Development and the pinned Docker image were checked with Python 3.14. From a clone:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.lock.txt
.venv/bin/python -m pytest -q
OSINTNET_WEB_HOSTS=example.org .venv/bin/uvicorn osintnet.app:app --host 127.0.0.1 --port 8780 --no-access-log
```

Open the local console, then enter the generated key from `private/runtime/operator.key` in its sign-in form. Keep the key out of chat, screenshots and logs. Its hash is stored in `auth.json`; analyst/operator/admin keys can be configured there by the local administrator. New adapters start disabled. Pending integrations cannot be enabled. Exact public web hosts are operator configuration, not a model-controlled arbitrary-URL permission.

The native MCP endpoint is `/mcp/`, using the official Python SDK and a Bearer key. `network_status`, `evidence_search`, `evidence_record` and operator-scoped `source_query` are exposed. Desktop-client enrollment/OAuth is a separate acceptance step; an SDK smoke test is not evidence that a particular desktop client was enrolled.

## Deployment and controls

`docker compose config --quiet` validates configuration. Docker itself validates mount semantics; the initial unquoted tmpfs list was corrected after a staging start rejected it. The gateway binds its published port to host loopback. It runs without root, has a read-only filesystem, a writable private data volume, bounded tmpfs, dropped capabilities and CPU/memory/PID limits. Secrets and case data are excluded from the build context.

For external access, set the exact public origin and Cloudflare Access issuer/audience in the protected `.env`. Create a narrow reusable Access policy and self-hosted app **before** the tunnel/DNS route. Origin JWT validation stays enabled. A remote token-based cloudflared connector should use a protected token file, not a token command argument or browser script. Use a separate service token restricted to this Access application for automated clients; its entitlement does not grant an OSINTNET role without an application key.

The console master control pauses new OSINTNET acquisition and lets in-flight GETs finish. It does not stop the console, evidence storage or unrelated host services. Individual sources can be disabled independently. A failed job does not automatically hammer a provider; use an explicit new query after examining the reason. Lease recovery only retries GET operations, at most three attempts after process failure. Ambiguous external writes are not implemented.

## Backup, restore and rollback

Pause acquisition and wait for active jobs to finish. Use `sqlite3.Connection.backup` to copy the database; copy the blobs directory and protected authentication files into a private backup. Keep a manifest of file hashes. Restore into a fresh isolated directory, run `PRAGMA integrity_check` and `Store.verify`, and compare capture counts and ledger tip before changing service volumes. Do not share or commit backups. Do not copy one instance's login credentials to another deployment implicitly.

Stage releases in separate directories and retain the previous image digest/config. Recreate only the `osintnet` Compose project. Roll back the application image/config and recheck health plus ledger verification. Avoid destructive schema migrations; current schema changes are additive. For an initial deployment failure, stop only the new gateway/tunnel containers and keep the data volume. Withdraw only the new hostname's tunnel/DNS resource if exposure has occurred; never reset host-wide Docker, Tailscale or Cloudflare state.

## Current limitations

GET source adapters share a process and a two-worker queue; independent toggles are logical isolation. Roles span the instance's cases. There is no per-source credential editor, process-level node restart, automatic model-budget enforcement, live credit-account reader or background LLM orchestration in the core. ROTOXY dispatch is an explicit operator script with durable receipts; provider-reported cost may arrive late. Cached blobs deduplicate content but there is no HTTP response cache. Paid integrations and broad OSINT bundles remain deferred. Consult `VERIFICATION.md` for tested layers and unresolved acceptance gates.
