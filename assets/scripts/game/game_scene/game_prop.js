// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var skin_anim = cc.Class({
    name: "skin_anim",
    properties: {
        icon: {
            type: cc.SpriteFrame,
            default: null,
        },
        frame_anims: {
            type: cc.SpriteFrame,
            default: [],
        }
    }
})

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
        skin_set: {
            type: skin_anim,
            default: [],
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sp = this.node.getChildByName("anim").getComponent(cc.Sprite);
        this.frame_anim = this.node.getChildByName("anim").getComponent("frame_anim");
    },

    start () {

    },

    play_prop_anim: function(from, to_dst, prop_id){
        if(prop_id <= 0 || prop_id > 5){
            return;
        }

        this.node.setPosition(from);
        this.sp.spriteFrame = this.skin_set[prop_id - 1].icon;
        this.frame_anim.sprite_frames = this.skin_set[prop_id - 1].frame_anims;

        var m = cc.moveTo(0.5, to_dst).easing(cc.easeCubicActionInOut());
        var end_func = cc.callFunc(function(){
            this.frame_anim.play_once(function(){
                this.node.removeFromParent();
            }.bind(this));
        }.bind(this));
        var seq = cc.sequence([m, end_func]);
        this.node.runAction(seq);

    }

    // update (dt) {},
});
