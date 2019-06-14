// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var BLOCK_WIDTH = 41;
var five_chess = require("five_chess");

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
        chess_prefab: {
            default: [],
            type: cc.Prefab,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.your_turn = false;

        this.node.on(cc.Node.EventType.TOUCH_START, function(e){
            if(!this.your_turn){
                console.log("not your turn");
                return;
            }

            var w_pos = e.getLocation();
            var pos = this.node.convertToNodeSpaceAR(w_pos);
            pos.x += BLOCK_WIDTH * 7;
            pos.y += BLOCK_WIDTH * 7;

            var block_x = Math.floor((pos.x + BLOCK_WIDTH * 0.5) / BLOCK_WIDTH);
            var block_y = Math.floor((pos.y + BLOCK_WIDTH * 0.5) / BLOCK_WIDTH);

            if(block_x < 0 || block_x > 14 || block_y < 0 || block_y > 14){
                console.log("over range");
                return;
            }

            //test
            // this.put_chess(1, block_x, block_y);
            five_chess.put_chess(block_x, block_y);

        }.bind(this), this);
    },

    start () {

    },

    set_your_turn: function(your_turn){
        this.your_turn = your_turn;
    },

    put_chess: function(chess_type, block_x, block_y){
        var chess = cc.instantiate(this.chess_prefab[chess_type - 1]);
        this.node.addChild(chess);

        var pos_x = block_x * BLOCK_WIDTH - BLOCK_WIDTH * 7;
        var pos_y = block_y * BLOCK_WIDTH - BLOCK_WIDTH * 7;

        chess.setPosition(pos_x, pos_y);
    },

    clear_chess: function(){
        this.node.removeAllChildren();
    },

    // update (dt) {},
});
