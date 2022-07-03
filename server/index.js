const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { getEventListeners } = require('events');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const clients = {};
const MAX_PLAYERS = 5
const MIN_PLAYERS = 3;
let isGameStarted = false;
let isAnswering = false;
let numPlayers = 0;
let firstid = "";
let hostid = "";

let game = [];
let numIncorrect = 0;

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
    if (isGameStarted){
        socket.disconnect();
    }
    // fetch('http://jservice.io/api/random')
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data)
    //     })
    if (numPlayers > MAX_PLAYERS){

    }
    let id = socket.id;

    addClient(socket);
    socket.broadcast.emit("someone.joined", {
        id: id
    });
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

    socket.on("game.starting", () => {
        console.log("server: start game");
        isGameStarted = true;
        io.emit("game.started")
    })

    socket.on("host.claiming", () => {
        console.log("someone is claiming host")
        if (hostid === ""){
            getQuestions()
                .then((game) => {
                    io.emit("host.assigned", {
                        hostid: socket.id,
                        game: game
                    });
                });  
        }
         
    })

    socket.on("allow_answer", () => {
        numIncorrect = 0;
        socket.broadcast.emit("can_answer");
    })
    
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

    socket.on("answer.correct", (data) => {
        console.log("correct");
        numIncorrect = 0;
        io.emit("points.awarded", {
            id: socket.id,
            points: data.points
        });
    })

    socket.on("answer.incorrect", (data) => {
        console.log("incorrect");
        numIncorrect++;
        io.emit("points.deducted", {
            id: socket.id,
            points: data.points
        });
        if (numIncorrect >= Object.keys(clients).length){
            numIncorrect = 0;
            io.emit("next_round");
        }
    })

    socket.on("disconnect", () => {
        numPlayers--;
        console.log("a user disconnected, num players: " + numPlayers);
        removeClient(socket);
        socket.broadcast.emit("someone.left", {
            id: id
        });
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

const getQuestions = async () => {
    // let categories = new Set();
    // let i = 0;
    // while (i < 6){
    //     let response = fetch("http://jservice.io/api/random");
    //     if (response.category != null 
    //         && !categories.has(response.category.id)){
    //         categories.push(response.category.id)
    //         i++;
    //     }
    // }
    let questions = []
    let categories = {}
    let i = 0;
    while (i < 6){
        console.log("entered");
        let category = await getRandomCategory();
        console.log("got cat");
        if (!(category.id in categories)){
            let points = 200;
            let clues = {};
            const url = "http://jservice.io/api/clues";
            while (points < 1200) {
                console.log("start q");
                const response = await fetch(url + "?value=" + points + "&category=" + category.id);
                const rand_items = await response.json();
                //console.log(rand_items);
                let items = rand_items
                    .map(value => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value)
                // console.log(items);
                let clue = null;
                for (let item of items){
                    if (item.answer != null && item.answer !== "" 
                        && item.question != null && item.question !== ""){
                            clue = {question: item.question, 
                                    answer: item.answer};
                            break;
                        }
                }
                console.log("end q");
                if (clue == null){
                    break;
                }
                else{
                    clues[points] = clue;
                    points += 200;
                }
            }
            if (Object.keys(clues).length == 5){
                categories[category.id] = category.title;
                clues.category = category.title;
                questions.push(clues);
                console.log("pushed: " + questions.length);
                i++;
            }
        } 
    }
    // for (const [key,val] of Object.entries(questions)){
    //     const catTitle = categories[key];
    //     game[catTitle] = val;
    // }
    game = questions;
    for (const obj of questions){
        console.log(JSON.stringify(obj, null, 2));
    }
    return game;
}

const getRandomCategory = async () => {
    let result = null;
    while (result == null){
        const response = await fetch("http://jservice.io/api/random");
        const data = await response.json();
        console.log(data);
        const res = data[0];
        if (res.category != null
            && res.category.id != null
            && res.category.id > 0
            && res.category.title != null
            && res.category.title !== "") {
            result = { id: res.category.id, title: res.category.title };
            return result;
        }  
        
    }
    return result;
}

const shuffle = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


server.listen(3000, () => {
    console.log('listening on *:3000');
});