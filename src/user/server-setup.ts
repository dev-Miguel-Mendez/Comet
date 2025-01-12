import Comet from "../framework/comet.js";
import http from "node:http";
import fs from "node:fs";

console.clear();

const __dirname = import.meta.dirname;

const server = new Comet();

server.setStaticDir(process.env.DIRNAME || __dirname + "/public");

//prettier-ignore
server.getMiddleware('/getpath', async (req: http.IncomingMessage, res: http.ServerResponse)=>{
	const body = await (req as any).body()
	console.log('reqbody:', body) 
	res.end('Hello from getpath')
})

//! temp:
//prettier-ignore
server.postMiddleware('/testparsebody', async(req: http.IncomingMessage, res: http.ServerResponse)=>{
		const body = await (req as any).body()
		if(!body){
			res.statusCode = 400
			res.end('Body is too large!')
			req.destroy()
		}else{
			res.end(JSON.stringify(body))
		}
		

})

//prettier-ignore
server.getMiddleware('/', (_req: http.IncomingMessage, res: http.ServerResponse)=>{
	(res as any).sendFile('index.html')
})
//prettier-ignore
server.getMiddleware('/requestnameimage', (req: http.IncomingMessage, res: http.ServerResponse)=>{
	
	let message: any
	req.on('data', (data)=>{
		message = JSON.parse(data.toString())
	})
	req.on('end', ()=>{
		(res as any).sendFile(message.fileName)
		//$ For some reason that I don't know (and I should know lol) if I do ".end()" it doesn't work.
		// res.end()
	})
})
//prettier-ignore
server.postMiddleware('/postpath', (_req: http.IncomingMessage, res: http.ServerResponse)=>{
	res.end('Hello from postpath!')
})
//prettier-ignore
server.postMiddleware('/upload', (req: http.IncomingMessage, res: http.ServerResponse)=>{
	//! I need to implement url parameters here.
	const writable = fs.createWriteStream(__dirname + '/public/' + req.headers['file-name'])
	// req.pipe(writable)
	req.on('data', (chunk)=>{
		writable.write(chunk)
	})
	req.on('end', ()=>{
		res.end('Recibì tu archivo, colega!')
	})
})

//prettier-ignore
server.postMiddleware("/upload2", async (req: http.IncomingMessage, res: http.ServerResponse) => {
		const fileName = req.headers['file-name']
		console.log("File name: ", fileName);
		const result = await (req as any).saveToFile(fileName, 1e6);
		if (!result) {
			res.statusCode = 400;
			res.end("Unable to upload your file, maybe it is too big?");
			req.destroy();
		} else {
			res.end("Successfully uploaded your file");
		}
	}
);

//prettier-ignore
server.getMiddleware('/styles.css', (_req: http.IncomingMessage, res: http.ServerResponse)=>{ 
	(res as any).sendFile('styles.css')
})
//prettier-ignore
server.getMiddleware('/index.js', (_req: http.IncomingMessage, res: http.ServerResponse)=>{
	(res as any).sendFile('index.js')
})
//prettier-ignore
server.deleteMiddleware('/deletepath', (_req: http.IncomingMessage, res: http.ServerResponse)=>{
	res.end('Hello from deletepath!')
})
//prettier-ignore
server.patchMiddleWare('/patchpath', (_req: http.IncomingMessage, res: http.ServerResponse)=>{
	res.end('Hello from patchpath!')
})

process.stdin.on("data", (data) => {
	const str = data.toString().trim();
	if (str === "R" || str === "r") {
		console.log(server.routes);
	}
});

//! We are listening in another file so that we could also test in its um file.

export default server;
