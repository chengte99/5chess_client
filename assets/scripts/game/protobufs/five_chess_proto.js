var Stype = require("Stype");
var Cmd = require("Cmd")
var Response = require("Response");
var proto_man = require("proto_man");
var proto_tool = require("proto_tool");

/*
進入房間區間
客戶端發送：
4, 1, body = zid (int16)
服務端返回: 
4, 1, body = status
*/

proto_man.reg_buf_encoder(Stype.Game5Chess, Cmd.Game5Chess.ENTER_ZONE, proto_tool.encode_status_cmd);
proto_man.reg_buf_decoder(Stype.Game5Chess, Cmd.Game5Chess.ENTER_ZONE, proto_tool.decode_status_cmd);

/*
用戶主動離開
客戶端發送：
4, 2, null
服務端返回:
4, 2, body = status
*/

proto_man.reg_buf_encoder(Stype.Game5Chess, Cmd.Game5Chess.USER_QUIT, proto_tool.encode_empty_cmd);
proto_man.reg_buf_decoder(Stype.Game5Chess, Cmd.Game5Chess.USER_QUIT, proto_tool.decode_status_cmd);

/*
用戶進入房間
客戶端發送：
4, 3, body = 桌子ID (32)
服務端返回:
4, 3, body = {
    0: status (16)
    1: zid (16)
    2: room_id (32)
}
*/

function decode_enter_room(dataview){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(dataview, 0);
    cmd[1] = proto_tool.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;
    
    var offset = proto_tool.header_size;
    body[0] = proto_tool.read_int16(dataview, offset);
    if(body[0] != Response.OK){
        return cmd;
    }
    offset += 2;
    body[1] = proto_tool.read_int16(dataview, offset);
    offset += 2;
    body[2] = proto_tool.read_int32(dataview, offset);
    offset += 4;

    return cmd;
}

proto_man.reg_buf_encoder(Stype.Game5Chess, Cmd.Game5Chess.ENTER_ROOM, proto_tool.encode_int32_cmd);
proto_man.reg_buf_decoder(Stype.Game5Chess, Cmd.Game5Chess.ENTER_ROOM, decode_enter_room);

/*
用戶離開房間
客戶端發送：
4, 4, null
服務端返回:
4, 4, body = status
*/

proto_man.reg_buf_encoder(Stype.Game5Chess, Cmd.Game5Chess.EXIT_ROOM, proto_tool.encode_empty_cmd);
proto_man.reg_buf_decoder(Stype.Game5Chess, Cmd.Game5Chess.EXIT_ROOM, proto_tool.decode_status_cmd);

/*
用戶坐下座位
客戶端發送：
4, 5, body = seat_id (16)
服務端返回:
4, 5, body = {
    0: status (16)
    1: seat_id (16)
}
*/

function decode_user_sitdown(dataview){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(dataview, 0);
    cmd[1] = proto_tool.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;

    var offset = proto_tool.header_size;
    body[0] = proto_tool.read_int16(dataview, offset);
    if(body[0] != Response.OK){
        return cmd;
    }
    offset += 2;
    body[1] = proto_tool.read_int16(dataview, offset);
    offset += 2;

    return cmd;
}

proto_man.reg_buf_encoder(Stype.Game5Chess, Cmd.Game5Chess.USER_SITDOWN, proto_tool.encode_status_cmd);
proto_man.reg_buf_decoder(Stype.Game5Chess, Cmd.Game5Chess.USER_SITDOWN, decode_user_sitdown);

/*
用戶抵達
服務器發送：
4, 7, body = {
    0: sv_seat, (16)

    1: player.unick, 
    2: player.usex, (16)
    3: player.uface, (16)

    4: player.uchip, (32)
    5: player.uexp, (32)
    6: player.uvip (16)
}
*/

function decode_user_arrived(dataview){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(dataview, 0);
    cmd[1] = proto_tool.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;

    var offset = proto_tool.header_size;
    body[0] = proto_tool.read_int16(dataview, offset);
    offset += 2;

    var ret = proto_tool.read_str_inbuf(dataview, offset);
    body[1] = ret[0];
    offset = ret[1];

    body[2] = proto_tool.read_int16(dataview, offset);
    offset += 2;
    body[3] = proto_tool.read_int16(dataview, offset);
    offset += 2;

    body[4] = proto_tool.read_int32(dataview, offset);
    offset += 4;
    body[5] = proto_tool.read_int32(dataview, offset);
    offset += 4;
    body[6] = proto_tool.read_int16(dataview, offset);
    offset += 2;

    return cmd;
}

proto_man.reg_buf_decoder(Stype.Game5Chess, Cmd.Game5Chess.USER_ARRIVED, decode_user_arrived);

/*
用戶站起座位
客戶端發送：
4, 6, null
服務端返回:
4, 6, body = {
    0: status (16)
    1: sv_seat (16)
}
*/

function decode_user_standup(dataview){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(dataview, 0);
    cmd[1] = proto_tool.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;

    var offset = proto_tool.header_size;
    body[0] = proto_tool.read_int16(dataview, offset);
    if(body[0] != Response.OK){
        return cmd;
    }
    offset += 2;
    body[1] = proto_tool.read_int16(dataview, offset);
    offset += 2;

    return cmd;
}

proto_man.reg_buf_encoder(Stype.Game5Chess, Cmd.Game5Chess.USER_STANDUP, proto_tool.encode_empty_cmd);
proto_man.reg_buf_decoder(Stype.Game5Chess, Cmd.Game5Chess.USER_STANDUP, decode_user_standup);

/*
用戶發送道具
客戶端發送：
4, 8, body = {
    0: prop_id, (16)
    1: to_seat_id (16)
}
服務器返回：
4, 8, body = {
    0: status, 
    1: from_seat_id,
    2: to_seat_id,
    3: prop_id
}
*/

function encode_send_prop(stype, ctype, body){
    var total_len = proto_tool.header_size + 2 + 2;
    var dataview = proto_tool.alloc_buffer(total_len);
    var offset = proto_tool.write_head_inbuf(dataview, stype, ctype);
    proto_tool.write_int16(dataview, body[0], offset);
    offset += 2;
    proto_tool.write_int16(dataview, body[1], offset);
    offset += 2;

    return dataview;
}

function decode_send_prop(dataview){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(dataview, 0);
    cmd[1] = proto_tool.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;

    var offset = proto_tool.header_size;
    body[0] = proto_tool.read_int16(dataview, offset);
    if(body[0] != Response.OK){
        return cmd;
    }
    offset += 2;

    body[1] = proto_tool.read_int16(dataview, offset);
    offset += 2;
    body[2] = proto_tool.read_int16(dataview, offset);
    offset += 2;
    body[3] = proto_tool.read_int16(dataview, offset);
    offset += 2;

    return cmd;
}

proto_man.reg_buf_encoder(Stype.Game5Chess, Cmd.Game5Chess.SEND_PROP, encode_send_prop);
proto_man.reg_buf_decoder(Stype.Game5Chess, Cmd.Game5Chess.SEND_PROP, decode_send_prop);

/*
用戶按下準備
客戶端發送：
4, 9, null
服務器返回：
4, 9, body = {
    0: status, 
    1: seat_id,
}
*/

function decode_do_ready(dataview){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(dataview, 0);
    cmd[1] = proto_tool.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;
    var offset = proto_tool.header_size;
    body[0] = proto_tool.read_int16(dataview, offset);
    if(body[0] != Response.OK){
        return cmd;
    }
    offset += 2;
    body[1] = proto_tool.read_int16(dataview, offset);
    offset += 2;

    return cmd;
}

proto_man.reg_buf_encoder(Stype.Game5Chess, Cmd.Game5Chess.DO_READY, proto_tool.encode_empty_cmd);
proto_man.reg_buf_decoder(Stype.Game5Chess, Cmd.Game5Chess.DO_READY, decode_do_ready);

/*
遊戲開始
服務器主動發送
4, 10, body = {
    0: think_time, //玩家思考時間
    1: wait_time, //幾秒後遊戲開始，播動畫時間
    2: black_seat_id, //執黑棋座位
}
*/

function decode_round_game_start(dataview){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(dataview, 0);
    cmd[1] = proto_tool.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;

    var offset = proto_tool.header_size;
    body[0] = proto_tool.read_int16(dataview, offset);
    offset += 2;
    body[1] = proto_tool.read_int16(dataview, offset);
    offset += 2;
    body[2] = proto_tool.read_int16(dataview, offset);
    offset += 2;

    return cmd;
}

proto_man.reg_buf_decoder(Stype.Game5Chess, Cmd.Game5Chess.ROUND_GAME_START, decode_round_game_start);

/*
輪到玩家
服務器主動發送
4, 11, body = {
    0: think_time, //玩家思考時間 (16)
    1: seat_id, //輪到哪位玩家 (16)
    2: [operation], //可執行操作，這邊暫時不做忽略
}
*/

/*
玩家下棋
客戶端發送
4, 12, body = {
    0: block_x, //x座標
    1: block_y, //y座標
}
服務器返回
4, 12, body = {
    0: status
    1: block_x, //x座標
    2: block_y, //y座標
    3: chess_type, //棋子顏色
}
*/

/*
結算遊戲
服務器主動發送
4, 13, body = {
    0: winner_seatid, //贏家座位號碼， -1 等於 平局
    1: winner_score, //輸贏分數
}
*/

/*
結算遊戲完成
服務器主動發送
4, 14, null
*/

