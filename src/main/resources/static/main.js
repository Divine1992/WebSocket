'use strict';

var stompClient = null;
var username = null;

function connect(event) {
    username = document.querySelector("#name").value.trim();

    if(username){
        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {
    stompClient.subscribe('/channel/public', onMessageReceived);

    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username}))
}

function onError() {
}

function sendMessage(event) {
    var messageContent = document.querySelector("#message").value.trim();

    if(messageContent && stompClient) {
        var message = {
            sender: username,
            content: messageContent
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
        document.querySelector("#message").value = '';
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    document.querySelector("#messageArea").value += "Sender "+message.sender+"\n"+message.content+"\n";
}

document.querySelector("#sendMessageForm").addEventListener('submit', sendMessage, true);
document.querySelector("#connectForm").addEventListener('submit', connect, true);
