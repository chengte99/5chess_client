// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var ulevel = require("ulevel");
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
        unick: {
            default: null,
            type: cc.Label,
        },

        uchip: {
            default: null,
            type: cc.Label,
        },

        usex: {
            default: null,
            type: cc.Sprite,
        },

        usex_sp: {
            default: [],
            type: cc.SpriteFrame,
        },

        ulevel: {
            default: null,
            type: cc.Label,
        },

        ulevel_progress: {
            default: null,
            type: cc.ProgressBar,
        },

        uvip: {
            default: null,
            type: cc.Label,
        },

        prop_node: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    close_dlg: function(){
        this.node.removeFromParent();
    },

    on_close_click: function(){
        this.close_dlg();
    },

    show_dlg: function(uinfo, is_self){
        this.is_self = is_self
        this.sv_seat = uinfo.sv_seat;

        this.unick.string = uinfo.unick;
        this.uchip.string = uinfo.uchip;
        this.usex.spriteFrame = this.usex_sp[uinfo.usex];
        var ret = ulevel.get_level(uinfo.uexp);
        this.ulevel.string = "LV " + ret[0];
        this.ulevel_progress.progress = ret[1];
        this.uvip.string = "VIP " + uinfo.uvip;
        if(is_self){
            this.prop_node.active = false;
        }else{
            this.prop_node.active = true;
        }

        
    },

    send_prop: function(e, prop_id){
        if(this.is_self){
            return;
        }
        prop_id = parseInt(prop_id);

        console.log("道具: ", prop_id);
        //發送道具協議
        five_chess.send_prop(prop_id, this.sv_seat);

        this.close_dlg();
    }

    // update (dt) {},
});
