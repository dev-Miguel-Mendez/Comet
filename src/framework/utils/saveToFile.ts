import http from "node:http";
import fs from "node:fs";
//prettier-ignore
const saveToFile = async (dirPath: string,req: http.IncomingMessage,fileName: string,maxSize: number)  => {
    return new Promise((resolve, _reject)=>{
        //%By default max size is 100MB
        const writable = fs.createWriteStream(dirPath + fileName);
        let totalSize = 0;
        req.on("data", (chunk) => {

            totalSize += chunk.length;
            if (totalSize > maxSize) {
                console.log('Total size is already greater than Max size');
                resolve(null)
                writable.destroy();
                //$ "destroy()" stops further writing but does not delete the existing data.
                //$ But it closes the streamand emits a "'close'" event.
            } else {
                writable.write(chunk);
            }
        });
        req.on('end', ()=>{
            resolve('success')
        })
        writable.on("close", () => {
            fs.unlink(dirPath + fileName, (err) => {
                if (err) console.log("Error deleting file:", err);
                else{
                    console.log("File deleted successfully.");
                    resolve(null)
                } 
            });
        });
        req.on("error", () => {
            writable.destroy();
            resolve(null)
        });

        writable.on("error", () => {
            req.destroy();
            resolve(null)
        });
       
    })
  
};

export default saveToFile;
