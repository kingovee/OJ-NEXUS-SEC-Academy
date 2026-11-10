/* OJ NEXUS SEC — evidence-led, self-paced blue-team investigation.
   All incidents, logs and systems are fictional. No network activity. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const find=id=>ATTACKS.find(a=>a.id===id);
let state=null;
const stages=[
 {name:'Triage',heading:'Understand the alert',prompt:'What should an analyst do before declaring this a confirmed incident?',options:[
  ['Correlate the alert with other evidence and establish normal activity',true,'Correct. One signal alone rarely proves malicious activity. Compare timing, identities, affected assets and expected behavior.'],
  ['Immediately shut down every system',false,'That could interrupt legitimate work and destroy context. Establish scope and confidence before choosing proportionate containment.'],
  ['Dismiss it because the service is still available',false,'A working service can still be compromised. Availability alone is not enough to dismiss an alert.']
 ]},
 {name:'Evidence',heading:'Investigate the synthetic telemetry',prompt:'Which interpretation is best supported by the evidence?',options:[
  ['The indicators justify further investigation, but attribution and impact remain unconfirmed',true,'Correct. Distinguish observations from hypotheses. The available telemetry suggests suspicious activity but does not prove identity or impact.'],
  ['The alert proves a named person is responsible',false,'Attribution requires independent corroboration. Logs alone can be misleading.'],
  ['The lack of a confirmed outage means there is no risk',false,'Many security incidents do not cause immediate outages. Investigate exposure and impact separately.']
 ]},
 {name:'Response',heading:'Choose a proportionate response',prompt:'How should the team respond to the suspected incident?',options:[
  ['Preserve evidence, validate affected assets and apply targeted containment when justified',true,'Correct. Evidence preservation and scoped containment reduce harm while keeping the investigation reliable.'],
  ['Delete the event history and restart everything',false,'Removing logs destroys important evidence and may not address the underlying risk.'],
  ['Announce complete compromise without verification',false,'Communicate uncertainty accurately. Unverified claims can cause unnecessary disruption.']
 ]},
 {name:'Recovery',heading:'Prevent recurrence and report',prompt:'What completes a defensible investigation?',options:[
  ['Document findings, apply appropriate controls and verify that monitoring detects recurrence',true,'Correct. Strong reports distinguish observed facts, impact, response, residual risk and recommended controls.'],
  ['Close the case without a record because the alert stopped',false,'An alert stopping does not establish remediation. Document what happened and verify controls.'],
  ['Disable alerting so the team receives fewer notifications',false,'Suppressing all monitoring removes visibility. Tune noisy detections rather than switching them off.']
 ]}
];
function timeline(a){return [
 ['08:41:12','MONITOR','Baseline established for mock-host-01 in training.example','baseline'],
 ['08:43:07','DETECTION','Anomaly flagged: '+a.signals,'alert'],
 ['08:43:15','ASSET','Fictional asset: mock-host-01 · business criticality: medium','context'],
 ['08:44:02','CORRELATION','A second synthetic observation suggests review is warranted; root cause unknown','context']
]}
function open(id){const a=find(id);if(!a)return;state={id,stage:0,score:0,answers:[],feedback:null,complete:false,hints:0,events:timeline(a)};let root=$('oj-live-sim');if(!root){root=document.createElement('section');root.id='oj-live-sim';document.getElementById('main').prepend(root)}render();root.scrollIntoView({block:'start'})}
function select(i){if(!state||state.complete||state.feedback)return;const option=stages[state.stage].options[i];if(!option)return;const correct=option[1];state.answers.push({stage:stages[state.stage].name,choice:option[0],correct});if(correct)state.score+=25;state.feedback={correct,message:option[2]};render()}
function next(){if(!state||!state.feedback)return;state.stage++;state.feedback=null;if(state.stage===stages.length){state.complete=true;if(state.score>=75){try{mark('live-'+state.id)}catch(e){}}}render()}
function hint(){if(!state||state.complete)return;state.hints++;const hints=['Look for context: baseline, asset, identity, timing and corroborating events.','Separate what the logs show from what you suspect.','Choose a response that preserves evidence and limits unnecessary disruption.','A strong report includes facts, uncertainty, containment and preventive controls.'];const el=$('oj-hint');if(el)el.textContent=hints[state.stage]}
function restart(){if(state)open(state.id)}
function close(){$('oj-live-sim')?.remove();state=null}
function reportText(){if(!state)return '';const a=find(state.id);return ['OJ // NEXUS SEC — BLUE TEAM CASE REPORT','Training mode: self-paced synthetic investigation','Scenario: '+a.name,'Fictional system: mock-host-01 / training.example','Status: '+(state.complete?'Completed':'In progress'),'Score: '+state.score+'/100','', 'Incident overview: '+a.overview,'Synthetic indicators: '+a.signals,'Suggested response: '+a.response,'Preventive controls: '+a.prevention,'','Student decisions:',...state.answers.map(x=>'- '+x.stage+': '+x.choice+' ['+(x.correct?'appropriate':'review needed')+']'),'','No real attacks, targets, or network operations were involved.'].join('\n')}
function report(){if(!state)return;const blob=new Blob([reportText()],{type:'text/plain'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='OJ-blue-team-'+state.id+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function render(){
 const root=$('oj-live-sim');if(!root||!state)return;const a=find(state.id),st=stages[state.stage];
 const events=state.events.map(e=>'<div class="oj-event '+(e[3]==='alert'?'high':'ok')+'"><small>'+esc(e[0])+' · '+esc(e[1])+'</small><p>'+esc(e[2])+'</p></div>').join('');
 const complete=state.complete;
 const choices=complete?'':st.options.map((o,i)=>'<button type="button" class="practice-choice" data-oj-choice="'+i+'" '+(state.feedback?'disabled':'')+'>'+esc(o[0])+'</button>').join('');
 const feedback=state.feedback?'<div class="practice-feedback"><strong>'+(state.feedback.correct?'Good investigation decision':'Review this decision')+'</strong><p>'+esc(state.feedback.message)+'</p><button type="button" class="b" id="oj-next">'+(state.stage===3?'Finish investigation':'Continue investigation')+'</button></div>':'';
 root.innerHTML='<div class="oj-live"><div class="oj-live-top"><div><div class="practice-eyebrow">OJ // NEXUS SEC · BLUE TEAM INVESTIGATION</div><h2>'+esc(a.name)+'</h2><p>Self-paced simulated SOC case · '+esc(a.category)+'</p></div><div class="oj-live-status">● TRAINING ENVIRONMENT</div></div><div class="oj-live-metrics"><div><small>INVESTIGATION STAGE</small><strong>'+(complete?'4 / 4':(state.stage+1)+' / 4')+'</strong></div><div><small>CASE SCORE</small><strong>'+state.score+'/100</strong></div><div><small>TIME PRESSURE</small><strong>NONE</strong></div></div><div class="oj-live-layout"><section class="oj-live-feed"><h3>Synthetic incident evidence <span>CASE FILE</span></h3><p class="mu">Read the observations and compare them with the threat description. The timestamps are fictional and do not count down.</p><div id="oj-events">'+events+'</div><div class="practice-telemetry"><b>Threat context:</b> '+esc(a.overview)+'<p><b>What the alert suggests:</b> '+esc(a.signals)+'</p></div></section><section class="oj-live-defend"><h3>'+(complete?'Investigation debrief':esc(st.heading))+'</h3>'+(complete?'<p>You completed all four stages. Score: <strong>'+state.score+'/100</strong>.</p><p>Recommended response: '+esc(a.response)+'</p><p>Preventive controls: '+esc(a.prevention)+'</p><p>Review any missed decisions, retry the case or export your findings.</p>':'<p>'+esc(st.prompt)+'</p><div class="practice-options">'+choices+'</div>'+feedback+'<p id="oj-hint" class="rt-note" aria-live="polite"></p>')+'<div class="oj-live-actions">'+(!complete?'<button type="button" class="o" id="oj-hint-btn">Explain what to look for</button>':'')+'<button type="button" class="o" id="oj-restart">Restart case</button><button type="button" class="o" id="oj-report">Export report</button><button type="button" class="o" id="oj-close">Close</button></div></section></div></div>';
 root.querySelectorAll('[data-oj-choice]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.ojChoice))));
 if($('oj-next'))$('oj-next').onclick=next;
 if($('oj-hint-btn'))$('oj-hint-btn').onclick=hint;
 $('oj-restart').onclick=restart;$('oj-report').onclick=report;$('oj-close').onclick=close;
}
window.OJLive={open,restart,close,report};
if(typeof V!=='undefined'&&typeof V.attacks==='function'){
 const previous=V.attacks;
 V.attacks=function(){const html=previous();if(typeof ATTACK_SELECTED!=='undefined'&&ATTACK_SELECTED){const a=find(ATTACK_SELECTED);return '<div class="practice-cta"><div><strong>Blue Team · Investigate a simulated incident</strong><p>Examine fictional logs, make four evidence-led decisions and receive explanations. No countdown.</p></div><button type="button" class="b" onclick="OJLive.open(\''+a.id+'\')">Open investigation lab</button></div>'+html}return '<div class="practice-intro"><strong>Self-paced Blue Team investigations for all 100 attacks</strong><span>Open any tutorial and select “Open investigation lab”. No speed-clicking required.</span></div>'+html};
}
})();
