#!/usr/bin/env node
// Local operator bridge. Credentials stay inside ROTOXY's encrypted store.
import {readFile, mkdir, writeFile, appendFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {homedir} from 'node:os';
const runtime=process.env.ROTOXY_RUNTIME || resolve(homedir(),'.local/share/rotoxy');
const {StateStore}=await import(pathToFileURL(resolve(runtime,'dist/store.js')));
const {createLightSprintMcpClient}=await import(pathToFileURL(resolve(runtime,'dist/providers/lightsprint-jobs.js')));
const dir=resolve('private/discovery'); await mkdir(dir,{recursive:true,mode:0o700});
const store=new StateStore(), state=await store.load();
const cfg=JSON.parse(await readFile(resolve(store.dir,'supervisor.json'),'utf8'));
const sessions=cfg.projects.flatMap(p=>p.registeredSessions).filter((x,i,a)=>a.findIndex(y=>y.accountId===x.accountId)===i).slice(0,4);
const parse=r=>r.structuredContent || JSON.parse(r.content.find(x=>x.type==='text').text);
async function api(s,method,path,body){
 const a=state.accounts.find(a=>a.id===s.accountId && a.enabled); if(!a)throw Error('account_disabled');
 const c=createLightSprintMcpClient({endpoint:new URL(state.config.upstreamUrl),token:await store.revealToken(a),fetch,timeoutMs:25000});
 try{const r=await c.request('tools/call',{name:'lightsprint_api',arguments:{method,path:`/api/workspaces/${s.workspaceId}${path}`,...(body?{body}:{})}}); if(r.isError)throw Error('provider_rejected');return parse(r);}finally{c.close();}
}
const briefs=[
 ['filings','Evaluate official IRS TEOS/bulk XML/determination letters, ProPublica API v2, NY AG charity registry and NY DOS corporate inquiry. Identify concrete original returns for EIN 863883211 (2021 onward), schedules, aliases, gaps and corroborating/falsifying evidence. Do not crawl the charity website; another lane owns that.'],
 ['source-audit','Audit these candidates ONLY: CourtListener official MCP, Vaquill fork, NYC Databook, OpenCorporates, SEC EDGAR, USAspending, SAM.gov, Arctic Shift REST, Shodan passive existing integration, ZoomEye, awesome-osint, frishtik/osint-tools-mcp-server, SOsintOps/claudii-exploratores, archived companyscope-mcp and LangSmith MCP/API. Group overlap; check primary docs/repo metadata, maintenance/license/auth/cost/ARM64. No installation or inference purchases.'],
 ['web-geo-ads','Evaluate OSM/Overpass/Nominatim vs Google Places/HasData for provider-attributed one-mile business directory, Wayback/CommonCrawl/RDAP/CT and CrawlGraph, Google/YouTube public ad collectors block-town and lionkiii, Meta official public Ad Library. Recommend bounded lawful collection, licenses/retention/rate costs and gaps. No personal profiling or religion inference. Do NOT crawl target site; lead owns acquisition.'],
 ['architecture','Independently propose portable case-neutral OSINT platform for ARM64 ORA6 (4CPU,24GB RAM,22GB available,76GB disk) with immutable evidence/raw artifact store, structured provenance and hypotheses, FTS and typed graph, durable task leases/idempotency/budgets, independently toggleable API adapters and authenticated MCP, live n8n-like canvas/SSE telemetry with real pulses. Compare Python SQLite first vs PostgreSQL/Redis/distributed. Describe security/SSRF/auth/RBAC/redaction, Access/tunnel deployment/rollback and meaningful acceptance tests. Research primary docs for key decisions. No case investigation or code edits.']
];
const mode=process.argv[2] || 'status';
if(mode==='dispatch'){
 for(let i=0;i<briefs.length;i++){
  const [lane,brief]=briefs[i],s=sessions[i],file=resolve(dir,`${lane}.json`);
  try{await readFile(file);console.log(JSON.stringify({lane,skipped:'durable_receipt_exists'}));continue;}catch(e){if(e.code!=='ENOENT')throw e;}
  const before=await api(s,'GET',`/agent-sessions/${s.sessionId}/status`);
  if(before.status?.sessionStatus!=='idle'||before.status?.canSendMessage!==true){console.log(JSON.stringify({lane,skipped:'session_not_idle'}));continue;}
  const marker=`OSINTNET_DISCOVERY_${lane.toUpperCase().replaceAll('-','_')}_DONE`;
  const instructions=`New isolated OSINTNET research assignment, 2026-10-19. Supersedes no unfinished repository work: perform TEXT-ONLY research, do not edit any repo, push, create PR, contact anyone, install software, access private records, purchase or change billing. User authorizes economical bounded research. Scope: ${brief}\nBudget: one response, at most 8 web/tool calls, <=6 minutes, <=0.50 USD existing prepaid LightSprint credits; stop early if budget unavailable. No native Codex/Claude subscription calls. Output <=7500 characters: JSON object {lane,observed_at,sources:[{url,issuer,observed_fact,limitation}],recommendations,alternatives,rejected,unknowns,tests}. Distinguish verified facts from proposals. Primary sources only; no invented results. Completion marker on its own line: ${marker}`;
  const receipt={lane,session:s,marker,instructions,started_at:new Date().toISOString(),lease_seconds:600,budget_usd:0.5,cost_before:before.status?.aiGatewaySessionCostUsd,status:'dispatching'};
  await writeFile(file,JSON.stringify(receipt,null,2),{mode:0o600,flag:'wx'});
  try{receipt.dispatch=await api(s,'POST',`/agent-sessions/${s.sessionId}/chat`,{message:instructions,clientMessageId:`osintnet-discovery-20261019-${lane}`});receipt.status='accepted';}catch(e){receipt.status='ambiguous';receipt.error=e.name;}
  await writeFile(file,JSON.stringify(receipt,null,2),{mode:0o600});
  await appendFile(resolve(dir,'events.jsonl'),JSON.stringify({at:new Date().toISOString(),lane,status:receipt.status})+'\n',{mode:0o600});
  console.log(JSON.stringify({lane,status:receipt.status}));
 }
}else{
 for(const [lane]of briefs){
  let r;try{r=JSON.parse(await readFile(resolve(dir,`${lane}.json`),'utf8'));}catch{continue;}
  const status=await api(r.session,'GET',`/agent-sessions/${r.session.sessionId}/status`),st=status.status;
  const delta=st?.aiGatewaySessionCostUsd-r.cost_before;
  const transcript=await api(r.session,'GET',`/agent-sessions/${r.session.sessionId}/transcript?limit=100&include=text&maxBytes=131072`);
  await writeFile(resolve(dir,`${lane}-observation.json`),JSON.stringify({observed_at:new Date().toISOString(),status,transcript},null,2),{mode:0o600});
  const items=transcript.items || transcript.messages || [], completed=items.some(x=>x.type==='assistant_snapshot'&&JSON.stringify(x.payload).includes(r.marker));
  if(!completed&&st?.canCancelPrompt&&(delta>=r.budget_usd||Date.now()-Date.parse(r.started_at)>r.lease_seconds*1000)){await api(r.session,'POST',`/agent-sessions/${r.session.sessionId}/cancel`,{});console.log(JSON.stringify({lane,state:'cancel_requested',cost_delta:delta}));}
  else console.log(JSON.stringify({lane,state:st?.sessionStatus,model:st?.model,cost_delta:delta,completed}));
 }
}
