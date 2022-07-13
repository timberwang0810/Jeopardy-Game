import createTable from './vis.js';
import * as d3 from "https://cdn.skypack.dev/d3@7";

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
var currPoint = 0;
var answerer = "";

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
        this.disabled = true;
    }
    yes.onclick = (e) => {
        console.log("correct!");
        //TODO: GET CURRENT QUESTIONS AND ADD POINTS TO LOCAL CLIENT
        socket.emit("answer.correct", {
            answerer: answerer,
            points: points[answerer] + currPoint //TODO CHANGE TO ACTUAL USER POINT
        });
    }
    no.onclick = (e) => {
        console.log("incorrect!");
        points[answerer] = points[answerer] - currPoint;
        //TODO: GET CURRENT QUESTIONS AND SUBTRACT POINTS TO LOCAL CLIENT
        socket.emit("answer.incorrect", {
            answerer: answerer,
            points: points[answerer] - currPoint //TODO CHANGE TO ACTUAL USER POINT
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
        // on click call up question
        const mclick = function () {
            const question = game.filter(d => d.category == this.getAttribute("category"))[0][this.getAttribute('value')].question
            d3.select('.textbox').html(question)
            currPoint = parseInt(this.getAttribute('value'));
            allow.disabled = false
        }
        // on double click call up answer
        const dblclick = function () {
            const answer = game.filter(d => d.category == this.getAttribute("category"))[0][this.getAttribute('value')].answer
            d3.select('.textbox').html(answer)
        }
        const clear = function () {
            d3.select('.textbox').html('')
        }

        d3.select('#clear').on('click', clear)

        const cells = d3.selectAll('.question')
        cells.on('click', mclick).on('dblclick', dblclick);
        
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
    if (role === "host"){
        answerer = data.answerer
        yes.disabled = false;
        no.disabled = false;
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

