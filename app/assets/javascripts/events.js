function EventManager() {

}

EventManager.subscribers = {};

EventManager.on = function (event_name, callback) {
    if (isNull(EventManager.subscribers[event_name])) {
        EventManager.subscribers[event_name] = [];
    }
    var listener = new EventListener();
    EventManager.subscribers[event_name][listener.id] = callback;
    return listener;
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

EventManager.unbind = function (id) {
    for (var key in EventManager.subscribers) {
        delete EventManager.subscribers[key][id]
    }
};

var EventListener = function () {
    this.id = guid;
    this.destroy = function () {
        EventManager.unbind(this.id)
    }
};

//Ex
//EventManager.on('some', function (myarg) {
//    console.log('called: ' + myarg);
//});
//
//EventManager.trigger('some', 'custom val');