$(document).ready(function() {

    DEBUG = 1;
    var main = new MainController();

    main.init();

});

var MainController = function() {
    var self = this;

    self.viewEventBus = _.extend({}, Backbone.Events);

    self.appEventBus = _.extend({}, Backbone.Events);
    
    self.init = function() {
	self.mainApp = new MainApp({eventBus: self.appEventBus});
	
	self.containerModel = new ContainerModel({viewState: new LoginView({vent: self.viewEventBus})});
	self.containerView = new ContainerView({eventBus: self.viewEventBus, model: self.containerModel});
	self.containerView.render();
    };

    self.viewEventBus.on("login", function(name) {
	self.mainApp.connect(name);
    });

    self.viewEventBus.on("joinRoom", function(id) {
	self.mainApp.joinRoom(id);
    });

    self.viewEventBus.on("chat", function(args) {
	self.mainApp.sendChat(args.value);
    });

    self.viewEventBus.on("playNow", function(args) {
	self.mainApp.createTurnRoom("quickRoom", "name");
    });


    self.viewEventBus.on("drawMiddleStone", function() {
	self.mainApp.sendMove({type: GameConstants.ME_DRAW_CARD_MIDDLE });
    });

    
    self.viewEventBus.on("drawBottomStone", function() {
	self.mainApp.sendMove({type: GameConstants.ME_DRAW_CARD_SIDE });
    });
    
    self.viewEventBus.on("throwStone", function(stone) {
	self.mainApp.sendMove({type: GameConstants.ME_THROW_CARD, card: stone.data });
    });

    self.viewEventBus.on("endGame", function(args) {
	self.mainApp.sendMove({type: GameConstants.ME_FINISHED, cards: args.stones, card: args.stone });
    });

    self.viewEventBus.on("chatRequest", function(chat) {
	self.mainApp.sendChat(chat);
    });
    



    self.appEventBus.on("connectDone", function() {
	self.homeModel = new HomeModel();
	var homeView = new HomeView({vent: self.viewEventBus, model: self.homeModel});
	self.containerModel.set("viewState", homeView);
    });

    self.appEventBus.on("liveRoomInfo", function(room) {

	if (self.gameModel) {
	    var joinedRoom = self.gameModel.get('room');

	    if (joinedRoom.getRoomId() == room.getRoom().getRoomId()) {
		var usernames = room.getUsers();
		for (var i in usernames) {
		    self.gameModel.addPlayer(usernames[i])
		}
		self.gameModel.set("MySide", usernames.length - 1);
	    }
	}
	
	var size = room.json.maxUsers;
	
	if (size == 4) {
	    self.homeModel.submodels.liveRooms.add(new Room({room: room}));
	} else {
	    self.homeModel.submodels.chatRooms.add(new Room({room: room}));
	}
    });

    self.appEventBus.on("subscribeRoomDone", function(room) {
//	self.homeModel.submodels.joinedRooms.add(new Room({ room: room, id: room.getRoomId()}));

	self.gameModel = new GameRoomModel({ room: room });

	self.sideModel = new GameSideModel();

	self.gameModel.submodels.sidemodel = self.sideModel;
	
	
	self.homeModel.submodels.gameRooms.add(self.gameModel);

	self.mainApp.getLiveRoomInfo(room.getRoomId());
    });

    self.appEventBus.on("chatReceived", function(chat) {
	var room = null;
	if (self.homeModel) {
	    room = self.gameModel;

	    if (chat.getSender() == "AppWarpS2") {
		var command = JSON.parse(chat.getChat());
		switch(command.type) {
		    case GameConstants.PLAYER_HAND: { // Player Hand
			console.log(chat);
			self.gameModel.initRake(command);
		    } break;
		    case GameConstants.GAME_STARTINFO: {
			self.gameModel.set("gostergeStone", command.gosterge);
		    } break;
		    case GameConstants.ME_DRAW_CARD_MIDDLE: {
			console.log("drawcardmiddle");
		    } break;
		    case GameConstants.ME_DRAW_CARD_SIDE: {
			self.gameModel.set("drawSideStone", command.side);
		    } break;
		    case GameConstants.ME_DRAW_CARD_MIDDLE_INFO: {
			console.log(command);
			self.gameModel.set("drawMiddleStone", command.card);


			/// DEBUG BOT PLAY
			if (DEBUG) {
			    self.mainApp.sendMove({type: GameConstants.ME_THROW_CARD, card: command.card });
			}
		    } break;
		    case GameConstants.ME_FINISHED: {
			console.log(command);
		    } break;
		}
	    } else {
		self.sideModel.set("lastChat", {sender: chat.getSender(), chat: chat.getChat()});
	    }
	    
	} else {
	    room = self.homeModel.submodels.joinedRooms.at(0);
	}

	room.set('chatMessagesChangeNotify', chat);

    });

    self.appEventBus.on("userJoinedRoom", function(args) {
	if (self.gameModel && self.gameModel.get("room").getRoomId() == args.room.getRoomId()) {
	    self.gameModel.addPlayer(args.username);
	}
    });

    self.appEventBus.on("userLeftRoom", function(args) {
	if (self.gameModel && self.gameModel.get("room").getRoomId() == args.room.getRoomId()) {
	    self.gameModel.removePlayer(args.username);
	}
    });

    self.appEventBus.on('gameStarted', function(args) {
	console.log(args);
	self.gameModel.set("Turn", args.nextTurn);
    });

    self.appEventBus.on('moveCompleted', function(move) {
	self.gameModel.set("Turn", move.getNextTurn());
	console.log(move);
	var data = JSON.parse(move.getMoveData());
	self.gameModel.set("throwStone", {sender: move.getSender(), move: data});


	if (DEBUG) {
	    
	    self.mainApp.sendChat("AppWarp2Sync");
	    self.viewEventBus.trigger("debugCards");
	}
	
	
	if (self.gameModel.myPlayer().name == move.getNextTurn()) {
	    if (DEBUG) {

		

		self.mainApp.sendMove({type: GameConstants.ME_DRAW_CARD_MIDDLE });
	    }

	}

    });
}
