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
var ulevel = require("ulevel");

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

        unick: {
            default: null,
            type: cc.Label
        },

        uchip: {
            default: null,
            type: cc.Label
        },

        usex: {
            default: null,
            type: cc.Sprite
        },

        usex_sp: {
            default: [],
            type: cc.SpriteFrame
        },

        ulevel: {
            default: null,
            type: cc.Label
        },

        ulevel_progress: {
            default: null,
            type: cc.ProgressBar
        },

        uvip: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        this.sync_info();
    },

    sync_info: function(){
        this.unick.string = ugame.unick;

        var game_info = ugame.user_game_info;
        this.uchip.string = game_info.uchip;
        
        this.usex.spriteFrame = this.usex_sp[ugame.usex];
        var ret = ulevel.get_level(game_info.uexp);
        this.ulevel.string = "LV " + ret[0];
        this.ulevel_progress.progress = ret[1];
        this.uvip.string = "VIP " + ugame.uvip;
    },

    on_enter_zone_click: function(e, zid){
        zid = parseInt(zid);

        if(zid <= 0 || zid > 3){
            return;
        }
        
        ugame.save_zid(zid);
        cc.director.loadScene("game_scene");
    },

    // update (dt) {},
});
