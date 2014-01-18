var RoomGameSideView = Backbone.View.extend({
    template: _.template($("#game-sideview-template").html()),

    initialize: function(options) {
	this.vent = options.vent;

	
	this.model.on("change:lastChat", this.renderChat, this);
    },
    

    events: {
	"keypress #gameChatInput": "chatPress"
    },


    renderChat: function() {
	var template = _.template("<li><a><%=sender%></a>: <span><%= chat %></span></li>");

	var chat = this.model.get("lastChat");
	
	this.$('#roomChatList').prepend(template(chat));
    },
    
    render: function() {
	this.setElement(this.template({}));
	return this;
    },


    chatPress: function(evt) {
	if(evt.charCode == 13) {

	    var chat = this.$("#gameChatInput").val();
	    this.vent.trigger("chatRequest", chat);
	    
	    this.$("#gameChatInput").val("");
	    
	    return false;
	}
    }
});
