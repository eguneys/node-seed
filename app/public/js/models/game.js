var GameRoomCollection = Backbone.Collection.extend({
    model: GameRoomModel
});

var GameRoomModel = Backbone.Model.extend({
    defaults: {
	Player0: { name: "0", score: "" },
	Player1: { name: "1", score: "" },
	Player2: { name: "2", score: "" },
	Player3: { name: "3", score: "" },
	MySide: 0,
	PlayerCount: 0,
	Rake: [],
	drawMiddleStone: -1,
	drawSideStone: -1,
	throwStone: -1,
	gostergeStone: -1,
	Turn: 0,
    },

    submodels: {
	sidemodel: null
    },

    addPlayer: function(user) {
	var playerCount = this.get("PlayerCount");
	
	this.set("Player" + playerCount, { name: user });
	
	this.set("PlayerCount" , ++playerCount);
    },

    removePlayer: function(user) {
	
	var playerCount = this.get("PlayerCount");

	var side = this.getSide(user);


	var myside = this.get("MySide");
	if (myside > side) {
	    this.set("MySide", myside -1);
	}
	
	while (side < playerCount - 1) {
	    var player = this.get("Player" + ((side - 0) + 1));
	    this.set("Player" + side, player);
	    ++side;
	}

	this.set("Player" + side, { name: "empty" });

	
	this.set("PlayerCount", --playerCount);
	
    },

    debugPlayers: function() {
	for (var i in [0, 1, 2, 3]) {
	    console.log(this.get("Player" + i));
	}
    },

    initRake: function(rake) {
	this.set("Rake", rake[this.myPlayer().name]);
    },

    drawMiddleStone: function(card) {
	this.set("drawMiddleStone", card);
    },

    drawSideStone: function() {
	var drawBottomStone = this.get("drawBottomStone");
	this.set("drawBottomStone", ++drawBottomStone);
    },

    getTurnSide: function() {
	return this.getSide(this.get("Turn"));
    },

    getSide: function(name) {
	for (var i in [0, 1, 2, 3]) {
	    if (this.get("Player" + i).name == name) {
		return i;
	    }
	}
    },
    
    myPlayer: function() {
	return this.get("Player" + this.get("MySide"));
    },

    initialize: function(args) {
	
    }
    
});


var GameSideModel = Backbone.Model.extend({
    defaults: {
	lastChat: {}
	
    }
});
