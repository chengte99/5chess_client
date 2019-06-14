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
        total_time: 10,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.running = false;
        this.sp = this.getComponent(cc.Sprite);
    },

    start () {

    },

    start_action: function(time){
        this.total_time = time;
        this.running = true;
        this.now_time = 0;
        this.node.active = true;
    },

    update (dt) {
        if(!this.running){
            return;
        }

        this.now_time += dt;
        var per = this.now_time / this.total_time;
        if(per > 1){
            per = 1;
        }

        this.sp.fillRange = per;

        if(this.now_time >= this.total_time){
            this.running = false;
            this.node.active = false;
        }
    },
});
