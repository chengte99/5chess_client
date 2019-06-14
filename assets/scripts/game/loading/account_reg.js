// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var auth = require("auth");
var md5 = require("md5");
var ugame = require("ugame");

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
        unick_input: {
            default: null,
            type: cc.EditBox
        },

        phone_input: {
            default: null,
            type: cc.EditBox
        },

        pwd_input: {
            default: null,
            type: cc.EditBox
        },

        confirm_pwd_input: {
            default: null,
            type: cc.EditBox
        },

        verify_code_input: {
            default: null,
            type: cc.EditBox
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.active = false;
    },

    start () {

    },

    on_close_click: function(){
        this.node.active = false;
    },

    on_get_verify_code_click: function(){
        if(!this.phone_input.string || this.phone_input.string.length < 10){
            console.log("phone length must >= 10");
            return;
        }

        auth.get_verify_code_via_phone_reg(this.phone_input.string);
    },

    on_reg_phone_acc_click: function(){
        if(!this.phone_input.string || this.phone_input.string.length < 10){
            console.log("phone length must >= 10");
            return;
        }

        if(!this.unick_input.string || this.unick_input.string.length <= 0){
            console.log("unick length must > 0");
            return;
        }

        if(!this.pwd_input.string || this.pwd_input.string.length <= 0){
            console.log("pwd length must > 0");
            return;
        }

        if(this.pwd_input.string !=  this.confirm_pwd_input.string){
            console.log("pwd must == confirm_pwd");
            return;
        }

        if(!this.verify_code_input.string || this.verify_code_input.string.length != 6){
            console.log("verify_code length must == 6");
            return;
        }

        ugame.save_temp_uname_upwd(this.phone_input.string, this.pwd_input.string);

        var pwd_md5 = md5(this.pwd_input.string);
        auth.reg_phone_acc(this.unick_input.string, this.phone_input.string, pwd_md5, this.verify_code_input.string);
    },

    // update (dt) {},
});
