import Comet from "../framework/comet.js";
import http from "node:http";

console.clear()

const __dirname = import.meta.dirname
__dirname

const server = new Comet();

server.get('/somepath', (req: http.IncomingMessage, res: http.ServerResponse)=>{
	req; 
	res.end('Hello there')
})

server.post('/postpath', (_req: http.IncomingMessage, res: http.ServerResponse)=>{
	res.end('Post path!')
})

server.get('/index', (_req: http.IncomingMessage, res: http.ServerResponse)=>{
	(res as any).sendFile(__dirname + '/public/index.html')
})

server.get('/styles.css', (_req: http.IncomingMessage, res: http.ServerResponse)=>{ 
	(res as any).sendFile(__dirname + '/public/styles.css')
})

server.get('/index.js', (_req: http.IncomingMessage, res: http.ServerResponse)=>{
	(res as any).sendFile(__dirname + '/public/index.js')
})
 
server.listen(3000, () => {
	console.log("server is up on port 3000");
});

// comet.get("/test", (req: any, res: any) => {
// 	req;
// 	res.end("Hello back");
// });

// comet.get("/second", (req: any, res: any) => {
// 	res.end("Test 2");
// 	req;
// });

process.stdin.on('data', (data)=>{
	const str = data.toString().trim()
	if (str === 'R' || str === 'r') {	
		console.log(server.routes)
	}
})