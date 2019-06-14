// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        rank_label: {
            default: null,
            type: cc.Label
        },

        unick_label: {
            default: null,
            type: cc.Label
        },

        uchip_label: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    
    show_rank_info: function(rank, rank_data){
        // rank_data = [unick, usex, uface, uchip]

        this.rank_label.string = "" + rank;
        this.unick_label.string = "" + rank_data[0];
        this.uchip_label.string = "" + rank_data[3];
    },

    // update (dt) {},
});
