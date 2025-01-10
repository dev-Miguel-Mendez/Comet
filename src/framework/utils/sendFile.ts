import mime from 'mime'
import fs from 'node:fs'
import http from 'node:http'
mime

const sendFile = (filePath: string, res: http.ServerResponse )=>{
    const readable = fs.createReadStream(filePath)
    readable.pipe(res)
}

export default sendFile