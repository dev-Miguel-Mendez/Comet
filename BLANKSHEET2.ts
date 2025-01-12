import http from "http";

type Middleware = (req: http.IncomingMessage, res: http.ServerResponse, next: Function) => void;
type RouteHandler = (req: http.IncomingMessage, res: http.ServerResponse) => void;

class Comet {
    private routes: {
        [method: string]: {
            [path: string]: { middlewares: Middleware[]; handler: RouteHandler };
        };
    } = {};
    private server: http.Server;

    constructor() {
        this.server = http.createServer((req, res) => {
            const method = req.method || "GET";
            const path = req.url || "/";
            const route = this.routes[method]?.[path];

            if (route) {
                this.executeMiddlewares(req, res, route.middlewares, () => {
                    route.handler(req, res); // Call the route handler after middlewares
                });
            } else {
                res.statusCode = 404;
                res.end("Route not found");
            }
        });
    }

    listen(port: number, cb: Function) {
        this.server.listen(port, () => cb());
    }

    use(middleware: Middleware) {
        // Global middleware support (optional)
        if (!this.routes["GLOBAL"]) this.routes["GLOBAL"] = {};
        this.routes["GLOBAL"]["*"] = {
            middlewares: this.routes["GLOBAL"]["*"]?.middlewares || [],
            handler: () => {},
        };
        this.routes["GLOBAL"]["*"].middlewares.push(middleware);
    }

    get(path: string, ...middlewaresAndHandler: (Middleware | RouteHandler)[]) {
        if (!this.routes["GET"]) {
            this.routes["GET"] = {};
        }
        const handler = middlewaresAndHandler.pop() as RouteHandler; // Extract the final route handler
        const middlewares = middlewaresAndHandler as Middleware[];
        this.routes["GET"][path] = { middlewares, handler };
    }

    private executeMiddlewares(
        req: http.IncomingMessage,
        res: http.ServerResponse,
        middlewares: Middleware[],
        finalHandler: Function
    ) {
        const execute = (index: number) => {
            if (index < middlewares.length) {
                middlewares[index](req, res, () => execute(index + 1));
            } else {
                finalHandler(); // Call the final route handler
            }
        };
        execute(0);
    }
}

export default Comet;
