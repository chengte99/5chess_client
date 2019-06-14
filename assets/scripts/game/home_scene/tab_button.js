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

        icon_normal: {
            default: null,
            type: cc.SpriteFrame
        },

        icon_select: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.label = this.node.getChildByName("name");
    },

    start () {

    },

    set_active: function(is_active){
        this.is_active = is_active;
        if(this.is_active){
            this.icon.spriteFrame = this.icon_select;
            this.label.color = new cc.Color(64, 155, 226, 255);
        }else{
            this.icon.spriteFrame = this.icon_normal;
            this.label.color = new cc.Color(118, 118, 118, 255);
        }
    },

    // update (dt) {},
});
