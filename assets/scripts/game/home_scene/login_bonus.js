// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var game_system = require("game_system");

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
        bonus_label: {
            default: [],
            type: cc.Label
        },

        zw_node: {
            default: [],
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bonus_info = ["100", "200", "300", "400", "500"];

        for(var i = 0; i < this.bonus_info.length; i ++){
            this.bonus_label[i].string = this.bonus_info[i];
            this.bonus_label[i].node.color = cc.color(0, 0, 0, 255);
            this.zw_node[i].active = false;
        }

        // this.node.active = false;
    },

    start () {
        
    },

    on_close_click: function(){
        this.node.removeFromParent();
    },

    show_get_bonus_info: function(id, bonus, days){
        // this.node.active = true;
        this.bonus_id = id;
        var i;

        if(days > this.bonus_info.length){
            days = this.bonus_info.length;
        }
        for(i = 0; i < days; i ++){
            this.bonus_label[i].node.color = cc.color(255, 0, 0, 255);
            this.zw_node[i].active = true;
        }

        for(; i < this.bonus_info.length; i ++){
            this.bonus_label[i].node.color = cc.color(0, 0, 0, 255);
            this.zw_node[i].active = false;
        }
    },

    on_recv_login_bonus_click: function(){
        game_system.recv_login_bonus(this.bonus_id);
        this.node.removeFromParent();
    },

    // update (dt) {},
});
