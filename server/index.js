const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const clients = {};
const MAX_PLAYERS = 5
const MIN_PLAYERS = 3;
let isAnswering = false;
let numPlayers = 0;
let firstid = "";

app.use(express.static(__dirname + "/../client/"));
app.use(express.static(__dirname + "/../node_modules/"));

app.get("/", (req, res) => {
    // res.sendFile("index.html", { root: __dirname + "/../client" });
    const stream = fs.createReadStream(__dirname + "/../client/index.html");
    stream.pipe(res);
});

const addClient = socket => {
    console.log("New client connected", socket.id);
    clients[socket.id] = socket;
};
const removeClient = socket => {
    console.log("Client disconnected", socket.id);
    delete clients[socket.id];
};

io.on('connection', (socket) => {
    console.log('a user connected');
    if (numPlayers > MAX_PLAYERS){

    }
    let id = socket.id;

    addClient(socket);
    if (numPlayers == 0){
        socket.emit("first.assign");
        firstid = id;
    }
    numPlayers++;
    console.log("server: a player ready, num players: " + numPlayers);

    if (numPlayers >= MIN_PLAYERS) {
        console.log("reached");
        io.to(firstid).emit("game_ready");
        console.log("finish emit");
    }

    // socket.on("mousemove", data => {
    //     data.id = id;
    //     socket.broadcast.emit("moving", data);
    // });

    socket.on("answering", () => {
        console.log("click");
        if (isAnswering){
            return;
        }
        isAnswering = true;
        io.emit("someone.answering", {
            answerer: socket.id
        });
    })

    socket.on("disconnect", () => {
        numPlayers--;
        console.log("a user disconnected, num players: " + numPlayers);
        removeClient(socket);
        socket.broadcast.emit("clientdisconnect", id);
        if (numPlayers == 0){
            firstid = "";
        }
        else {
            if (socket.id === firstid){
            const ids = Object.keys(clients);
            const random_id = ids[Math.floor(Math.random() * ids.length)];
            io.to(random_id).emit("first.assign");
            firstid = random_id;
            }
            if (numPlayers < MIN_PLAYERS){
                io.to(firstid).emit("game_not_ready");
            }
            else{
                io.to(firstid).emit("game_ready");
            }
        }
    });
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});