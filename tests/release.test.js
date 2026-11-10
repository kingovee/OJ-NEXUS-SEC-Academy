'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'public');
test('public tree excludes internal project files',()=>{
  assert.ok(fs.existsSync(path.join(pub,'academy/assets/app.js')));
  for(const file of ['server.js','package.json','README.md','.github/workflows/deploy-pages.yml'])assert.ok(!fs.existsSync(path.join(pub,file)));
});
test('legacy authentication and admin database removed',()=>{
  const js=fs.readFileSync(path.join(pub,'academy/assets/app.js'),'utf8');
  assert.ok(!js.includes('claude.use('));
  assert.ok(!js.includes("DB.doc("));
  assert.ok(!js.includes('function gate()'));
  assert.ok(js.includes('resetLocalProgress'));
});
test('content and privacy labels are correct',()=>{
  const app=fs.readFileSync(path.join(pub,'academy/assets/app.js'),'utf8');
  const exp=fs.readFileSync(path.join(pub,'academy/assets/expansion.js'),'utf8');
  assert.ok(!app.includes('12 simulated challenges'));
  assert.match(exp,/Guest mode & privacy/);
});
test('server denies private paths and supports public pages',async()=>{
  const server=require('../server.js');
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port=server.address().port;
  async function req(url,method='GET'){return new Promise((resolve,reject)=>{
    const q=http.request({hostname:'127.0.0.1',port,path:url,method},r=>{let body='';r.on('data',x=>body+=x);r.on('end',()=>resolve({status:r.statusCode,body,headers:r.headers}));});q.on('error',reject);q.end();
  });}
  try{
    assert.equal((await req('/')).status,200);
    assert.equal((await req('/academy/range.html')).status,200);
    assert.equal((await req('/server.js')).status,404);
    assert.equal((await req('/.github/workflows/deploy-pages.yml')).status,400);
    assert.equal((await req('/%2e%2e/server.js')).status,404);
    assert.equal((await req('/','POST')).status,405);
    assert.equal((await req('/')).headers['x-content-type-options'],'nosniff');
  }finally{await new Promise(resolve=>server.close(resolve));}
});
