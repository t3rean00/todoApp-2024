import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRouter from './routers/todoRouter.js';
import userRouter from './routers/userRouter.js';

const port = process.env.PORT


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/',todoRouter)
app.use('/user',userRouter)

/*
Middleware can be used to manage certain functionalities in one place. 
Create following code on index.js,
 which will handle all errors in the server and return error message. 
This will simplify error handling and make error messages consistent. 
If error provided HTTP status code, it will be returned,
 otherwise general code 500 (internal server error). 
Status code and error message as JSON object are returned. 
*/

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({error: err.message})
})

app.listen(port)