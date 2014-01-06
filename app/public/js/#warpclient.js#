var MainApp = function(options) {
    var self = this;

    self.apiKey = "6370cad1755fd5fb369b170a03c7679ea444f3490e03f32867ecb1c847230cc0";
    self.secretKey = "de3ca688d71db054f3e8d133008af08c6c14f49ebee830d95405b889bc3b4516";


    self.eventBus = options.eventBus;
    
    self.connect = function(nameId) {
	AppWarp.WarpClient.initialize(self.apiKey, self.secretKey);
	self._warpclient = AppWarp.WarpClient.getInstance();

	self.ResponseHandlers = new ResponseHandlers(self._warpclient);
	self.setResponseListeners(self._warpclient);

	self._warpclient.connect(nameId);
    }

    self.setResponseListeners = function() {
	var _warpclient = self._warpclient;
	
	_warpclient.setResponseListener(AppWarp.Events.onConnectDone, self.ResponseHandlers.onConnectDone);
        _warpclient.setResponseListener(AppWarp.Events.onGetAllRoomsDone, self.ResponseHandlers.onGetAllRoomsDone);
        _warpclient.setResponseListener(AppWarp.Events.onGetLiveRoomInfoDone, self.ResponseHandlers.onGetLiveRoomInfo);
        _warpclient.setResponseListener(AppWarp.Events.onJoinRoomDone, self.ResponseHandlers.onJoinRoomDone);
        _warpclient.setResponseListener(AppWarp.Events.onSubscribeRoomDone, self.ResponseHandlers.onSubscribeRoomDone);
        _warpclient.setResponseListener(AppWarp.Events.onLeaveRoomDone, self.ResponseHandlers.onLeaveRoomDone);
        _warpclient.setResponseListener(AppWarp.Events.onUnsubscribeRoomDone, self.ResponseHandlers.onUnsubscribeRoomDone);
        _warpclient.setNotifyListener(AppWarp.Events.onChatReceived, self.ResponseHandlers.onChatReceived);
    }
};



var ResponseHandlers = function(warpClient) {
    var self = this;

    self._warpclient = warpClient;
    
    self.onConnectDone = function(res) {
	if (res == AppWarp.ResultCode.Success)
	{
	    console.log("connected");
	    self._warpclient.getAllRooms();
	}  else {
	}
    };

    self.onGetAllRoomsDone = function(rooms) {
	console.log(rooms);
    };
    
    self.onGetLiveRoomInfo = function(room) {
    };
    
    self.JoinRoomDone = function(room) {
    };
    
    self.onSubscribeRoomDone = function(room) {
    };
    
    self.onLeaveRoomDone = function(room) {
    };

    self.onUnsubscribeRoomDone = function(room) {
    };

    self.onChatReceived = function(chat) {

    };
}
