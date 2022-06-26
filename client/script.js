var socket = io.connect('http://localhost:3000');

let isReady = false;
let answer = null;
let wait = null;
let start = null;

window.onload = function () {
    answer = document.getElementById("answer");
    wait = document.getElementById("wait");
    start = document.getElementById("start_game");
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
    start.hidden = false;
});

socket.on("game_ready", () => {
    console.log("game ready received");
    start.disabled = false;
});

socket.on("game_not_ready", () => {
    console.log("game not ready received");
    start.disabled = true;

});

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