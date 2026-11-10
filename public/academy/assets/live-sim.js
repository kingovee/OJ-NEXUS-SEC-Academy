/* OJ Live Simulation — fictional event stream and defensive controls only. */
(function(){
'use strict';
let timer=null,state=null;
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const attacks=()=>typeof ATTACKS!=='undefined'?ATTACKS:[];
function stop(){if(timer){clearInterval(timer);timer=null}}
function choose(id){const a=attacks().find(x=>x.id===id);return a||attacks()[0]}
function open(id){
 stop();const a=choose(id);if(!a)return;
 state={id:a.id,tick:0,score:0,integrity:100,contained:false,investigated:false,protected:false,paused:false,events:[],actions:[],complete:false};
 let host=$('oj-live-sim');
 if(!host){host=document.createElement('section');host.id='oj-live-sim';host.setAttribute('aria-label','Live attack and defence simulation');const main=$('main');main.prepend(host)}
 draw();event('SIMULATION STARTED','A fictional threat scenario has been generated for '+a.name,'info');
 timer=setInterval(advance,1600);
 host.scrollIntoView({block:'start'});
}
function event(label,detail,kind='warn'){if(!state)return;state.events.unshift({time:'T+'+String(state.tick*2).padStart(2,'0')+'s',label,detail,kind});state.events=state.events.slice(0,18);render()}
function advance(){
 if(!state||state.paused||state.complete)return;
 state.tick++;
 const a=choose(state.id);
 if(state.contained){finish(true);return}
 const steps=[
 ['RECON SIGNAL','Synthetic monitoring flags a pattern relevant to '+a.category+'.'],
 ['SUSPICIOUS ACTIVITY','Telemetry matches: '+a.signals],
 ['ALERT ESCALATION','Analyst review requested. Confirm evidence before deciding.'],
 ['IMPACT RISK','Uncontained activity could affect a fictional training asset.'],
 ['REPEATED INDICATOR','A second synthetic alert matches the same investigation.'],
 ['HIGH PRIORITY','Escalation threshold reached in the simulation.']
 ];
 const e=steps[Math.min(state.tick-1,steps.length-1)];
 state.integrity=Math.max(0,state.integrity-(state.protected?5:13));
 event(e[0],e[1],state.tick>3?'high':'warn');
 if(state.tick>=6||state.integrity<=0)finish(false);
}
function action(type){
 if(!state||state.complete)return;
 const a=choose(state.id);
 if(type==='investigate'){
  if(state.investigated)return;
  state.investigated=true;state.score+=25;state.actions.push('Reviewed synthetic telemetry and correlated indicators');
  event('INVESTIGATION COMPLETE','Evidence reviewed: '+a.signals,'ok');
 }else if(type==='protect'){
  if(state.protected)return;
  state.protected=true;state.score+=25;state.actions.push('Applied preventive controls in the simulation');
  event('PROTECTIVE CONTROL','Defensive safeguard simulated: '+a.prevention,'ok');
 }else if(type==='contain'){
  if(!state.investigated){event('ACTION NEEDS EVIDENCE','Investigate the telemetry before applying containment.','warn');return}
  state.contained=true;state.score+=35;state.actions.push('Contained fictional incident using approved response');
  event('CONTAINMENT APPLIED','Simulated response: '+a.response,'ok');
  finish(true);return;
 }else if(type==='document'){
  if(!state.investigated){event('DOCUMENTATION NEEDS EVIDENCE','Review the incident before writing the case report.','warn');return}
  if(state.actions.some(x=>x.startsWith('Documented')))return;
  state.score+=15;state.actions.push('Documented findings and response decisions');
  event('CASE NOTE SAVED','Investigation notes added to the synthetic case file.','ok');
 }
 render();
}
function finish(success){
 stop();if(!state||state.complete)return;state.complete=true;state.paused=true;
 state.score=Math.min(100,state.score);
 state.outcome=success?'Incident contained':'Simulation ended before containment';
 state.actions.push(state.outcome);
 if(success){try{mark('live-'+state.id)}catch(e){}}
 render();
}
function pause(){if(!state||state.complete)return;state.paused=!state.paused;render()}
function report(){
 if(!state)return;
 const a=choose(state.id);
 const lines=['OJ // NEXUS SEC — SYNTHETIC INCIDENT REPORT','Scenario: '+a.name,'Category: '+a.category,'Result: '+(state.outcome||'In progress'),'Score: '+state.score+'/100','Timeline events: '+state.events.length,'','Analyst actions:',...state.actions.map(x=>'- '+x),'','Training disclaimer: Fictional event stream; no external targets or real attack activity.'];
 const blob=new Blob([lines.join('\n')],{type:'text/plain'});
 const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='OJ-live-simulation-'+state.id+'.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function draw(){
 const host=$('oj-live-sim');if(!host||!state)return;
 const a=choose(state.id);
 host.innerHTML='<div class="oj-live"><div class="oj-live-top"><div><div class="practice-eyebrow">OJ // NEXUS SEC · LIVE TRAINING MODE</div><h2>Attack & Defence Simulation</h2><p>Scenario: <strong>'+esc(a.name)+'</strong> · '+esc(a.category)+'</p></div><div class="oj-live-status">● SYNTHETIC INCIDENT</div></div><div class="oj-live-metrics"><div><small>ASSET INTEGRITY</small><strong id="oj-integrity"></strong></div><div><small>TIME</small><strong id="oj-time"></strong></div><div><small>DEFENDER SCORE</small><strong id="oj-score"></strong></div></div><div class="oj-live-layout"><div class="oj-live-feed"><h3>Attacker activity feed <span>SIMULATED</span></h3><p class="mu">Narrated adversary events only. No actual attack instructions or network requests.</p><div id="oj-events" role="log" aria-live="off"></div></div><div class="oj-live-defend"><h3>Defender controls</h3><p>Investigate the alerts, apply safeguards and contain the fictional incident.</p><div class="oj-live-actions"><button type="button" class="b" onclick="OJLive.action(\'investigate\')">Investigate evidence</button><button type="button" class="o" onclick="OJLive.action(\'protect\')">Apply protections</button><button type="button" class="o" onclick="OJLive.action(\'contain\')">Contain incident</button><button type="button" class="o" onclick="OJLive.action(\'document\')">Document findings</button></div><div id="oj-outcome" aria-live="polite"></div><div class="oj-live-actions"><button type="button" class="o" onclick="OJLive.pause()" id="oj-pause">Pause</button><button type="button" class="o" onclick="OJLive.open(\''+a.id+'\')">Restart</button><button type="button" class="o" onclick="OJLive.report()">Export report</button><button type="button" class="o" onclick="OJLive.close()">Close</button></div></div></div></div>';
 render();
}
function render(){
 if(!state||!$('oj-events'))return;
 $('oj-integrity').textContent=state.integrity+'%';
 $('oj-time').textContent='T+'+String(state.tick*2).padStart(2,'0')+'s';
 $('oj-score').textContent=state.score+'/100';
 $('oj-events').innerHTML=state.events.map(e=>'<div class="oj-event '+e.kind+'"><small>'+esc(e.time)+' · '+esc(e.label)+'</small><p>'+esc(e.detail)+'</p></div>').join('');
 $('oj-outcome').textContent=state.complete?state.outcome+' · Final score '+state.score+'/100':state.paused?'Simulation paused':'Investigation active';
 $('oj-pause').textContent=state.paused?'Resume':'Pause';
 $('oj-pause').disabled=state.complete;
 document.querySelectorAll('#oj-live-sim .oj-live-actions button').forEach(b=>{if(state.complete&&/Investigate|Apply protections|Contain|Document/.test(b.textContent))b.disabled=true});
}
function close(){stop();state=null;$('oj-live-sim')?.remove()}
window.OJLive={open,action,pause,report,close};
if(typeof V!=='undefined'&&typeof V.attacks==='function'){
 const previous=V.attacks;
 V.attacks=function(){
  const html=previous();
  if(typeof ATTACK_SELECTED!=='undefined'&&ATTACK_SELECTED){
   const a=choose(ATTACK_SELECTED);
   return '<div class="practice-cta"><div><strong>Live attack & defence simulation</strong><p>Watch synthetic threat events arrive and respond using defender controls.</p></div><button class="b" type="button" onclick="OJLive.open(\''+a.id+'\')">Launch live simulation</button></div>'+html;
  }
  return '<div class="practice-intro"><strong>Live simulation available for all 100 attacks</strong><span>Open an attack tutorial and choose “Launch live simulation”.</span></div>'+html;
 };
}
})();
