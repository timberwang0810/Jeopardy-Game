import createTable from './vis.js';

var socket = io.connect('http://localhost:3000');

let isReady = false;
let claimHost = null;
let answer = null;
let yes = null;
let no = null;
let msg = null;
let start = null;
let allow = null;
let role = "";

var game = [];
var players = {};
var points = {};

let canAnswer = false;

window.onload = function () {
    claimHost = document.getElementById("claim_host");
    answer = document.getElementById("answer");
    yes = document.getElementById("correct");
    no = document.getElementById("incorrect");
    allow = document.getElementById("allow");

    msg = document.getElementById("msg");
    start = document.getElementById("start_game");

    claimHost.onclick = (e) => {
        console.log("claiming host");
        socket.emit("host.claiming");
    }

    start.onclick = (e) => {
        console.log("start game");
        socket.emit("game.starting")
    }

    allow.onclick = (e) => {
        console.log("people can answer!");
        socket.emit("allow_answer");
    }
    yes.onclick = (e) => {
        console.log("correct!");
        //TODO: GET CURRENT QUESTIONS AND ADD POINTS TO LOCAL CLIENT
        socket.emit("answer.correct", {
            points: 200 //TODO CHANGE TO ACTUAL USER POINT
        });
    }
    no.onclick = (e) => {
        console.log("incorrect!");
        //TODO: GET CURRENT QUESTIONS AND SUBTRACT POINTS TO LOCAL CLIENT
        socket.emit("answer.incorrect", {
            points: 0 //TODO CHANGE TO ACTUAL USER POINT
        });
    }
    answer.onclick = (e) => {
        console.log("hehe");
        socket.emit("answering");
    };
    answer.disabled = true;
};

// const playerReady = (e) => {
//     console.log("ready");
//     socket.emit("player.ready");
// }
// const playerNotReady = (e) => {
//     console.log("not ready");
//     socket.emit("player.not_ready");
// }

socket.on("first.assign", () => {
    console.log("start person assign received");
    document.getElementById("start_game").classList.remove("hidden");
    document.getElementById("start_game").classList.add("shown");
    document.getElementById("msg").classList.remove("shown");
    document.getElementById("msg").classList.add("hidden");
});

socket.on("someone.joined", (data) => {
    players[data.id] = data.username
    points[data.id] = 0;
})

socket.on("someone.left", (data) => {
    delete players[data.id];
    delete points[data.id];
})

socket.on("game.started", () => {
    console.log("game has started");
    msg.classList.remove("shown");
    msg.classList.add("hidden");
    claimHost.classList.remove("hidden");
    claimHost.classList.add("shown");
    claimHost.disabled = false;
    start.classList.remove("shown");
    start.classList.add("hidden");
})
socket.on("host.assigned", (data) => {
    console.log("host result");
    claimHost.disabled = true;
    claimHost.classList.remove("shown");
    claimHost.classList.add("hidden");
    game = data.game;
    createTable(game);
    if (data.hostid == socket.id){
        role = "host";
        // TODO: HOST SCREEN
        yes.classList.remove("hidden");
        yes.classList.add("shown");
        no.classList.remove("hidden");
        no.classList.add("shown");
        allow.classList.remove("hidden");
        allow.classList.add("shown");
        
    }
    else{
        role = "contestant";
        answer.classList.remove("hidden");
        answer.classList.add("shown");
    }
})

socket.on("game_ready", () => {
    console.log("game ready received");
    start.disabled = false;
});

socket.on("game_not_ready", () => {
    console.log("game not ready received");
    start.disabled = true;
});

socket.on("can_answer", () => {
    console.log("I can answer!");
    answer.disabled = false;
    canAnswer = true;
})


socket.on("someone.answering", (data) => {
    console.log("emitted");
    answer.disabled = true;
    if (data.answerer == socket.id){
        answer.style.background = "green";
    }
    else{
        answer.style.background = "red";
    }
});

const onNextRound = () => {
    answer.disabled = true;
    answer.style.background = "white";
    canAnswer = true;
}
socket.on("next_round", () => {
    onNextRound();
})
socket.on("points.awarded", (data) => {
    points[data.id] = data.points;
    onNextRound();
    // TODO: GO TO NEXT ROUND
});

socket.on("points.deducted", (data) => {
    points[data.id] = data.points;
    answer.style.background = "white";
    if (data.id == socket.id){
        answer.disabled = true;
        canAnswer = false;
    }
    else if (canAnswer){
        answer.disabled = false;
    }
})

