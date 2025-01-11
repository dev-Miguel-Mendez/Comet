import mime from 'mime'
import fs from 'node:fs'
import http from 'node:http'
mime

const sendFile = (fileName: string, res: http.ServerResponse, dirPath: string )=>{
    const readable = fs.createReadStream(dirPath + fileName)

    res.setHeader('Content-Type', (mime as any).getType(dirPath + fileName)) //!! Update this
    readable.pipe(res)

}

export default sendFile