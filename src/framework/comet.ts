import http from "node:http";
import sendFileFunction from "./utils/sendFile.js";
import parseBody from "./utils/parseBody.js";
import saveToFile from "./utils/saveToFile.js";
//prettier-ignore
type Middleware = (req: http.IncomingMessage, res: http.ServerResponse, next: Function) => void;
//prettier-ignore
type RouteHandler = (req: http.IncomingMessage, res: http.ServerResponse) => void;

class Comet {
	server: http.Server;
	routes: {
		[method: string]: {
			[path: string]: {
				middlewares: Middleware[];
				handler: RouteHandler;
			};
		};
	} = {};
	staticDir: string = "./public";

	constructor() {
		this.server = http.createServer(async (req, res) => {
			const method = req.method || "GET";
			const path = req.url || "/";
			//prettier-ignore
			const handler: Function = this.routes[method.toUpperCase()]?.[path.toLowerCase()]
			if (handler) {
				//prettier-ignore
				(res as any).sendFile = (fileName: string) => {
                    sendFileFunction(fileName, res, this.staticDir);
                };
				//prettier-ignore
				(req as any).saveToFile = async (fileName: string, maxSize: number = 1e8)=>{
					return await saveToFile(this.staticDir, req, fileName, maxSize);
				}
				//prettier-ignore
				(req as any).body = async ()=>{ return await parseBody(req); }

				handler(req, res);
			} else {
				res.statusCode = 404;
				res.end("Route not found");
			}
		});
	}

	get(path: string, cb: Function) {
		if (!this.routes.GET) this.routes.GET = {};
		this.routes.GET[path] = cb;
	}
	//prettier-ignore
	getMiddleware(path: string,...middlewaresAndHandler: (Middleware | RouteHandler)[]) {
		if (!this.routes.GETMID) this.routes.GETMID = {};
		const handler = middlewaresAndHandler.pop() as RouteHandler;
		const middlewares = middlewaresAndHandler as Middleware[];
		this.routes.GETMID[path] = { middlewares, handler };
	}

	post(path: string, cb: Function) {
		if (!this.routes.POST) this.routes.POST = {};
		this.routes.POST[path] = cb;
	}
	//prettier-ignore
	postMiddleware(path: string, ...middlewaresAndHandler: (Middleware | RouteHandler)[]){
		if (!this.routes.POST) this.routes.POST = {}
		const handler = middlewaresAndHandler.pop() as RouteHandler
		const middlewares = middlewaresAndHandler as Middleware[];
		this.routes.POST[path] = {middlewares, handler}
	}

	delete(path: string, cb: Function) {
		if (!this.routes.DELETE) this.routes.DELETE = {};
		this.routes.DELETE[path] = cb;
	}
	deleteMiddleware(
		path: string,
		...middlewaresAndHandler: (Middleware | RouteHandler)[]
	) {
		if (!this.routes.DELETE) this.routes.DELETE = {};
		const handler = middlewaresAndHandler.pop() as RouteHandler;
		const middlewares = middlewaresAndHandler as Middleware[];
		this.routes.DELETE[path] = { middlewares, handler };
	}
	put(path: string, cb: Function) {
		if (!this.routes.PUT) this.routes.PUT = {};
		this.routes.PUT[path] = cb;
	}
	patch(path: string, cb: Function) {
		if (!this.routes.PATCH) this.routes.PATCH = {};
		this.routes.PATCH[path] = cb;
	}

	private executeMiddlewares(
		req: http.IncomingMessage,
		res: http.ServerResponse,
		middlewares: Middleware[],
		finalHandler: Function
	) {
		const execute = (index: number)=>{
			if(index < middlewares.length){
				middlewares[index](req, res, ()=>{execute(index+1)})
			} else{
				finalHandler()
			}
		}
		execute(0)
	}

	setStaticDir(dirPath: string) {
		this.staticDir = dirPath + "/";
	}
	listen(PORT: number, cb: Function) {
		this.server.listen(PORT, () => {
			cb();
		});
	}
}

export default Comet;
