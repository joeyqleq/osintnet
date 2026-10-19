# OSINTNET
Open-source, modular, evidence-first OSINT/MCP investigation workspace.

## Two products, one repository
1. **OSINTNET Platform:** portable tool registry, API/MCP adapters, provenance-aware ingestion, scheduling, audit/telemetry, authenticated visual control plane, and documented skills.
2. **Umma Foundation case:** isolated due-diligence case profile with hypotheses, reproducible evidence, charity/financial records, ads, geographic/entity matching and final public-interest findings.

The repository now contains an initial working Python platform: authenticated operations canvas, independently controlled GET adapters, a durable queue, replayable event stream, SHA-256 evidence ledger, full-text search and an official-SDK MCP endpoint. Investigative data stays private. Deferred integrations and unverified case claims are explicitly labeled.

See [run and deployment instructions](docs/OPERATIONS.md), [architecture decision](docs/ARCHITECTURE_DECISION.md), [capability decisions](docs/CAPABILITY_MATRIX.md) and [verification evidence](docs/VERIFICATION.md). The master prompt remains the broader delivery specification; this initial implementation does not imply every acceptance condition or the investigation is complete.

## Start
Read [MASTER_PROMPT.md](MASTER_PROMPT.md), then [AGENTS.md](AGENTS.md), [docs/SOURCE_CATALOG.md](docs/SOURCE_CATALOG.md), [cases/umma/CASE_BRIEF.md](cases/umma/CASE_BRIEF.md), and the relevant source documents. Paste the complete master prompt into ChatGPT Desktop while it has access to Loopback, GitHub, ROTOXY, and Mem0.

## New: ad intelligence research
- [Advertising intelligence sources and MCPs](docs/AD_INTELLIGENCE.md) including Google/YouTube creative retrieval, Meta's official Ad Library and limits of advertiser targeting data.
- [Ad transparency skill requirements](skills/ad-transparency/SKILL.md) (research scaffold; not installed).

## Verified context
- Local repo: `/home/jq/Desktop/osintnet`
- Remote: https://github.com/joeyqleq/osintnet.git
- Preferred initial compute: ORA6 (4 OCPU / 24 GB RAM, user-reported); optional ORA7; ORA3 already runs an existing Shodan MCP and should not be broken.
- Intended authenticated interface: `https://umma.ziopsyop.tech`
- No live case assessment is made by the presence of these docs.

## Publication and evidence rules
Assess organizational conduct, not religious identity. Suspicions are hypotheses, not conclusions. Preserve source links, access dates, underlying originals, uncertainty, and favorable or unfavorable evidence. Never put API keys or individual private data into the public repo.
