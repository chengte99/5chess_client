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
        not_inrank: {
            default: null,
            type: cc.Node
        },

        my_rank: {
            default: null,
            type: cc.Label
        },

        rank_item_prefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.content = this.node.getComponent(cc.ScrollView).content;

        game_system.get_world_rank_info();
    },

    show_world_rank: function(my_rank, rank_data){
        if(my_rank <= 0){
            this.not_inrank.active = true;
            this.my_rank.node.active = false;
        }else{
            this.not_inrank.active = false;
            this.my_rank.node.active = true;
            this.my_rank.string = "" + my_rank;
        }

        for(var i = 0; i < rank_data.length; i ++){
            var rank_item = cc.instantiate(this.rank_item_prefab);
            this.content.addChild(rank_item);
            var rank_item_com = rank_item.getComponent("rank_item");
            rank_item_com.show_rank_info(i + 1, rank_data[i]);
        }
    },

    // update (dt) {},
});
