const app = require("express")()
const http = require('http').createServer(app);
const io = require("socket.io")(http)

var clients ={}

app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/index.html");
})

io.on("connection",(socket)=>{
//    socket.on('list',(list)=>{
//        socket.broadcast.emit('list',list)
//    })
    socket.on('join', (name)=>{
        console.log("Name : " + name)
        clients[socket.id] = name;
        socket.emit("update", "Bem vindo a sala de conversa");
        socket.broadcast.emit("online", clients[socket.id])
        socket.broadcast.emit("update", name + " acabou de entrar")
        
    })
    socket.on('msg', (msg)=>{
        console.log(msg)
       socket.broadcast.emit('msg', clients[socket.id],msg)
    })
    socket.on("disconnect", ()=>{
        console.log(socket.id + " foi desconectado")
        io.emit("update", clients[socket.id] + " saiu da sala");
        socket.broadcast.emit("out",clients[socket.id])
        delete clients[socket.id];

    })
   
}
    
)

http.listen(3000,()=>{
    console.log("listening 3000")
})