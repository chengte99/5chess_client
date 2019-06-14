// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var ugame = require("ugame");
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
        title: {
            default: null,
            type: cc.Label
        },
        
        unick: {
            default: null,
            type: cc.Label
        },

        back_btn: {
            default: null,
            type: cc.Node
        },

        world_rank_prefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.second_ui = null;
    },

    start () {
        this.sync_info();
        this.back_btn.active = false;
    },

    sync_info: function(){
        this.unick.string = ugame.unick;
    },

    on_click_backbtn: function(){
        this.back_btn.active = false;
        if(this.second_ui != null){
            this.second_ui.removeFromParent();
            this.second_ui = null;
        }
        this.title.string = "系統";
    },

    on_world_rank_click: function(){
        this.back_btn.active = true;
        if (this.second_ui != null) {
            this.second_ui.removeFromParent();
        }
        this.second_ui = cc.instantiate(this.world_rank_prefab);
        this.node.addChild(this.second_ui);
        this.title.string = "排行榜";
    },

    on_get_world_rank_data: function(my_rank, rank_data){
        if (this.second_ui != null) {
            var world_rank = this.second_ui.getComponent("world_rank");
            if(world_rank){
                world_rank.show_world_rank(my_rank, rank_data);
            }
        }
    },

    // update (dt) {},
});
