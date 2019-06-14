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
var utils = require("utils");

var TalkCmd = {
    Enter: 1, //用戶進來
    Exit: 2, //用戶離開
    UserArrived: 3, //別人進來
    UserExit: 4, //別人離開

    SendMsg: 5, //自己發送消息
    UserMsg: 6 //收到別人消息
}

var Response = {
    OK: 200,
    Fail: 201,
    In_Room: -100,
    Not_In_Room: -101,
    INVAILD: -102,
    INVAILD_PARAMS: -103
}

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

        input: {
            default: null,
            type: cc.EditBox
        },

        scorllview_content: {
            default: null,
            type: cc.ScrollView
        },

        tips_prefab: {
            default: null,
            type: cc.Prefab
        },

        selftalk_prefab: {
            default: null,
            type: cc.Prefab
        },

        othertalk_prefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ws.register_serivces_handler({
            1: this.on_talk_room_service.bind(this),
        });

        this.random_name = "遊客" + utils.random_int_str(4);
        this.random_sex = utils.random_int(0,1)
    },

    show_tips: function(str){
        var node = cc.instantiate(this.tips_prefab);
        var label = node.getChildByName("msg").getComponent(cc.Label);
        label.string = str;

        this.scorllview_content.content.addChild(node);
        this.scorllview_content.scrollToBottom(0.1);
    },

    show_selftalk: function(uname, msg){
        var node = cc.instantiate(this.selftalk_prefab);
        var label = node.getChildByName("msg").getComponent(cc.Label);
        label.string = msg;

        label = node.getChildByName("uname").getComponent(cc.Label);
        label.string = uname;

        this.scorllview_content.content.addChild(node);
        this.scorllview_content.scrollToBottom(0.1);
    },

    show_othertalk: function(uname, msg){
        var node = cc.instantiate(this.othertalk_prefab);
        var label = node.getChildByName("msg").getComponent(cc.Label);
        label.string = msg;

        label = node.getChildByName("uname").getComponent(cc.Label);
        label.string = uname;

        this.scorllview_content.content.addChild(node);
        this.scorllview_content.scrollToBottom(0.1);
    },

    on_talk_room_service: function(stype, ctype, body){
        switch(ctype){
            case TalkCmd.Enter:
                // console.log("Enter", body);
                if(body == Response.OK){
                    this.show_tips("你已成功進入聊天室");
                }
            break;
            case TalkCmd.Exit:
                // console.log("Exit", body);
                if(body == Response.OK){
                    this.show_tips("你已成功離開聊天室");
                }
            break;
            case TalkCmd.UserArrived:
                // console.log("UserArrived", body);
                this.show_tips(body.uname + "已進入聊天室");
            break;
            case TalkCmd.UserExit:
                // console.log("UserExit", body);
                this.show_tips(body.uname + "已離開聊天室");
            break;
            case TalkCmd.SendMsg:
                // console.log("SendMsg", body);
                if(body[0] == Response.OK){
                    this.show_selftalk(body[1], body[3]);
                }
            break;
            case TalkCmd.UserMsg:
                this.show_othertalk(body[0], body[2]);
            break;
        }
    },

    start () {
        
    },

    on_click_room_enter: function(){
        console.log("Enter room");
        ws.send_cmd(1, TalkCmd.Enter, {
            uname: this.random_name,
            usex: this.random_sex
        });
    },

    on_click_room_quit: function(){
        console.log("Exit room");
        ws.send_cmd(1, TalkCmd.Exit, null);
    },

    on_click_send_message: function(){
        console.log("Send message");
        var str = this.input.string;
        if(!str || str.length < 0){
            return;
        }

        ws.send_cmd(1, TalkCmd.SendMsg, str);
        this.input.string = "";
    }

    // update (dt) {},
});
