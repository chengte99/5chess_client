// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var md5 = require("md5");
var ugame = require("ugame");
var auth = require("auth");

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
        uname_input: {
            default: null,
            type: cc.EditBox
        },

        upwd_input: {
            default: null,
            type: cc.EditBox
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.active = false;
    },

    start () {
        if(!ugame.is_guest){
            this.uname_input.string = ugame.uname;
            this.upwd_input.string = ugame.upwd;
        }
    },

    on_close_click: function(){
        this.node.active = false;
    },

    on_uname_login_submit_click: function(){
        if(!this.uname_input.string || this.uname_input.string.length < 10){
            console.log("uname input must >= 10");
            return;
        }

        if(!this.upwd_input.string || this.upwd_input.string.length <= 0){
            console.log("upwd input must > 0");
            return;
        }

        ugame.save_temp_uname_upwd(this.uname_input.string, this.upwd_input.string);
        auth.uname_login();
    },

    // update (dt) {},
});
