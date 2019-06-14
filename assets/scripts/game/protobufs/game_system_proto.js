var Stype = require("Stype");
var Cmd = require("Cmd")
var Response = require("Response");
var proto_man = require("proto_man");
var proto_tool = require("proto_tool");

/*
取得用戶遊戲數據
客戶端發送：
3, 1, null
服務端返回: 
3, 1, body = {
    0: status
    1: uexp (int32)
    2: uchip (int32)
    3: uvip
}
*/

function decode_get_ugame_info(dataview){
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

    body[1] = proto_tool.read_int32(dataview, offset);
    offset += 4;

    body[2] = proto_tool.read_int32(dataview, offset);
    offset += 4;

    body[3] = proto_tool.read_int16(dataview, offset);
    offset += 2;

    return cmd;
}

proto_man.reg_buf_encoder(Stype.GameSystem, Cmd.GameSystem.GET_GAME_INFO, proto_tool.encode_empty_cmd);
proto_man.reg_buf_decoder(Stype.GameSystem, Cmd.GameSystem.GET_GAME_INFO, decode_get_ugame_info);

/*
獲取登入獎勵
客戶端發送：
3, 2, null
服務端返回: 
3, 2, body = {
    0: status
    1: bonus_status, 0: 沒有獎勵，1: 有獎勵
    2: id (int32)
    3: bonus (int32)
    4: days
}
*/

function decode_get_login_bonus_info(dataview){
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

    body[3] = proto_tool.read_int32(dataview, offset);
    offset += 4;

    body[4] = proto_tool.read_int16(dataview, offset);
    offset += 2;

    return cmd;
}

proto_man.reg_buf_encoder(Stype.GameSystem, Cmd.GameSystem.GET_LOGIN_BONUS_INFO, proto_tool.encode_empty_cmd);
proto_man.reg_buf_decoder(Stype.GameSystem, Cmd.GameSystem.GET_LOGIN_BONUS_INFO, decode_get_login_bonus_info);

/*
領取登入獎勵
客戶端發送：
3, 3, body = bonus_id (int32)
服務端返回: 
3, 3, body = {
    0: status
    1: bonus (int32)
}
*/

function decode_recv_login_bonus(dataview){
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

    body[1] = proto_tool.read_int32(dataview, offset);
    offset += 4;

    return cmd;
}

proto_man.reg_buf_encoder(Stype.GameSystem, Cmd.GameSystem.RECV_LOGIN_BONUS, proto_tool.encode_int32_cmd);
proto_man.reg_buf_decoder(Stype.GameSystem, Cmd.GameSystem.RECV_LOGIN_BONUS, decode_recv_login_bonus);

/*
獲取全局排行榜(以金幣排名)
客戶端發送：
3, 4, null
服務端返回: 
3, 4, body = {
    0: status
    1: array.length (int16)
    2: 
    [
        [unick, usex, uface, uchip(int32)],
        [unick, usex, uface, uchip],
        [],
        ...
    ]
    3: my_rank (int16)
}
*/

function decode_get_world_rank_info(dataview){
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

    body[2] = [];

    for(var i = 0; i < body[1]; i ++){
        var uinfo = [];
        var ret = proto_tool.read_str_inbuf(dataview, offset);
        uinfo.push(ret[0]);
        offset = ret[1];

        var usex = proto_tool.read_int16(dataview, offset);
        offset += 2;
        var uface = proto_tool.read_int16(dataview, offset);
        offset += 2;
        var uchip = proto_tool.read_int32(dataview, offset);
        offset += 4;
        
        uinfo.push(usex);
        uinfo.push(uface);
        uinfo.push(uchip);
        body[2].push(uinfo);
    }

    body[3] = proto_tool.read_int16(dataview, offset);
    offset += 2;

    return cmd;
}

proto_man.reg_buf_encoder(Stype.GameSystem, Cmd.GameSystem.GET_WORLD_RANK_INFO, proto_tool.encode_empty_cmd);
proto_man.reg_buf_decoder(Stype.GameSystem, Cmd.GameSystem.GET_WORLD_RANK_INFO, decode_get_world_rank_info);