var utils = require("utils");
var ws = require("websocket");
var Stype = require("Stype");
var Cmd = require("Cmd");
var ugame = require("ugame");
var md5 = require("md5");
require("five_chess_proto");

function enter_zone(zid){
    ws.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.ENTER_ZONE, zid);
}

function user_quit(){
    ws.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.USER_QUIT, null);
}

function send_prop(prop_id, to_seat_id){
    var body = {
        0: prop_id,
        1: to_seat_id
    }
    ws.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.SEND_PROP, body);
}

function do_ready(){
    ws.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.DO_READY, null);
}

function put_chess(block_x, block_y){
    var body = {
        0: block_x,
        1: block_y,
    }

    ws.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.PUT_CHESS, body);
}

function get_prev_round(){
    ws.send_cmd(Stype.Game5Chess, Cmd.Game5Chess.GET_PREV_ROUND_DATA, null);
}

module.exports = {
    enter_zone: enter_zone,
    user_quit: user_quit,
    send_prop: send_prop,
    do_ready: do_ready,
    put_chess: put_chess,
    get_prev_round: get_prev_round,
}
