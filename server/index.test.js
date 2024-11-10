import { expect } from 'chai';
import { getToken, initializeTestDb, insertTestUser } from './helpers/test.js';

/* Import expect from chai and create a test,
 that calls API that is returning all tasks.
Test suite is created using describe. 
Inside test suite a test case is implemented. 
In this case API retrieving all tasks
 is called and verified, that response status is 200
 (HTTP status OK), data returned is an array
 containing keys id and description and it is not empty. 
Async-await syntax is used to call tested backend.
*/

const base_url = 'http://localhost:3001'

describe('GET tasks', () => {
    before(() => {
        initializeTestDb()
    })

    it ('should get all tasks', async() => {
        const response = await fetch(base_url)
        const data = await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.be.an('array').that.is.not.empty
        expect(data[0]).to.include.all.keys('id','description')
        })
    })



/* Create another test suite
 and test case for creating (inserting) new tasks. 
In this case json is posted into server. 
It should return status 200
 and data is an object having id. 
*/

describe('POST task', () => {
    const email = 'post@foo.com'
    const password = 'post123'
    insertTestUser(email,password)
    const token = getToken(email)
    it ('should post a task', async() => {
        const response = await fetch(base_url + '/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  token
            },
            body: JSON.stringify({'description': 'Task from unit test'})
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
        })

    it ('should not post a task without description', async() => {
        const response = await fetch(base_url + '/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description': null})
        })
        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
        })
})

/* Delele is tested
 by passing hardcoded id 1 at this point. 
This could be improved and will be done later. 
Backend works and returns successful result
 even though there is no data/record with id 1 
 (deleting non-existing record does not throw an error).  
*/

describe('DELETE task', () => {
    const email = 'delete@foo.com'
    const password = 'delete123'
    insertTestUser(email,password)
    const token = getToken(email)
    it ('should delete a task',async() =>  {
        const response = await fetch(base_url + '/delete/1', {
            method: 'delete',
            headers: {
                Authorization: token
            }
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
        })

    it ('should not delete a task with SQL injection',async() =>  {
        const response = await fetch(base_url + '/delete/id=0 or id > 0', {
            method: 'delete',
            headers: {
                Authorization: token
            }
        })
        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

})

/* Create test for register endpoint. 
If server does not return HTTP status 201,
 error message received from the server (data.error) 
 will be printed to test results. 
*/

describe('POST register', () => {
    const email = 'register@foo.com';
    const password = 'register123';

    it ('should register with valid email and password', async () => {
        const response = await fetch(base_url + '/user/register', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email': email, 'password': password})
        })
    const data = await response.json()
    expect(response.status).to.equal(201,data.error)
    expect(data).to.be.an('object')
    expect(data).to.include.all.keys('id','email')
    });


})

describe('POST login', () => {
    const email = 'login@foo.com'
    const password = 'login123'
//User with test data will be added before testing login endpoint.
    insertTestUser(email,password)
    it ('should login with valid credentials', async() => {
        const response = await fetch(base_url + '/user/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email': email, 'password': password})
        })
        const data = await response.json()
        expect(response.status).to.equal(200,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email','token')
    })
})