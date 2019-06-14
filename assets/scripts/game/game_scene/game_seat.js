// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var State = require("State");
var action_time = require("action_time");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        unick: {
            default: null,
            type: cc.Label
        },

        time_bar: {
            default: null,
            type: action_time
        },

        show_info_prefab: {
            default: null,
            type: cc.Prefab
        },

        ready_tips: {
            default: null,
            type: cc.Node
        },

        black_chess: {
            default: null,
            type: cc.Node
        },

        white_chess: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.active = false;
        this.time_bar.node.active = false;
        this.is_self = false;
        this.ready_tips.active = false;

        this.black_chess.active = false;
        this.white_chess.active = false;
    },

    start () {

    },

    seat_sitdown: function(player_info, is_self){
        this.node.active = true;
        this.player_info = player_info;
        this.unick.string = player_info.unick;
        this.is_self = is_self;

        if(player_info.state == State.Ready){
            this.do_ready();
        }
    },

    get_seat_id: function(){
        return this.player_info.sv_seat;
    },

    seat_standup: function(){
        this.node.active = false;
        this.time_bar.node.active = false;
        this.player_info = null;
    },

    on_user_icon_click: function(){
        var game_show_info = cc.instantiate(this.show_info_prefab);
        this.node.parent.addChild(game_show_info);
        var com = game_show_info.getComponent("game_show_info");
        com.show_dlg(this.player_info, this.is_self);
    },

    do_ready: function(){
        this.ready_tips.active = true;
    },

    round_game_start: function(body){
        this.ready_tips.active = false;
        this.player_info.state = State.Playing;

        this.action_time = body[0];
        this.black_seat = body[2];
        this.time_bar.node.active = false;

        if(this.black_seat == this.player_info.sv_seat){
            this.black_chess.active = true;
            this.white_chess.active = false;
        }else{
            this.black_chess.active = false;
            this.white_chess.active = true;
        }
    },

    turn_to_player: function(action_time){
        this.time_bar.node.active = true;

        this.time_bar.start_action(action_time);
    },

    hide_timebar: function(){
        this.time_bar.node.active = false;
    },

    checkout_over: function(){
        this.time_bar.node.active = false;
        this.black_chess.active = false;
        this.white_chess.active = false;
    },

    // update (dt) {},
});
