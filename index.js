const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const http = require("http")

const { Server } = require("socket.io")

const app = express()
require("dotenv").config()

app.use(cors())
app.use(express.json())

const server = http.createServer(app);


const io = new Server(server,{
    cors:{
        origin: 'http://localhost:3000',
        methods: ["GET","POST"]
    }
})

io.on("connection",(socket)=>{

    socket.on("join_room",(data)=>{
        socket.join(data.roomId)
        socket.emit("recieved_message",data.name)
    })

    socket.on("send_message",(data)=>{
        socket.to(data.roomId).emit("recieved_message" , data)
    })

    socket.on("disconnect",()=>{
        console.log("User Disconnected from socket")
    })
})

server.listen(process.env.PORT,()=>{
    console.log("Server Running")
})