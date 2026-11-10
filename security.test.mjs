import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import path from 'node:path';
function pages(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?pages(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]); }
test('Every page blocks native submission and unwanted resource loading',()=>{
 for(const file of pages('dist')) {
  const html=fs.readFileSync(file,'utf8');
  const policy=html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
  assert.ok(policy,file);
  for(const d of ["default-src 'none'","connect-src 'none'","form-action 'none'","object-src 'none'","base-uri 'none'"])assert.ok(policy.includes(d),file+': '+d);
  assert.ok(!policy.includes('unsafe-inline')&&!policy.includes('unsafe-eval'));
  assert.ok(html.indexOf('Content-Security-Policy')<html.indexOf('<script'));
  assert.ok(html.includes('<meta name="referrer" content="no-referrer">'));
  assert.match(html, /app\.js\?v=[a-f0-9]{16}/);
  assert.match(html, /style\.css\?v=[a-f0-9]{16}/);
  assert.ok(!/(?:src|href)="https?:\/\/(?:fonts\.|images\.unsplash)/.test(html));
  assert.ok(!/href="https:\/\/wa\.me\/[^" ]*\?/.test(html));
  assert.ok(!/\son\w+=/.test(html));
  const json=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1];
  assert.ok(policy.includes('sha256-'+createHash('sha256').update(json).digest('base64')));
  for(const link of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))assert.ok(link[0].includes('noopener noreferrer'));
 }
 const css=fs.readFileSync('dist/style.css','utf8');
 assert.ok(!/@import|url\(\s*["']?https?:/i.test(css));
 for(const m of css.matchAll(/url\(['"]?\.\/([^)'"\s]+)/g))assert.ok(fs.existsSync('dist/'+m[1]),m[1]);
});
test('No-JavaScript enquiry cannot submit personal data',()=>{
 const html=fs.readFileSync('dist/contact/index.html','utf8');
 assert.ok(html.includes('<fieldset id="enquiry-fields" disabled>'));
 assert.ok(html.includes('<form id="enquiry-form" method="post">'));
 assert.ok(!/<(?:input|select|textarea)\b[^>]*\bname=/.test(html));
 assert.ok(html.includes('<noscript>')&&html.includes('054 139 6869'));
});
function harness({clipboardFails=false,framed=false}={}){
 const nodes=new Map();let replaced=false;let copied=null;
 function node(){return {value:'',hidden:true,disabled:true,textContent:'',events:{},options:[],selectedOptions:[{textContent:'Academic support'}],addEventListener(t,fn){this.events[t]=fn},focus(){},select(){this.selected=true},reportValidity(){return true},append(){},setAttribute(){},getAttribute(){return 'false'},classList:{remove(){},toggle(){}}};}
 for(const id of ['#enquiry-form','#enquiry-fields','#enquiry-preview','#prepared-message','#copy-enquiry','#form-status','#name','#service','#message'])nodes.set(id,node());
 nodes.get('#name').value='Test Visitor';nodes.get('#message').value='<img src=x onerror=alert(1)> & private text';nodes.get('#service').options=[{value:'academic-support'}];
 const self={};
 vm.runInNewContext(fs.readFileSync('app.js','utf8'),{document:{querySelector:s=>nodes.get(s)||null,querySelectorAll:()=>[],addEventListener(){},createElement:node,currentScript:{src:'https://example.com/Makers/app.js'},body:{replaceChildren(){replaced=true}}},window:{self,top:framed?{}:self},location:{search:'?service=academic-support'},navigator:{clipboard:{async writeText(text){if(clipboardFails)throw Error('Denied');copied=text}}},URL,URLSearchParams});
 return {nodes,get replaced(){return replaced},get copied(){return copied}};
}
test('Enquiry stays plain text and is copied only on request',async()=>{
 const h=harness();let prevented=false;
 assert.equal(h.nodes.get('#enquiry-fields').disabled,false);
 h.nodes.get('#enquiry-form').events.submit({preventDefault(){prevented=true}});
 assert.ok(prevented);assert.equal(h.copied,null);assert.equal(h.nodes.get('#enquiry-preview').hidden,false);
 assert.ok(h.nodes.get('#prepared-message').value.includes('<img src=x onerror=alert(1)>'));
 await h.nodes.get('#copy-enquiry').events.click();assert.equal(h.copied,h.nodes.get('#prepared-message').value);
 h.nodes.get('#enquiry-fields').events.input();assert.equal(h.nodes.get('#prepared-message').value,'');assert.equal(h.nodes.get('#enquiry-preview').hidden,true);
});
test('Clipboard denial offers manual copying',async()=>{
 const h=harness({clipboardFails:true});h.nodes.get('#enquiry-form').events.submit({preventDefault(){}});await h.nodes.get('#copy-enquiry').events.click();
 assert.ok(h.nodes.get('#prepared-message').selected);assert.match(h.nodes.get('#form-status').textContent,/manually/);
});
test('Embedded pages do not enable the enquiry form',()=>{
 const h=harness({framed:true});assert.ok(h.replaced);assert.equal(h.nodes.get('#enquiry-fields').disabled,true);
});
