import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';

const app = express();

app.use(
    cors({
        origin :process.env.CORS_ORIGIN,
        credentials : true
    }),
    express.json({
        limit:"1mb"
    }),
    express.urlencoded({
        extended:true,
        limit:"1mb"
    }),
    cookieParser(),
    bodyParser.json(),
)

app.get('/', ( _ , res) => {
    res.send("Server Working Successfully!");
})

export {app}