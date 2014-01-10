var MainApp = function(options) {
    var self = this;

    self.eventBus = options.eventBus;

    self.apiKey = "9941f8f9-bfb7-4c23-b";
    self.secretKey = "localhost";
    
    self.connect = function(nameId) {
	AppWarp.WarpClient.initialize(self.apiKey, self.secretKey);
	self._warpclient = AppWarp.WarpClient.getInstance();

	self.ResponseHandlers = new ResponseHandlers(self._warpclient, self.eventBus);
	self.setResponseListeners(self._warpclient);

	self._warpclient.connect(nameId, "");
    };

    self.getLiveRoomInfo = function(id) {
	self._warpclient.getLiveRoomInfo(id);
    }

    self.createRoom = function(name, owner) {
	self._warpclient.createRoom(name, owner, 4, null);
    };

    self.createTurnRoom = function(name, owner) {
	self._warpclient.createTurnRoom(name, owner, 4, {type: "game"}, 240);
    };

    self.joinRoom = function(id) {
	self._warpclient.joinRoom(id);
    };


    self.sendChat = function(chat) {
	self._warpclient.sendChat(chat);
    };

    self.sendMove = function(move) {
	self._warpclient.sendMove(move);
    };

    self.setResponseListeners = function() {
	var _warpclient = self._warpclient;
	
	_warpclient.setResponseListener(AppWarp.Events.onConnectDone, self.ResponseHandlers.onConnectDone);
        _warpclient.setResponseListener(AppWarp.Events.onGetAllRoomsDone, self.ResponseHandlers.onGetAllRoomsDone);
        _warpclient.setResponseListener(AppWarp.Events.onGetLiveRoomInfoDone, self.ResponseHandlers.onGetLiveRoomInfo);
        _warpclient.setResponseListener(AppWarp.Events.onJoinRoomDone, self.ResponseHandlers.onJoinRoomDone);
        _warpclient.setResponseListener(AppWarp.Events.onSubscribeRoomDone, self.ResponseHandlers.onSubscribeRoomDone);
        _warpclient.setResponseListener(AppWarp.Events.onLeaveRoomDone, self.ResponseHandlers.onLeaveRoomDone);
        _warpclient.setResponseListener(AppWarp.Events.onUnsubscribeRoomDone, self.ResponseHandlers.onUnsubscribeRoomDone);
	_warpclient.setResponseListener(AppWarp.Events.onCreateRoomDone, self.ResponseHandlers.onCreateRoomDone);

	_warpclient.setResponseListener(AppWarp.Events.onSendMoveDone, self.ResponseHandlers.onSendMoveDone);

	_warpclient.setNotifyListener(AppWarp.Events.onChatReceived, self.ResponseHandlers.onChatReceived);

	_warpclient.setNotifyListener(AppWarp.Events.onUserJoinedRoom, self.ResponseHandlers.onUserJoinedRoom);
	_warpclient.setNotifyListener(AppWarp.Events.onGameStarted, self.ResponseHandlers.onGameStarted);
	_warpclient.setNotifyListener(AppWarp.Events.onMoveCompleted, self.ResponseHandlers.onMoveCompleted);
    }

    // auto join when a room is created
    self.eventBus.on("createRoomDone", function(room) {
	self.joinRoom(room.getRoomId());
    });

};



var ResponseHandlers = function(warpClient, eventBus) {
    var self = this;

    self._warpclient = warpClient;
    self._eventBus = eventBus;
    
    self.onConnectDone = function(res) {
	if (res == AppWarp.ResultCode.Success)
	{
	    self._eventBus.trigger("connectDone");
	    self._warpclient.getAllRooms();
	}  else {
	    console.log(res);
	}
    };

    self.onGetAllRoomsDone = function(rooms) {
	for (var i = 0; i< rooms.getRoomIds().length; ++i) {
	    self._warpclient.getLiveRoomInfo(rooms.getRoomIds()[i]);
	}
    };
    
    self.onGetLiveRoomInfo = function(room) {
	self._eventBus.trigger("liveRoomInfo", room);
    };
    
    self.onJoinRoomDone = function(room) {
	if (room.getResult() == AppWarp.ResultCode.Success) {
	   self._warpclient.subscribeRoom(room.getRoomId());
	} else {
	    console.log('err: ' + room.getResult());
	}
    };
    
    self.onSubscribeRoomDone = function(room) {
	if (room.getResult() == AppWarp.ResultCode.Success) {
	    self._eventBus.trigger("subscribeRoomDone", room);
	} else {
	    console.log('err: ' + room.getResult());
	}
	
    };
    
    self.onLeaveRoomDone = function(room) {
    };

    self.onUnsubscribeRoomDone = function(room) {
    };



    self.onCreateRoomDone = function(room) {
	if (room.getResult() == AppWarp.ResultCode.Success) {
	    self._eventBus.trigger("createRoomDone", room);
	} else {
	    console.log("err : " + room.getResult());
	}
    };

    self.onSendMoveDone = function(event) {
	console.log(event);
    }

    
    // Notify Listeners
    self.onChatReceived = function(chat) {
	self._eventBus.trigger("chatReceived", chat);
    };

    self.onUserJoinedRoom = function(room, user) {
	self._eventBus.trigger("userJoinedRoom", { room: room, username: user});
    };

    self.onGameStarted = function(sender, room, nextTurn) {
	self._eventBus.trigger("gameStarted", {sender: sender, room: room, nextTurn: nextTurn });
	
    };

    self.onMoveCompleted = function(move) {
	self._eventBus.trigger("moveCompleted", move);
    };
}
