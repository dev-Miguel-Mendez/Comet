import Comet from "../framework/comet.js";
import http from "node:http";

console.clear()

const __dirname = import.meta.dirname


const server = new Comet();

server.setStaticDir(__dirname + '/public')

server.get('/somepath', (req: http.IncomingMessage, res: http.ServerResponse)=>{
	req; 
	res.end('Hello there')
})

server.post('/postpath', (_req: http.IncomingMessage, res: http.ServerResponse)=>{
	res.end('Post path!')
})

server.get('/', (_req: http.IncomingMessage, res: http.ServerResponse)=>{
	(res as any).sendFile('index.html')
})

server.get('/styles.css', (_req: http.IncomingMessage, res: http.ServerResponse)=>{ 
	(res as any).sendFile('styles.css')
})

server.get('/index.js', (_req: http.IncomingMessage, res: http.ServerResponse)=>{
	(res as any).sendFile('index.js')
})
 

process.stdin.on('data', (data)=>{
	const str = data.toString().trim()
	if (str === 'R' || str === 'r') {	
		console.log(server.routes)
	}
})

//! We are listening in another file so that we could also test in its um file.

console.log(server.staticDir)

export default server
