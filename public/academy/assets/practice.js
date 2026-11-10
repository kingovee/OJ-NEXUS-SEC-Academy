/* OJ Academy: 100 synthetic incident-response practice labs.
   All adversary events are narrated; no real attack execution or external requests. */
(function(){
'use strict';
let active=null,step=0,points=0,history=[];
const stages=['DETECT','DEFEND','HARDEN'];
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const find=id=>ATTACKS.find(a=>a.id===id);
const choices=[
  a=>[
    {text:'Investigate: '+a.signals,correct:true,why:'Good. These indicators are relevant to this incident, but you should correlate them with context before concluding.'},
    {text:'Assume every alert is malicious and disable the entire network',correct:false,why:'Overreaction can disrupt legitimate activity. Validate evidence and scope the incident first.'},
    {text:'Ignore the telemetry because the system is still online',correct:false,why:'A running service does not rule out a security incident. Investigate the signals.'}
  ],
  a=>[
    {text:'Investigate, document, and respond: '+a.response,correct:true,why:'Good. A measured response includes verification, evidence preservation and proportionate containment.'},
    {text:'Delete the logs so the alert disappears',correct:false,why:'Deleting evidence undermines investigation and makes recurrence harder to detect.'},
    {text:'Publish the suspected user’s identity before verifying',correct:false,why:'Avoid premature attribution or exposing private information. Follow an approved incident process.'}
  ],
  a=>[
    {text:'Apply protective controls: '+a.prevention,correct:true,why:'Correct. Long-term prevention reduces recurrence and should be followed by validation.'},
    {text:'Turn off security monitoring to reduce alert volume',correct:false,why:'Disabling monitoring removes visibility. Tune detections rather than abandoning them.'},
    {text:'Assume the incident cannot happen again',correct:false,why:'A completed response still needs lessons learned and preventive improvements.'}
  ]
];
function ordered(a,idx){
 const arr=choices[idx](a);
 const shift=(Number(a.id.slice(1))+idx)%3;
 return arr.map((_,i)=>arr[(i+shift)%3]);
}
function draw(){
 const a=find(active),root=document.getElementById('oj-practice');
 if(!a||!root)return;
 if(step>=3){
  const success=points===3;
  root.innerHTML='<div class="practice-panel"><div class="practice-eyebrow">MISSION COMPLETE · '+escapeHTML(a.id.toUpperCase())+'</div><h2>Incident response debrief</h2><p>You scored <strong>'+points+'/3</strong> across detection, response and prevention.</p><p>'+ (success?'Excellent: all three defensive decisions were correct.':'Review the defender field guide and try the mission again.') +'</p><p class="mu">All events and evidence were simulated. No real attack was performed.</p><button class="b" type="button" onclick="OJPractice.restart()">Retry mission</button> <button class="o" type="button" onclick="OJPractice.close()">Return to tutorial</button></div>';
  if(success){try{mark('practice-'+a.id)}catch(e){}}
  return;
 }
 const idx=step,opts=ordered(a,idx);
 const title=['Identify the suspicious activity','Choose a safe response','Strengthen the defences'][idx];
 const prompt=['An adversary simulation has generated suspicious activity matching <strong>'+escapeHTML(a.name)+'</strong>. Which evidence should the analyst prioritize?','The team has confirmed a potential incident. What should the defender do next?','The immediate incident is contained. Which control best reduces recurrence?'][idx];
 root.innerHTML='<div class="practice-panel"><div class="practice-eyebrow">OJ TRAINING RANGE / '+escapeHTML(a.id.toUpperCase())+' · '+stages[idx]+' · '+(idx+1)+'/3</div><h2>'+title+'</h2><p>'+prompt+'</p><div class="practice-telemetry"><div><span>SIMULATED ACTIVITY</span><span>TRAINING ONLY</span></div><p><b>Threat scenario:</b> '+escapeHTML(a.overview)+'</p><p><b>Evidence available:</b> '+escapeHTML(a.signals)+'</p><p><b>Analyst objective:</b> Select the safest, evidence-led decision.</p></div><div class="practice-options">'+opts.map((o,i)=>'<button type="button" class="practice-choice" data-choice="'+i+'">'+escapeHTML(o.text)+'</button>').join('')+'</div><div id="practice-feedback" aria-live="polite"></div><p class="mu">No live systems are contacted. This is a decision-based exercise, not an attack launcher.</p><button type="button" class="o" onclick="OJPractice.close()">Close practice</button></div>';
 root.querySelectorAll('[data-choice]').forEach(btn=>btn.addEventListener('click',()=>answer(Number(btn.dataset.choice))));
}
function answer(i){
 const a=find(active),opt=ordered(a,step)[i],root=document.getElementById('oj-practice');
 if(!opt||root.querySelector('[data-next]'))return;
 if(opt.correct)points++;
 history.push(opt.correct);
 root.querySelectorAll('[data-choice]').forEach(btn=>{btn.disabled=true;btn.classList.toggle('practice-correct',ordered(a,step)[Number(btn.dataset.choice)].correct)});
 const feedback=root.querySelector('#practice-feedback');
 feedback.innerHTML='<div class="practice-feedback"><strong>'+(opt.correct?'Correct decision':'Review this decision')+'</strong><p>'+escapeHTML(opt.why)+'</p><button class="b" type="button" data-next>'+(step===2?'View debrief':'Next stage')+'</button></div>';
 feedback.querySelector('[data-next]').addEventListener('click',()=>{step++;draw()});
}
function start(id){
 if(!find(id))return;
 active=id;step=0;points=0;history=[];
 let root=document.getElementById('oj-practice');
 if(!root){root=document.createElement('section');root.id='oj-practice';root.setAttribute('aria-label','Attack practice simulation');const main=document.getElementById('main');main.prepend(root)}
 draw();root.scrollIntoView({behavior:'auto',block:'start'});
}
function close(){document.getElementById('oj-practice')?.remove();active=null}
function restart(){if(active)start(active)}
window.OJPractice={start,close,restart};
const original=V.attacks;
V.attacks=function(){
 const html=original();
 if(ATTACK_SELECTED){
  const a=find(ATTACK_SELECTED);
  if(!a)return html;
  return '<div class="practice-cta"><div><strong>OJ Practice Lab · '+escapeHTML(a.name)+'</strong><p>Three interactive defensive decisions: detect, respond and prevent. Synthetic incident only.</p></div><button type="button" class="b" onclick="OJPractice.start(\''+a.id+'\')">Start practice mission</button></div>'+html;
 }
 return '<div class="practice-intro"><strong>100 attack practice labs</strong><span>Open any attack card and select “Start practice mission” to investigate a fictional incident and practise defence.</span></div>'+html;
};
})();
