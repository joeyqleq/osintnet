# Ad transparency — candidate OSINTNET skill

**Status:** Research/specification only. No MCP installed or authorized live calls executed in this handoff.

## Objective
Research public advertising evidence for any named organization across Google/YouTube and selectively Meta/TikTok, particularly the Gaza fundraiser ad reported through a Jerusalem Tailscale exit-node session.

## Candidate tools
Primary: block-town/google-ads-transparency-mcp (unofficial Google Ads Transparency Center connector, no API key documented). Alternate: lionkiii/gads-transparency-mcp. Optional Meta official ad library API for eligible issue ads, with approval; paid third-party scrapers only after quotas and pricing review. Google official google-ads-mcp requires authorization to view the advertiser's own account and should not be treated as public competitor research.

## Inputs
Advertiser domain, advertiser name/verified aliases, platform, region filter (e.g. IL, US), time window, ad status and approved rate/cost budget.

## Outputs
Documented source, lookup time, advertiser name/ID, country filter, creative ID, type, copy, media link/hash if authorized, first/last shown if available, landing URL and verified disclosed payer if available, confidence, source gaps, nullable spend and impressions with precise restrictions. Never conflate observed ad country with selected targeting.

## Safety and accuracy
Only published/authorized transparency material. No bypass of access gates, CAPTCHA solving, credential use for other parties' accounts, use of private platform metrics, profiling of protected groups, or inflated claims about spend/targeting. Respect platform rate limits and asset use terms; preserve immutable permitted evidence with timestamps. No keys or private data in traces.

## Required tests before production
Confirm selected server's code/license, source validity, stable time/country parsing, advertiser disambiguation, rate limit behavior, tool health, resilient failures, schema/provenance, consent for paid providers, and end-to-end dashboard health events.

## Case lookup scope
Start with `ummafoundation.org`, `Umma Foundation`, `Our Umma`, `Our Ummah`, matching advertiser IDs if found. Compare worldwide and Israel-visible indexed creatives, with independent verification of the original YouTube impression where possible.