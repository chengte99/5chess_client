// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var ws = require("websocket");
var Stype = require("Stype");
var Cmd = require("Cmd");
var Response = require("Response");
var home_ctl = require("home_ctl");
var system_ctl = require("system_ctl");
var friend_ctl = require("friend_ctl");
var mine_ctl = require("mine_ctl");
var ugame = require("ugame");
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

        tab_bottons:{
            default: [],
            type: cc.Button
        },

        tab_contents:{
            default: [],
            type: cc.Node
        },

        home: {
            default: null,
            type: home_ctl
        },

        system: {
            default: null,
            type: system_ctl
        },

        friend: {
            default: null,
            type: friend_ctl
        },

        mine: {
            default: null,
            type: mine_ctl
        },

        login_bonus_prefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.tab_button_com_set = [];
        for(var i = 0; i < this.tab_bottons.length; i ++){
            var com = this.tab_bottons[i].getComponent("tab_button");
            this.tab_button_com_set.push(com);
        }

        var service_handler = {};
        service_handler[Stype.Auth] = this.on_auth_service.bind(this);
        service_handler[Stype.GameSystem] = this.on_game_system_service.bind(this);
        ws.register_serivces_handler(service_handler);

    },

    start () {
        this.on_click_tab_button(null, 0);

        //取得獎勵info
        game_system.get_login_bonus_info();
    },

    edit_profile_success: function(body){
        console.log("edit success ....");
        ugame.update_for_edit_profile(body.unick, body.usex);

        this.mine.on_click_backbtn();

        this.home.sync_info();
        this.system.sync_info();
        this.friend.sync_info();
        this.mine.sync_info();
    },

    edit_profile_server_return: function(body){
        if(body.status != Response.OK){
            console.log("edit fail ....");
            return;
        }

        this.edit_profile_success(body);
    },

    get_identify_code_return: function(body){
        if(body != Response.OK){
            console.log("get identify code fail ....");
            return;
        }

        console.log("get identify code success ....");
    },

    do_upgrade_acc_success: function(){
        console.log("do_upgrade_acc success ....");
        ugame.bind_uname_success();
        this.mine.on_click_backbtn();
    },

    do_upgrade_acc: function(body){
        if(body != Response.OK){
            console.log("do_upgrade_acc fail ....");
            return;
        }

        this.do_upgrade_acc_success();
    },

    get_login_bonus_info_return: function(body){
        if(body[0] != Response.OK){
            console.log("get_login_bonus_info_return fail ....");
            return;
        }

        if(body[1] != 1){
            console.log("no bonus today ....");
            return
        }

        var id = body[2];
        var bonus = body[3];
        var days = body[4];

        var login_bonus = cc.instantiate(this.login_bonus_prefab);
        this.node.addChild(login_bonus);
        var login_bonus_com = login_bonus.getComponent("login_bonus");
        login_bonus_com.show_get_bonus_info(id, bonus, days);
    },

    recv_login_bonus_return: function(body){
        if(body[0] != Response.OK){
            console.log("recv_login_bonus_return fail ....");
            return;
        }

        console.log("you got bonus: ", body[1]);
        ugame.user_game_info.uchip += body[1];

        this.home.sync_info();
    },

    get_world_rank_info_return: function(body){
        if(body[0] != Response.OK){
            console.log("get_world_rank_info_return fail ....");
            return;
        }

        console.log(body);
        this.system.on_get_world_rank_data(body[3], body[2]);
    },

    on_auth_service: function(stype, ctype, body){
        console.log(stype, ctype, body);
        switch (ctype){
            // case Cmd.Auth.GUEST_LOGIN:
            //     this.guest_login_finish(body);
            // break;
            case Cmd.Auth.RELOGIN:
                console.log("Cmd.Auth.RELOGIN ....");
                break;
            case Cmd.Auth.EDIT_PROFILE:
                this.edit_profile_server_return(body);
                break;
            case Cmd.Auth.GET_VERIFY_VIA_UPGRADE:
                this.get_identify_code_return(body);
                break;
            case Cmd.Auth.BIND_PHONE_NUM:
                this.do_upgrade_acc(body);
                break;
        }
    },

    on_game_system_service: function(stype, ctype, body){
        console.log(stype, ctype, body);
        switch (ctype){
            case Cmd.GameSystem.GET_LOGIN_BONUS_INFO:
                this.get_login_bonus_info_return(body);
                break;
            case Cmd.GameSystem.RECV_LOGIN_BONUS:
                this.recv_login_bonus_return(body);
                break;
            case Cmd.GameSystem.GET_WORLD_RANK_INFO:
                this.get_world_rank_info_return(body);
                break;
        }
    },

    disable_tab: function(index){
        this.tab_button_com_set[index].set_active(false);
        this.tab_bottons[index].interactable = true;
        this.tab_contents[index].active = false;
    },

    enable_tab: function(index){
        this.tab_button_com_set[index].set_active(true);
        this.tab_bottons[index].interactable = false;
        this.tab_contents[index].active = true;
    },

    on_click_tab_button: function(e, index){
        index = parseInt(index);
        for(var i = 0; i < this.tab_button_com_set.length; i ++){
            if (i == index){
                this.enable_tab(i);
            }else{
                this.disable_tab(i);
            }
        }
    }

    // update (dt) {},
});
