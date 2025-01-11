import http from "node:http";
import sendFile from "./utils/sendFile.js";

class Comet {
	server: http.Server;
	routes: { [key: string]: { [key: string]: Function } } = {};
	staticDir: string = "./public";

	constructor() {
		this.server = http.createServer((req, res) => {
			const method = req.method || "GET";
			const path = req.url || "/";
			//prettier-ignore
			const handler: Function = this.routes[method.toUpperCase()]?.[path.toLowerCase()]
			if (handler) {
				//$ Here we mess with the prototype of the res object
				//prettier-ignore
				(res as any).sendFile = (fileName: string) => {sendFile(fileName, res, this.staticDir);};
				handler(req, res);
			} else {
				res.statusCode = 400;
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

	listen(PORT: number, cb: Function) {
		this.server.listen(PORT, () => {
			cb();
		});
	}
	setStaticDir(dirPath: string) {
		this.staticDir = dirPath + '/';
	}
}

export default Comet;
