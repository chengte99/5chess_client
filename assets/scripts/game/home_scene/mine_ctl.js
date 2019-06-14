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
        title: {
            default: null,
            type: cc.Label
        },

        unick: {
            default: null,
            type: cc.Label
        },

        back_btn: {
            default: null,
            type: cc.Node
        },

        edit_profile_prefab: {
            default: null,
            type: cc.Prefab
        },

        guest_upgrade_prefab: {
            default: null,
            type: cc.Prefab
        },

        bind_btn: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        this.sync_info();
        this.back_btn.active = false;
        
        if(ugame.is_guest){
            this.bind_btn.active = true;
        }else{
            this.bind_btn.active = false;
        }
    },

    sync_info: function(){
        this.unick.string = ugame.unick;
    },

    on_click_backbtn: function(){
        this.back_btn.active = false;
        if(this.second_ui != null){
            this.second_ui.removeFromParent();
            this.second_ui = null;
        }
        this.title.string = "我";

        if(ugame.is_guest){
            this.bind_btn.active = true;
        }else{
            this.bind_btn.active = false;
        }
    },

    on_click_edit_profile: function(){
        this.back_btn.active = true;
        this.second_ui = cc.instantiate(this.edit_profile_prefab);
        this.node.addChild(this.second_ui);
        this.title.string = "个人信息";
    },

    on_click_guest_upgrade: function(){
        this.back_btn.active = true;
        this.second_ui = cc.instantiate(this.guest_upgrade_prefab);
        this.node.addChild(this.second_ui);
        this.title.string = "帳號升級";
    },

    // update (dt) {},
});
