function EventManager() {

}

EventManager.subscribers = {};

EventManager.on = function (event_name, callback) {
    if (isNull(EventManager.subscribers[event_name])) {
        EventManager.subscribers[event_name] = [];
    }
    EventManager.subscribers[event_name].push(callback);
};

EventManager.trigger = function (event_name) {
    var args = Array.prototype.slice.call(arguments, 1);
    var subs = EventManager.subscribers[event_name];
    if (!isNull(subs)) {
        for (var i in subs) {
            subs[i].apply(null, args);
        }
    }
};

//Ex
//EventManager.on('some', function (myarg) {
//    console.log('called: ' + myarg);
//});
//
//EventManager.trigger('some', 'custom val');