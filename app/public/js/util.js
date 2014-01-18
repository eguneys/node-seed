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



function GroupStones(stoneS, gap) {
    var result = [];

    stoneS.sort(function(a, b) {
	return a.x - b.x;
    });

    for (var i in stoneS) {
	var added = false;
	
	for (var g in result) {
	    var group = result[g];
	    for (var item in group) {
		if (Math.abs(group[item].y - stoneS[i].y) < 10 && Math.abs(group[item].x - stoneS[i].x) < gap) {
		    group.push(stoneS[i]);
		    added = true;
		    break;
		}
	    }

	    if (added) break;
	}
	if (!added) {
	    result.push([stoneS[i]]);
	    added = false;
	}
    }

    for (var g in result) {
	result[g].sort(function(a, b) {
	    return a.x - b.x;
	});
    }


    return result;
}

