function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {
    attach: function (listener, context) {
	this._listeners.push({ listener: listener, context: context });
    },
    notify: function (args) {
	var index;

	for (index = 0; index < this._listeners.length; index += 1) {
	    this._listeners[index].listener.apply(this._listeners[index].context, [args]);
	}
    }
};


