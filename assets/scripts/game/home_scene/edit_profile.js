// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var checkbox = require("checkbox");
var ugame = require("ugame");
var ws = require("websocket");
var Stype = require("Stype");
var Cmd = require("Cmd");
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
        unick_input: {
            default: null,
            type: cc.EditBox
        },

        man_checkbox: {
            default: null,
            type: checkbox
        },

        woman_checkbox: {
            default: null,
            type: checkbox
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        this.unick_input.string = ugame.unick;
        this.set_usex_checkbox(ugame.usex);
    },

    set_usex_checkbox: function(type){
        this.usex = type;
        if(type){
            this.man_checkbox.set_checkbox(true);
            this.woman_checkbox.set_checkbox(false);
        }else{
            this.man_checkbox.set_checkbox(false);
            this.woman_checkbox.set_checkbox(true);
        }
    },

    on_click_checkbox: function(e, type){
        type = parseInt(type);
        this.set_usex_checkbox(type);
    },

    on_click_submit: function(){
        if(this.unick_input.string == ""){
            console.log("unick_input empty...");
            return;
        }

        auth.edit_profile(this.unick_input.string, this.usex);
    }

    // update (dt) {},
});
