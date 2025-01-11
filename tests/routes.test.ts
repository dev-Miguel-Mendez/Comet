import request from 'supertest'
import server from '../src/user/server-setup.js'
import { describe, expect, it, test } from "vitest";

describe('Routes' , ()=>{
    test('/somepath should work', async()=>{
        const response = await request(server.server)
        .get('/somepath')
        .expect(200)
    })
    // test('"sendeFile()" should work for index.html', async()=>{
    //     const response = await request(server.server)
    //     .get('/')
    //     .expect(200)
    // })
})