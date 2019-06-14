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
var ws = require("websocket");
var Response = require("Response");
var ugame = require("ugame");
var Cmd = require("Cmd");
var Stype = require("Stype");
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.account_reg = this.node.getChildByName("account_reg");
        this.account_forget_pwd = this.node.getChildByName("account_forget_pwd");
        this.account_login = this.node.getChildByName("account_login");

        // ws.register_serivces_handler({
        //     2: this.on_auth_service.bind(this),
        // });

        var serivces_handler = {};
        serivces_handler[Stype.Auth] = this.on_auth_service.bind(this);
        serivces_handler[Stype.GameSystem] = this.on_game_system_service.bind(this);
        ws.register_serivces_handler(serivces_handler);
    },

    start () {

    },

    guest_login_finish: function(body){
        if(body.status != Response.OK){
            console.log(body.status);
            return;
        }

        ugame.guest_login_success(body.unick, body.usex, body.uface, body.uvip, body.guest_key);
        // cc.director.loadScene("home_scene");
        this.login_success();
    },

    uname_login_finish: function(body){
        if(body.status != Response.OK){
            console.log(body.status);
            return;
        }

        ugame.uname_login_success(body.unick, body.usex, body.uface, body.uvip);
        // cc.director.loadScene("home_scene");
        this.login_success();
    },

    login_success: function(){
        game_system.get_game_info();
        cc.director.loadScene("home_scene");
    },

    phone_reg_verify_code_return: function(status){
        if(status != Response.OK){
            console.log(status);
            return;
        }

        console.log("request verify code via phone reg success!!!");
    },

    reset_pwd_verify_code_return: function(status){
        if(status != Response.OK){
            console.log(status);
            return;
        }

        console.log("request verify code via reset pwd success!!!");
    },

    reg_phone_acc_return: function(status){
        if(status != Response.OK){
            console.log(status);
            return;
        }

        console.log("reg phone acc success!!!");
        ugame.bind_uname_success();
        auth.uname_login();
    },

    reset_pwd_acc_return: function(status){
        if(status != Response.OK){
            console.log(status);
            return;
        }

        console.log("reset pwd acc success!!!");
        ugame.bind_uname_success();
        auth.uname_login();
    },

    get_game_info_return: function(body){
        if(body[0] != Response.OK){
            console.log(body[0]);
            return;
        }

        console.log("get_game_info_return success!!!");
        ugame.save_user_game_info(body);
    },

    on_auth_service: function(stype, ctype, body){
        // console.log(stype, ctype, body);
        switch (ctype){
            case Cmd.Auth.GUEST_LOGIN:
                this.guest_login_finish(body);
                break;
            case Cmd.Auth.RELOGIN:
                console.log("Cmd.Auth.RELOGIN ....");
                break;
            case Cmd.Auth.UNAME_LOGIN:
                this.uname_login_finish(body);
                break;
            case Cmd.Auth.GET_VERIFY_VIA_REG:
                this.phone_reg_verify_code_return(body);
                break;
            case Cmd.Auth.REG_PHONE_ACC:
                this.reg_phone_acc_return(body);
                break;
            case Cmd.Auth.GET_VERIFY_VIA_FORGET_PWD:
                this.reset_pwd_verify_code_return(body);
                break;
            case Cmd.Auth.RESET_PWD_ACC:
                this.reset_pwd_acc_return(body);
                break;
        }
    },

    on_game_system_service: function(stype, ctype, body){
        switch (ctype){
            case Cmd.GameSystem.GET_GAME_INFO:
                this.get_game_info_return(body);
                break;
        }
    },

    on_quick_login_click: function(){
        if(ugame.is_guest){
            auth.guest_login();
        }else{
            auth.uname_login();
        }   
    },

    on_forget_pwd_click: function(){
        this.account_forget_pwd.active = true;
    },

    on_uname_login_click: function(){
        this.account_login.active = true;
    },

    on_phone_reg_click: function(){
        this.account_reg.active = true;
    },

    on_wechat_login_click: function(){
        
    },

    // update (dt) {},
});
