/* CTF learning checks: 10 contextual concept questions before the original flag task. */
(function(){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const families={
'SOC':['Correlate alerts with asset and identity context','Review the sequence of events before deciding','Preserve the relevant telemetry','Separate confirmed facts from hypotheses','Check whether the activity is expected','Prioritize by impact and confidence','Identify affected assets and accounts','Use targeted containment after validation','Document evidence and decisions','Tune detections and verify recovery'],
'Crypto':['Identify whether the data is encoded or encrypted','Determine the transformation from the evidence','Preserve the original input','Check output formatting carefully','Validate the result against context','Distinguish secrecy from representation','Avoid treating weak ciphers as secure','Use established cryptographic libraries','Protect keys and secrets separately','Document the decoding and its limitations'],
'Web':['Identify the untrusted input boundary','Understand how application logic handles input','Observe the fictional request and response','Distinguish validation from authorization','Avoid drawing conclusions from one response','Preserve request and audit evidence','Apply parameterized queries and safe APIs','Enforce access checks on the server','Use least-privilege service accounts','Retest the remediation in an authorized lab'],
'Windows':['Read the relevant event identifiers','Correlate account and host information','Review timestamps and event order','Distinguish login from account creation','Verify group membership changes','Preserve security event logs','Scope the affected identities','Apply least privilege and account controls','Investigate suspicious administrative activity','Document findings and improve alerting'],
'Linux':['Inspect ownership and permissions','Determine the security implication of the configuration','Review the relevant service or scheduled task','Correlate changes with system logs','Check which identity runs the process','Avoid modifying evidence during triage','Apply least privilege','Remove unnecessary write permissions','Verify configuration after remediation','Record the finding and corrective action'],
'Email':['Inspect From, Reply-To and Return-Path','Compare display names with actual domains','Review mail routing evidence','Look for urgency and unexpected requests','Check authentication results when available','Verify requests through trusted channels','Avoid interacting with suspicious links','Report and preserve the message safely','Strengthen mail authentication and filtering','Educate users about impersonation indicators'],
'Reporting':['Identify the incident scope','Write a concise factual summary','State severity and uncertainty','Construct a timestamped timeline','Reference the supporting evidence','Separate observation from assumption','Describe verified impact','Document containment and recovery','Recommend actionable controls','Make the report clear and reproducible'],
'Network':['Identify source and destination context','Compare activity with a baseline','Review protocols and ports in context','Correlate flows with host logs','Check timing and traffic volume','Avoid treating one unusual packet as proof','Scope affected hosts and services','Use segmentation and monitoring','Validate expected network behavior','Document evidence and next steps'],
'Cloud':['Identify the affected cloud resource','Review identity and access configuration','Compare settings with policy','Correlate audit events','Check exposure and resource sensitivity','Preserve cloud audit evidence','Apply least-privilege permissions','Disable unintended public access','Verify changes with a safe configuration audit','Document residual risk and monitoring'],
'Vuln Mgmt':['Confirm the asset and finding','Validate evidence and affected versions','Check exposure and business impact','Distinguish severity from exploitability','Avoid testing outside authorized scope','Prioritize remediation based on risk','Coordinate with asset owners','Apply vendor-supported mitigations','Retest after remediation','Track closure and exceptions'],
'Identity':['Identify the affected account','Review authentication events in sequence','Check device and location context','Correlate approvals and denials','Verify the user through a trusted channel','Revoke suspicious sessions when justified','Enforce MFA or passkeys','Apply conditional access controls','Monitor for recurrence','Document evidence and account recovery'],
'DFIR':['Preserve the original evidence','Identify the earliest reliable event','Build a consistent timeline','Correlate host and identity artifacts','Track evidence provenance','Distinguish observed facts from assumptions','Scope affected systems','Choose proportionate containment','Verify recovery and integrity','Write a reproducible forensic report']
};
const wrong=[
['Ignore the evidence because no outage occurred','Delete logs to simplify the investigation','Assume the first alert proves everything'],
['Guess without inspecting the supplied artifact','Modify the original evidence before reviewing it','Treat all unusual activity as confirmed compromise'],
['Make an unsupported attribution','Skip documenting the evidence','Disable monitoring to reduce alerts']
];
let session=null;
const oldRender=renderCtf;
function question(c,i){
 const topics=families[c.cat]||families.SOC,concept=topics[i];
 const prompt=[
 'Before solving "'+c.title+'", which is the most reliable first step?',
 'Which approach best helps you interpret the supplied evidence?',
 'What should you do to keep your investigation trustworthy?',
 'Which conclusion is justified by limited evidence?',
 'How do you decide whether the activity matters?',
 'How should you prioritize the finding?',
 'What helps determine the scope of the issue?',
 'Which response is most appropriate in an authorized environment?',
 'How should the team reduce the risk of recurrence?',
 'What demonstrates that you understand the concept?'
 ][i];
 const correct=concept;
 const pool=wrong[i%3].slice(0,3);
 const options=[correct,...pool];
 const shift=(Number(c.id.slice(1))+i)%4;
 return {prompt,correct,options:options.map((_,k)=>options[(k+shift)%4]),explanation:'For '+c.title+': '+concept+'. This helps you reason from evidence rather than guessing a flag.'};
}
function render(){
 if(!session)return;
 const c=CTF.find(x=>x.id===session.id),main=document.getElementById('main');
 if(session.index>=10){
  oldRender(c.id);
  const banner=document.createElement('div');banner.className='card';banner.innerHTML='<h2>Knowledge check complete</h2><p>You answered '+session.correct+' of 10 questions correctly. Review the original evidence below and capture the flag.</p><button type="button" class="o" id="ctf-review">Review the ten questions</button>';
  main.prepend(banner);document.getElementById('ctf-review').onclick=()=>{session.index=0;session.correct=0;session.answers=[];render()};
  return;
 }
 const q=question(c,session.index),selected=session.selected;
 main.innerHTML='<a href="ctf.html" style="color:var(--ac)">← All CTF challenges</a><div class="card" style="margin-top:18px"><span class="tag">'+esc(c.cat)+'</span><span class="tag">Question '+(session.index+1)+' of 10</span><h1>'+esc(c.title)+'</h1><p>Learn the concepts before capturing the final flag.</p><div class="bar"><i style="width:'+session.index*10+'%"></i></div><h2>'+esc(q.prompt)+'</h2><p class="mu">Scenario: '+esc(c.d)+'</p><div id="ctf-learning-options" style="display:grid;gap:10px;margin:18px 0">'+q.options.map((o,i)=>'<button type="button" class="o" data-answer="'+i+'" style="white-space:normal;text-align:left;padding:14px">'+esc(o)+'</button>').join('')+'</div><div id="ctf-learning-feedback" aria-live="polite"></div><button type="button" class="o" id="ctf-learning-hint">Show a hint</button><p id="ctf-learning-hint-text" class="mu"></p></div>';
 main.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>answer(Number(b.dataset.answer)));
 document.getElementById('ctf-learning-hint').onclick=()=>{document.getElementById('ctf-learning-hint-text').textContent='Look for the option that uses evidence, stays within scope, and avoids unsupported assumptions. Concept: '+(families[c.cat]||families.SOC)[session.index].toLowerCase()+'.'};
 scrollTo(0,0);
}
function answer(i){
 if(!session||session.selected!==null)return;
 const c=CTF.find(x=>x.id===session.id),q=question(c,session.index),choice=q.options[i],correct=choice===q.correct;
 session.selected=i;if(correct)session.correct++;
 session.answers.push({question:session.index+1,correct});
 document.querySelectorAll('[data-answer]').forEach(b=>{b.disabled=true;if(b.textContent===q.correct)b.style.borderColor='#55e9bd'});
 const f=document.getElementById('ctf-learning-feedback');
 f.innerHTML='<div class="box"><strong>'+(correct?'Correct!':'Not quite — here is why.')+'</strong><p>'+esc(q.explanation)+'</p><button class="b" id="ctf-learning-next">'+(session.index===9?'Continue to flag challenge':'Next question')+'</button></div>';
 document.getElementById('ctf-learning-next').onclick=()=>{session.index++;session.selected=null;render()};
}
window.renderCtf=function(id){const c=CTF.find(x=>x.id===id);if(!c){document.getElementById('main').textContent='Challenge not found';return}session={id,index:0,selected:null,correct:0,answers:[]};render()};
})();
