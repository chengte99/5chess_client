var Stype = require("Stype");
var Cmd = require("Cmd")
var Response = require("Response");
var proto_man = require("proto_man");
var proto_tool = require("proto_tool");


/*
遊客註冊
客戶端發送：
2, 1, ukey
服務端返回: 
2, 1, body = {
    status: 
    uid
    unick:
    usex:
    uface:
    uvip:
    guest_key:
}
*/
function decode_guest_login(dataview){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(dataview, 0);
    cmd[1] = proto_tool.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;

    var offset = proto_tool.header_size;
    body.status = proto_tool.read_int16(dataview, offset);
    if(body.status != Response.OK){
        return cmd;
    }
    offset += 2;
    body.uid = proto_tool.read_uint32(dataview, offset);
    offset += 4;

    var ret = proto_tool.read_str_inbuf(dataview, offset);
    body.unick = ret[0];
    offset = ret[1];

    body.usex = proto_tool.read_int16(dataview, offset);
    offset += 2;
    body.uface = proto_tool.read_int16(dataview, offset);
    offset += 2;
    body.uvip = proto_tool.read_int16(dataview, offset);
    offset += 2;

    ret = proto_tool.read_str_inbuf(dataview, offset);
    body.guest_key = ret[0];
    offset = ret[1];

    return cmd;
}

proto_man.reg_buf_encoder(Stype.Auth, Cmd.Auth.GUEST_LOGIN, proto_tool.encode_str_cmd);
proto_man.reg_buf_decoder(Stype.Auth, Cmd.Auth.GUEST_LOGIN, decode_guest_login);

/*
重複登入
服務端主動發送：
2, 2, null
*/

proto_man.reg_buf_decoder(Stype.Auth, Cmd.Auth.RELOGIN, proto_tool.decode_empty_cmd);

/*
修改資料
客戶端發送：
2, 3, body ={
    unick:
    usex:
}
服務端返回：
2, 3, body = {
    status
    unick
    usex
}
*/

function encode_edit_profile(stype, ctype, body){
    var unick_len = body.unick.utf8_byte_len();
    var total_len = proto_tool.header_size + (2 + unick_len) + 2;
    var dataview = proto_tool.alloc_buffer(total_len);
    var offset = proto_tool.write_head_inbuf(dataview, stype, ctype);
    offset = proto_tool.write_str_inbuf(dataview, offset, unick_len, body.unick);
    proto_tool.write_int16(dataview, body.usex, offset);
    offset += 2;

    return dataview;
}

function decode_edit_profile(dataview){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(dataview, 0);
    cmd[1] = proto_tool.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;

    var offset = proto_tool.header_size;
    body.status = proto_tool.read_int16(dataview, offset);
    if(body.status != Response.OK){
        return cmd;
    };
    offset += 2;

    var ret = proto_tool.read_str_inbuf(dataview, offset);
    body.unick = ret[0];
    offset = ret[1];

    body.usex = proto_tool.read_int16(dataview, offset);

    return cmd;
}

proto_man.reg_buf_encoder(Stype.Auth, Cmd.Auth.EDIT_PROFILE, encode_edit_profile);
proto_man.reg_buf_decoder(Stype.Auth, Cmd.Auth.EDIT_PROFILE, decode_edit_profile);

/*
遊客升級獲取驗證碼
客戶端發送：
2, 4, body = {
    0: 0, // 0-遊客升級，1-手機註冊，2-修改密碼
    1: phone
    2: ukey
}
服務端返回：
2, 4, body = status
*/

function encode_get_verify_via_upgrade(stype, ctype, body){
    var phone_len = body[1].utf8_byte_len();
    var key_len = body[2].utf8_byte_len();
    var total_len = proto_tool.header_size + 2 + (2 + phone_len) + (2 + key_len);
    var dataview = proto_tool.alloc_buffer(total_len);
    var offset = proto_tool.write_head_inbuf(dataview, stype, ctype);
    proto_tool.write_int16(dataview, body[0], offset);
    offset += 2;

    offset = proto_tool.write_str_inbuf(dataview, offset, phone_len, body[1]);
    offset = proto_tool.write_str_inbuf(dataview, offset, key_len, body[2]);

    return dataview;
}

proto_man.reg_buf_encoder(Stype.Auth, Cmd.Auth.GET_VERIFY_VIA_UPGRADE, encode_get_verify_via_upgrade);
proto_man.reg_buf_decoder(Stype.Auth, Cmd.Auth.GET_VERIFY_VIA_UPGRADE, proto_tool.decode_status_cmd);

/*
帳號升級綁定手機
客戶端發送：
2, 5, body = {
    0: phone,
    1: pwd,
    2: code
}
服務端返回：
2, 5, body = status
*/

function encode_bind_phone_num(stype, ctype, body){
    var phone_len = body[0].utf8_byte_len();
    var pwd_len = body[1].utf8_byte_len();
    var code_len = body[2].utf8_byte_len();

    var total_len = proto_tool.header_size + (2 + phone_len) + (2 + pwd_len) + (2 + code_len);
    var dataview = proto_tool.alloc_buffer(total_len);
    var offset = proto_tool.write_head_inbuf(dataview, stype, ctype);
    
    offset = proto_tool.write_str_inbuf(dataview, offset, phone_len, body[0]);
    offset = proto_tool.write_str_inbuf(dataview, offset, pwd_len, body[1]);
    offset = proto_tool.write_str_inbuf(dataview, offset, code_len, body[2]);

    return dataview;
}

proto_man.reg_buf_encoder(Stype.Auth, Cmd.Auth.BIND_PHONE_NUM, encode_bind_phone_num);
proto_man.reg_buf_decoder(Stype.Auth, Cmd.Auth.BIND_PHONE_NUM, proto_tool.decode_status_cmd);

/*
帳號登入
客戶端發送：
2, 6, body = {
    0: uname,
    1: upwd
}
服務端返回：
2, 6, body = {
    status: 
    uid:
    unick:
    usex:
    uface:
    uvip:
}
*/

function encode_uname_login(stype, ctype, body){
    var uname_len = body[0].utf8_byte_len();
    var upwd_len = body[1].utf8_byte_len();
    var total_len = proto_tool.header_size + (2 + uname_len) + (2 + upwd_len);
    var dataview = proto_tool.alloc_buffer(total_len);
    var offset = proto_tool.write_head_inbuf(dataview, stype, ctype);
    offset = proto_tool.write_str_inbuf(dataview, offset, uname_len, body[0]);
    offset = proto_tool.write_str_inbuf(dataview, offset, upwd_len, body[1]);

    return dataview;
}

function decode_uname_login(dataview){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(dataview, 0);
    cmd[1] = proto_tool.read_int16(dataview, 2);
    var body = {};
    cmd[2] = body;

    var offset = proto_tool.header_size;
    body.status = proto_tool.read_int16(dataview, offset);
    if(body.status != Response.OK){
        return cmd;
    }
    offset += 2;

    body.uid = proto_tool.read_uint32(dataview, offset);
    offset += 4;

    var ret = proto_tool.read_str_inbuf(dataview, offset);
    body.unick = ret[0];
    offset = ret[1];

    body.usex = proto_tool.read_int16(dataview, offset);
    offset += 2;
    body.uface = proto_tool.read_int16(dataview, offset);
    offset += 2;
    body.uvip = proto_tool.read_int16(dataview, offset);
    offset += 2;

    return cmd;
}

proto_man.reg_buf_encoder(Stype.Auth, Cmd.Auth.UNAME_LOGIN, encode_uname_login);
proto_man.reg_buf_decoder(Stype.Auth, Cmd.Auth.UNAME_LOGIN, decode_uname_login);

/*
手機註冊獲取驗證碼
客戶端發送：
2, 7, body = {
    0: 1, // 0-遊客升級，1-手機註冊，2-修改密碼
    1: phone
}
服務端返回：
2, 7, body = status
*/

function encode_get_verify_via_reg(stype, ctype, body){
    var phone_len = body[1].utf8_byte_len();
    var total_len = proto_tool.header_size + 2 + (2 + phone_len);
    var dataview = proto_tool.alloc_buffer(total_len);
    var offset = proto_tool.write_head_inbuf(dataview, stype, ctype);
    proto_tool.write_int16(dataview, body[0], offset);
    offset += 2;
    offset = proto_tool.write_str_inbuf(dataview, offset, phone_len, body[1]);

    return dataview;
}

proto_man.reg_buf_encoder(Stype.Auth, Cmd.Auth.GET_VERIFY_VIA_REG, encode_get_verify_via_reg);
proto_man.reg_buf_decoder(Stype.Auth, Cmd.Auth.GET_VERIFY_VIA_REG, proto_tool.decode_status_cmd);

/*
手機註冊
客戶端發送：
2, 8, body = {
    0: phone,
    1: pwd,
    2: code,
    3: unick
}
服務端返回：
2, 8, body = status
*/

function encode_reg_phone_acc(stype, ctype, body){
    var phone_len = body[0].utf8_byte_len();
    var pwd_len = body[1].utf8_byte_len();
    var code_len = body[2].utf8_byte_len();
    var unick_len = body[3].utf8_byte_len();
    var total_len = proto_tool.header_size + (2 + phone_len) + (2 + pwd_len) + (2 + code_len) + (2 + unick_len);
    var dataview = proto_tool.alloc_buffer(total_len);
    var offset = proto_tool.write_head_inbuf(dataview, stype, ctype);
    offset = proto_tool.write_str_inbuf(dataview, offset, phone_len, body[0]);
    offset = proto_tool.write_str_inbuf(dataview, offset, pwd_len, body[1]);
    offset = proto_tool.write_str_inbuf(dataview, offset, code_len, body[2]);
    offset = proto_tool.write_str_inbuf(dataview, offset, unick_len, body[3]);

    return dataview;
}

proto_man.reg_buf_encoder(Stype.Auth, Cmd.Auth.REG_PHONE_ACC, encode_reg_phone_acc);
proto_man.reg_buf_decoder(Stype.Auth, Cmd.Auth.REG_PHONE_ACC, proto_tool.decode_status_cmd);

/*
忘記密碼獲取驗證碼
客戶端發送：
2, 9, body = {
    0: 2, // 0-遊客升級，1-手機註冊，2-修改密碼
    1: phone
}
服務端返回：
2, 9, body = status
*/

function encode_get_verify_via_forget_pwd(stype, ctype, body){
    var phone_len = body[1].utf8_byte_len();
    var total_len = proto_tool.header_size + 2 + (2 + phone_len);
    var dataview = proto_tool.alloc_buffer(total_len);
    var offset = proto_tool.write_head_inbuf(dataview, stype, ctype);
    proto_tool.write_int16(dataview, body[0], offset);
    offset += 2;
    offset = proto_tool.write_str_inbuf(dataview, offset, phone_len, body[1]);

    return dataview;
}

proto_man.reg_buf_encoder(Stype.Auth, Cmd.Auth.GET_VERIFY_VIA_FORGET_PWD, encode_get_verify_via_forget_pwd);
proto_man.reg_buf_decoder(Stype.Auth, Cmd.Auth.GET_VERIFY_VIA_FORGET_PWD, proto_tool.decode_status_cmd);

/*
忘記密碼
客戶端發送：
2, 10, body = {
    0: phone,
    1: pwd,
    2: code,
}
服務端返回：
2, 10, body = status
*/
function encode_reset_pwd_acc(stype, ctype, body){
    var phone_len = body[0].utf8_byte_len();
    var pwd_len = body[1].utf8_byte_len();
    var code_len = body[2].utf8_byte_len();
    var total_len = proto_tool.header_size + (2 + phone_len) + (2 + pwd_len) + (2 + code_len);
    var dataview = proto_tool.alloc_buffer(total_len);
    var offset = proto_tool.write_head_inbuf(dataview, stype, ctype);
    offset = proto_tool.write_str_inbuf(dataview, offset, phone_len, body[0]);
    offset = proto_tool.write_str_inbuf(dataview, offset, pwd_len, body[1]);
    offset = proto_tool.write_str_inbuf(dataview, offset, code_len, body[2]);

    return dataview;
}

proto_man.reg_buf_encoder(Stype.Auth, Cmd.Auth.RESET_PWD_ACC, encode_reset_pwd_acc);
proto_man.reg_buf_decoder(Stype.Auth, Cmd.Auth.RESET_PWD_ACC, proto_tool.decode_status_cmd);

