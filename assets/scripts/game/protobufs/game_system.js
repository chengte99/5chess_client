var utils = require("utils");
var ws = require("websocket");
var Stype = require("Stype");
var Cmd = require("Cmd");
var ugame = require("ugame");
var md5 = require("md5");
require("game_system_proto");

function get_game_info(){
    ws.send_cmd(Stype.GameSystem, Cmd.GameSystem.GET_GAME_INFO, null);
}

function get_login_bonus_info(){
    ws.send_cmd(Stype.GameSystem, Cmd.GameSystem.GET_LOGIN_BONUS_INFO, null);
}

function recv_login_bonus(bonus_id){
    ws.send_cmd(Stype.GameSystem, Cmd.GameSystem.RECV_LOGIN_BONUS, bonus_id);
}

function get_world_rank_info(){
    ws.send_cmd(Stype.GameSystem, Cmd.GameSystem.GET_WORLD_RANK_INFO, null);
}

module.exports = {
    get_game_info: get_game_info,
    get_login_bonus_info: get_login_bonus_info,
    recv_login_bonus: recv_login_bonus,
    get_world_rank_info: get_world_rank_info,
}
