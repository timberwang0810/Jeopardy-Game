var socket = io.connect('http://localhost:3000');

let isReady = false;
let claimHost = null;
let answer = null;
let yes = null;
let no = null;
let msg = null;
let start = null;
let role = "";

window.onload = function () {
    claimHost = document.getElementById("claim_host");
    answer = document.getElementById("answer");
    yes = document.getElementById("yes");
    no = document.getElementById("no");

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
    // answer.onclick = (e) => {
    //     console.log("hehe");
    //     socket.emit("answering");
    // };
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
    start.classList.remove("hidden");
    start.classList.add("shown");
});

socket.on("game.started", () => {
    console.log("game has started");
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
    if (data.hostid == socket.id){
        role = "host";
        // TODO: HOST SCREEN
    }
    else{
        role = "contestant";
        // TODO: CONTESTANT SCREEN
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

socket.on()

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