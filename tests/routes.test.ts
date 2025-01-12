import request from 'supertest'
import fs from 'node:fs'
import server from '../src/user/server-setup.js'
import { describe, test, expect } from "vitest";

describe('Routes' , ()=>{
    test('/getpath should work', async()=>{
        const response = await request(server.server)
        .get('/getpath')
        .expect(200)
    })
    test('/post path should work', async()=>{
        const response = await request(server.server)
        .post('/postpath')
        .expect(200)
        expect(response.text).toBe('Hello from postpath!')
    })
    // test('/delete path should work', async()=>{
    //     const response = await request(server.server)
    //     .delete('/deletepath')
    //     .expect(200)
    // })
    test('"sendFile()" should work for index.html', async()=>{
        const response = await request(server.server)
        .get('/')
        .expect(200)
    })
    test('"sendFile()" should work for index.css', async()=>{
        const response = await request(server.server)
        .get('/styles.css')
        .expect(200)
    })
    test('"sendFile()" should work for index.js', async()=>{
        const response = await request(server.server)
        .get('/index.js')
        .expect(200)
    })
    test('"sendFile()" should NOT work for non-existing path', async()=>{
        const response = await request(server.server)
        .get('/haha')
        .expect(404)
    })

    test('"parsebody()" should work for JSON', async()=>{
        const response = await request(server.server)
        .post('/testparsebody').send(JSON.stringify({key1:"value2"})).expect(200)
        expect(response.text).toBe("{\"key1\":\"value2\"}")
    })
    test('"parsebody()" should work for small non JSON body', async()=>{
        const response = await request(server.server)
        .post('/testparsebody')
        .send('Hello there!')
        .expect(200)
        expect(response.text).toBe('"Hello there!"')
    })
    test('"parsebody()" should work for large (10KB+) body', async()=>{
        const buffer = fs.readFileSync("tests/fixtures/superUpload.png")
       const response = await request(server.server)
       .post('/testparsebody')
       .send(buffer)
       .expect(400)
       expect(response.text).toBe("Body is too large!")
    })

    test('Delete path should work', async()=>{
        const response = await request(server.server)
        .delete('/deletepath')
        .expect(200)
        expect(response.text).toBe('Hello from deletepath!')
    })

    test('Patch path should work', async()=>{
        const response = await request(server.server)
        .patch('/patchpath')
        .expect(200)
        expect(response.text).toBe('Hello from patchpath!')
    })
    
})