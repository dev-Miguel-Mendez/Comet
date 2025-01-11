import http from "node:http";
import sendFile from "./utils/sendFile.js";

class Comet {
    server: http.Server;
    routes: { [key: string]: { [key: string]: Function } } = {};

    constructor(){
        this.server = http.createServer((req, res)=>{
            
            const method = req.method || 'GET'
            const path = req.url || '/'
            const handler: Function = this.routes[method.toUpperCase()]?.[path.toLowerCase()]
            if(handler){
                //$ Here we mess with the prototype of the res object
                (res as any).sendFile = (filePath: string)=>{ sendFile(filePath, res) }
                handler(req, res)
            } else{
                res.statusCode = 400
                res.end('Route not found')
            }
        })
    }

    get(path: string, cb: Function){
        if(!this.routes.GET) this.routes.GET = {}
        this.routes.GET[path] = cb
    }

    post(path: string, cb: Function){
        if(!this.routes.POST) this.routes.POST = {}
        this.routes.POST[path] = cb
    }


    listen(PORT: number, cb: Function){
        this.server.listen(PORT, ()=>{
            cb()
        })
    }
}

export default Comet