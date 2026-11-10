import http from 'node:http';import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('dist');
const base=new URL(process.env.SITE_URL || 'https://niiokai32.github.io/Makers-Educational-Consult').pathname.replace(/\/$/,'');
http.createServer((req,res)=>{let p;try{p=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end('Invalid path')}
if(base&&(p===base||p.startsWith(base+'/')))p=p.slice(base.length)||'/';
let f=path.resolve(root,'.'+p);if(f!==root&&!f.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end('Page not found')}
res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.xml':'application/xml','.txt':'text/plain'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res)}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'+base+'/'));
