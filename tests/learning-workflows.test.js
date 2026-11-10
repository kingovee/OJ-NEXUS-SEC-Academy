'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../public/academy/assets');
function context(){
 const elements=new Map();
 const document={documentElement:{dataset:{}},querySelector(sel){if(!elements.has(sel))elements.set(sel,{textContent:'',innerHTML:'',value:'',scrollTop:0,scrollHeight:0,style:{},dataset:{},setAttribute(){},focus(){}});return elements.get(sel)},getElementById(id){return this.querySelector('#'+id)}};
 const local=new Map();
 const ctx={document,location:{search:'',href:'',reload(){}},localStorage:{getItem(k){return local.get(k)||null},setItem(k,v){local.set(k,v)},removeItem(k){local.delete(k)}},scrollTo(){},confirm(){return true},setInterval(){return 1},clearInterval(){},window:{scrollTo(){}},console,Date,URLSearchParams,URL,Blob,btoa:(v)=>Buffer.from(v).toString("base64"),atob:(v)=>Buffer.from(v,"base64").toString()};
 vm.createContext(ctx);
 for(const file of ['app.js','expansion.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
 return {ctx,elements,run(code){return vm.runInContext(code,ctx)}};
}
test('SSH training shell handles quoted grep, counts and permission changes',()=>{
 const c=context();
 const output=c.run('termExec(\'grep "Failed" auth.log\',null)');
 assert.match(output,/203\.0\.113\.45/);
 assert.ok(output.split('\n').filter(line=>line.includes('203.0.113.45')).length>=4);
 const count=c.run(`termExec('uniq -c',termExec('sort',termExec('awk from',termExec('grep Failed auth.log',null))))`);
 assert.match(count,/203\.0\.113\.45/);
 assert.match(c.run("termExec('chmod 750 backup.sh',null)"),/750/);
 assert.match(c.run("termExec('stat backup.sh',null)"),/rwxr-x---/);
});
test('academy renders dashboard, progress and all role/CTF pages',()=>{
 const c=context();
 for(const page of ['dash','prog','ctf','range','attacks','path']){
   const html=c.run(`V.${page}()`);
   assert.ok(html.length>200,page);
 }
 assert.equal(c.run('ATTACKS.length'),100);
 assert.equal(c.run('CTF.length'),32);
 assert.equal(c.run('RANGE_ROLES.length'),9);
});
test('progress reset removes locally stored data',()=>{
 const c=context();
 c.run("mark('t-net')");
 assert.ok(c.run("S.done['t-net']"));
 c.run('resetLocalProgress()');
 assert.equal(c.ctx.localStorage.getItem('cyac'),null);
});
test('SOC simulation streams synthetic evidence, records decisions and accepts a report',()=>{
 const c=context();
 c.run("rangeStart('soc')");
 c.run('for(let i=0;i<10;i++)rangeTick()');
 assert.equal(c.run('RANGE_STATE.events.length'),7);
 c.run('RANGE_ROLES[0].stages.forEach((stage,i)=>rangeChoose(i,stage.correct))');
 assert.equal(c.run('RANGE_STATE.stageDone.filter(Boolean).length'),4);
 for(const id of ['rr-summary','rr-evidence','rr-impact','rr-actions'])c.ctx.document.getElementById(id).value='Documented fictional evidence and defensive response with enough detail for review.';
 c.run('rangeSubmitReport()');
 assert.equal(c.run('RANGE_STATE.complete'),true);
 assert.equal(c.run("Boolean(S.done['range-soc'])"),true);
});
