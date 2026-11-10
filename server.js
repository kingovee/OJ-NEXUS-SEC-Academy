'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'public');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
const server = http.createServer((req,res)=>{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
  let parts;
  try{
    const raw=new URL(req.url,'http://localhost').pathname;
    if(/%2f|%5c/i.test(raw))throw Error('encoded separator');
    const decoded=decodeURIComponent(raw);
    parts=decoded.split('/');
    if(parts.some(p=>p==='..'||p==='.'||p.startsWith('.')||p.includes('\\')||p.includes('\0')))throw Error('invalid path');
  }catch{res.writeHead(400);return res.end('Bad request');}
  const file=path.join(root,...parts.filter(Boolean).length?parts.filter(Boolean):['index.html']);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden');}
  if(!Object.hasOwn(mime,path.extname(file).toLowerCase())){res.writeHead(404);return res.end('Not found');}
  fs.realpath(file,(err,real)=>{
    if(err||!real.startsWith(root+path.sep)){res.writeHead(404);return res.end('Not found');}
    fs.lstat(file,(e,st)=>{
      if(e||!st.isFile()||st.isSymbolicLink()){res.writeHead(404);return res.end('Not found');}
      res.writeHead(200,{'Content-Type':mime[path.extname(file).toLowerCase()],
        'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',
        'X-Frame-Options':'DENY','Cache-Control':'no-cache'});
      if(req.method==='HEAD')return res.end();
      fs.createReadStream(file).pipe(res);
    });
  });
});
if(require.main===module){
  const port=Number(process.env.PORT||4173);
  server.listen(port,'127.0.0.1',()=>console.log(`NEXUS//SEC Academy: http://127.0.0.1:${port}`));
}
module.exports=server;
