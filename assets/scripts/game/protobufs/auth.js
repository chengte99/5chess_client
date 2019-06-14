var utils = require("utils");
var ws = require("websocket");
var Stype = require("Stype");
var Cmd = require("Cmd");
var ugame = require("ugame");
var md5 = require("md5");
require("auth_proto");

function guest_login(){
    var key = ugame.guest_key;

    ws.send_cmd(Stype.Auth, Cmd.Auth.GUEST_LOGIN, key);
}

function uname_login(){
    var pwd_md5 = md5(ugame.upwd);

    var body = {
        0: ugame.uname,
        1: pwd_md5,
    }
    ws.send_cmd(Stype.Auth, Cmd.Auth.UNAME_LOGIN, body);
}

function edit_profile(unick, usex){
    var body = {};
    body.unick = unick;
    body.usex = usex;

    ws.send_cmd(Stype.Auth, Cmd.Auth.EDIT_PROFILE, body);
}

function get_verify_code_via_guest_upgrade(phone, ukey){
    var body = {
        0: 0,
        1: phone,
        2: ukey,
    }
    ws.send_cmd(Stype.Auth, Cmd.Auth.GET_VERIFY_VIA_UPGRADE, body);
}

function guest_upgrade(phone, pwd, code){
    var body = {
        0: phone,
        1: pwd,
        2: code,
    }
    ws.send_cmd(Stype.Auth, Cmd.Auth.BIND_PHONE_NUM, body);
}

function get_verify_code_via_phone_reg(phone){
    var body = {
        0: 1,
        1: phone,
    }
    ws.send_cmd(Stype.Auth, Cmd.Auth.GET_VERIFY_VIA_REG, body);
}

function get_verify_code_via_reset_pwd(phone){
    var body = {
        0: 2,
        1: phone,
    }
    ws.send_cmd(Stype.Auth, Cmd.Auth.GET_VERIFY_VIA_FORGET_PWD, body);
}

function reg_phone_acc(unick, phone, pwd, code){
    var body = {
        0: phone,
        1: pwd,
        2: code,
        3: unick
    }

    ws.send_cmd(Stype.Auth, Cmd.Auth.REG_PHONE_ACC, body);
}

function reset_pwd_acc(phone, pwd, code){
    var body = {
        0: phone,
        1: pwd,
        2: code,
    }

    ws.send_cmd(Stype.Auth, Cmd.Auth.RESET_PWD_ACC, body);
}

module.exports = {
    guest_login: guest_login,
    uname_login: uname_login,
    edit_profile: edit_profile,
    get_verify_code_via_guest_upgrade: get_verify_code_via_guest_upgrade,
    guest_upgrade: guest_upgrade,
    get_verify_code_via_phone_reg: get_verify_code_via_phone_reg,
    reg_phone_acc: reg_phone_acc,
    get_verify_code_via_reset_pwd: get_verify_code_via_reset_pwd,
    reset_pwd_acc: reset_pwd_acc,
}