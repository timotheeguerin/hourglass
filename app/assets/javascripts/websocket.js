var websocket = new WebSocketRails('localhost:3000/websocket');

var channel = websocket.subscribe_private('repository_processing_61');

channel.on_success = function (current_user) {
    console.log(current_user.email + " has joined the channel");
};

channel.on_failure = function (reason) {
    console.log("Authorization failed because " + reason.message);
};

channel.bind('updated', function(data) {
    console.log(data);
});
