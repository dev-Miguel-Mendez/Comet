import http from "node:http";
import sendFileFunction from "./utils/sendFile.js";
import parseBody from "./utils/parseBody.js";
import saveToFile from "./utils/saveToFile.js";

parseBody;

class Comet {
	server: http.Server;
	routes: { [key: string]: { [key: string]: Function } } = {};
	staticDir: string = "./public";

	constructor() {
		this.server = http.createServer(async (req, res) => {
			const method = req.method || "GET";
			const path = req.url || "/";
			//prettier-ignore
			const handler: Function = this.routes[method.toUpperCase()]?.[path.toLowerCase()]
			if (handler) {
				//$ Here we mess with the prototype of the res object
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

	post(path: string, cb: Function) {
		if (!this.routes.POST) this.routes.POST = {};
		this.routes.POST[path] = cb;
	}

	delete(path: string, cb: Function) {
		if (!this.routes.DELETE) this.routes.DELETE = {};
		this.routes.DELETE[path] = cb;
	}
	put(path: string, cb: Function) {
		if (!this.routes.PUT) this.routes.PUT = {};
		this.routes.PUT[path] = cb;
	}
	patch(path: string, cb: Function) {
		if (!this.routes.PATCH) this.routes.PATCH = {};
		this.routes.PATCH[path] = cb;
	}

	listen(PORT: number, cb: Function) {
		this.server.listen(PORT, () => {
			cb();
		});
	}
	setStaticDir(dirPath: string) {
		this.staticDir = dirPath + "/";
	}
}

export default Comet;
