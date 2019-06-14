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
        ret_label: {
            default: null,
            type: cc.Label,
        },

        score_label: {
            default: null,
            type: cc.Label,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.active = false;
    },

    show_result: function(ret, score){
        // ret, 1= win, 2= 平局, 0=lose
        this.node.active = true;

        if(ret == 2){
            this.ret_label.string = "平局";
            this.score_label.string = "這局沒有輸贏 !!！";
        }else if(ret == 1){
            this.ret_label.string = "獲勝";
            this.score_label.string = "您贏得了" + score + "元!!！";
        }else{
            this.ret_label.string = "戰敗";
            this.score_label.string = "您損失了" + score + "元!!！";
        }
    },

    hide_dlg: function(){
        this.node.active = false;
    },

    // update (dt) {},
});
