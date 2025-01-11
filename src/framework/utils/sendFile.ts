import mime from 'mime'
import fs from 'node:fs'
import http from 'node:http'
mime

const sendFile = (filePath: string, res: http.ServerResponse, dirPath: string )=>{
    const readable = fs.createReadStream(filePath)
    res.setHeader('Content-Type', (mime as any).getType(filePath))
    readable.pipe(res)

}

export default sendFile