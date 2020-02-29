var utils = require("utils");

var ugame = {
    unick: "",
    usex: -1,
    uface: 0,
    uvip: 0,

    is_guest: false,
    guest_key: null,

    uname: null,
    upwd: null,

    user_game_info: null,

    zid: 0,

    guest_login_success: function(unick, usex, uface, uvip, guest_key){
        this.unick = unick;
        this.usex = usex;
        this.uface = uface;
        this.uvip = uvip;

        this.is_guest = true;

        if(this.guest_key != guest_key){
            this.guest_key = guest_key;
            cc.sys.localStorage.setItem("guest_key", guest_key);
        }
    },

    uname_login_success: function(unick, usex, uface, uvip){
        this.unick = unick;
        this.usex = usex;
        this.uface = uface;
        this.uvip = uvip;
        this.is_guest = false;

        this._save_uname_upwd();
    },

    _save_uname_upwd: function(){
        var body = {
            uname: this.uname,
            upwd: this.upwd
        }

        var body_json = JSON.stringify(body);
        //加密, 暫時不做
        //end
        cc.sys.localStorage.setItem("uname_upwd", body_json);
    },

    update_for_edit_profile: function(unick, usex){
        this.unick = unick;
        this.usex = usex;
    },

    save_temp_uname_upwd: function(uname, upwd){
        this.uname = uname;
        this.upwd = upwd;
    },

    bind_uname_success: function(){
        this.is_guest = false;
        this._save_uname_upwd();
    },

    save_user_game_info: function(body){
        var ret = {};
        ret.uexp = body[1];
        ret.uchip = body[2];
        ret.uvip = body[3];

        ugame.user_game_info = ret;
    },

    save_zid: function(zid){
        this.zid = zid;
    }
}

//測試
// ugame.save_temp_uname_upwd("0929049751", "202cb962ac59075b964b07152d234b70");
// ugame.bind_uname_success();

// cc.sys.localStorage.removeItem("uname_upwd");
// cc.sys.localStorage.removeItem("guest_key");

var uname_upwd_json = cc.sys.localStorage.getItem("uname_upwd");
if(!uname_upwd_json){
    ugame.is_guest = true;
    ugame.guest_key = cc.sys.localStorage.getItem("guest_key");
    if(!ugame.guest_key){
        ugame.guest_key = utils.random_string(32);
        cc.sys.localStorage.setItem("guest_key", ugame.guest_key);
    }
}else{
    var body = JSON.parse(uname_upwd_json);
    ugame.is_guest = false
    ugame.uname = body.uname;
    ugame.upwd = body.upwd;
}

module.exports = ugame;
