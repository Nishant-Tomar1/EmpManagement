import dotenv from 'dotenv'
import http from 'http'
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path:".env"
})

const server = http.createServer(app);

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
  });

const port = process.env.PORT || 4000;

connectDB()
.then(()=>{
    server.listen(port, ()=>{
        console.log(`Server listening on port : ${port}`);
    })
})
.catch((err)=> {
    console.log("Database Connection Failed !!!",err);
})

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });