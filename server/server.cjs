'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');const {Matchmaking}=require('./matchmaking.cjs');
function createServer({matchmaking=new Matchmaking(),staticRoot=null}={}){
 const limits=new Map();const sweep=setInterval(()=>{matchmaking.sweep();for(const [ip,v] of limits)if(Date.now()-v.start>60000)limits.delete(ip);},250);sweep.unref();
 const server=http.createServer(async(req,res)=>{
  const send=(code,obj)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(obj));};
  try{const url=new URL(req.url,'http://localhost');
   if(url.pathname==='/healthz')return send(200,{ok:true});
   if(!url.pathname.startsWith('/api/pokemon/')){if(staticRoot&&['GET','HEAD'].includes(req.method)){const file=path.resolve(staticRoot,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(path.resolve(staticRoot)+path.sep))return send(404,{});const stat=fs.statSync(file);if(!stat.isFile())return send(404,{});const ext=path.extname(file);res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'application/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.json':'application/json','.mp3':'audio/mpeg','.wav':'audio/wav','.svg':'image/svg+xml'})[ext]||'application/octet-stream'});if(req.method==='HEAD')return res.end();return fs.createReadStream(file).pipe(res);}return send(404,{error:'Não encontrado'});}
   const token=(req.headers.authorization||'').replace(/^Bearer /,'');
   const ip=matchmaking.sessions.has(token)?token:req.socket.remoteAddress;let rate=limits.get(ip);if(!rate||Date.now()-rate.start>60000){rate={start:Date.now(),count:0,joins:0};limits.set(ip,rate);}if(++rate.count>3000)return send(429,{error:'Muitas solicitações.'});
   if(req.method==='POST'&&req.headers.origin){let origin;try{origin=new URL(req.headers.origin);}catch{return send(403,{error:'Origem inválida'});}if(origin.host!==req.headers.host)return send(403,{error:'Origem inválida'});}
   if(req.method==='GET'&&url.pathname==='/api/pokemon/state')return send(200,matchmaking.state(token));
   if(req.method!=='POST')return send(405,{error:'Método inválido'});
   if(!String(req.headers['content-type']||'').startsWith('application/json'))return send(415,{error:'Use JSON'});
   let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>2048)return send(413,{error:'Pedido muito grande'});}let body;try{body=JSON.parse(raw||'{}');}catch{return send(400,{error:'JSON inválido'});}if(!body||typeof body!=='object'||Array.isArray(body))return send(400,{error:'Pedido inválido'});
   if(url.pathname==='/api/pokemon/join'){if(++rate.joins>40)return send(429,{error:'Aguarde antes de entrar novamente.'});return send(200,matchmaking.join());}
   if(url.pathname==='/api/pokemon/leave'){matchmaking.leave(token);return send(200,{ok:true});}
   if(url.pathname==='/api/pokemon/action')return send(200,matchmaking.action(token,body));
   send(404,{error:'Não encontrado'});
  }catch(e){send(e.status||((e.code==='ENOENT'||e.code==='EISDIR')?404:500),{error:e.status?e.message:'Não foi possível atender ao pedido.'});}
 });server.on('close',()=>clearInterval(sweep));server.requestTimeout=5000;server.headersTimeout=10000;return server;
}
if(require.main===module){const port=Number(process.env.PORT||3000);createServer({staticRoot:process.env.SERVE_STATIC?path.resolve(__dirname,'../dist'):null}).listen(port,'0.0.0.0',()=>console.log('Pokémon matchmaking on '+port));}
module.exports={createServer};
