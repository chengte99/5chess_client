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
var ws = require("websocket");
var Stype = require("Stype");
var Cmd = require("Cmd");
var md5 = require("md5");
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

        identify_code_input: {
            default: null,
            type: cc.EditBox
        },

        error_tips_label: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.error_tips_label.node.active = false;
    },

    show_tips: function(msg){
        this.unscheduleAllCallbacks();

        this.error_tips_label.node.active = true;
        this.error_tips_label.string = msg;

        this.scheduleOnce(function(){
            this.error_tips_label.node.active = false;
        }.bind(this), 3);
    },

    on_click_request_identify_code: function(){
        var phone_num = this.phone_input.string;
        if(!phone_num || phone_num.length != 10){
            this.show_tips("手機號碼錯誤 ...")
            return;
        }
        
        auth.get_verify_code_via_guest_upgrade(phone_num, ugame.guest_key);
    },

    on_click_sumbit: function(){
        var phone_num = this.phone_input.string;
        if(!phone_num || phone_num.length != 10){
            this.show_tips("手機號碼錯誤 ...")
            return;
        }

        var pwd = this.pwd_input.string;
        if(pwd != this.confirm_pwd_input.string){
            this.show_tips("兩次輸入密碼不同 ...")
            return;
        }
        pwd = md5(pwd);

        var code = this.identify_code_input.string;
        if(!code || code.length != 6){
            this.show_tips("驗證碼錯誤 ...")
            return;
        }

        var ukey = ugame.guest_key;

        console.log("submit to server");
        auth.guest_upgrade(phone_num, pwd, code);

        ugame.save_temp_uname_upwd(phone_num, pwd);
    },

    // update (dt) {},
});
