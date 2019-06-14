var proto_man = require("proto_man");
var proto_tool = require("proto_tool");

/*
客戶端：
Enter:
1, 1, body = {
    uname: "名字",
    usex: 1 or 0, 性別
};
返回: 
1, 1, response

Exit:
1, 2, body = null
返回:
1, 2, response

UserArrived: 伺服器主動發送
1, 3, body = uinfo

UserExit: 伺服器主動發送
1, 4, body = uinfo

SendMsg:
1, 5, body = "msg"
返回:
1, 5 body = {
    0: response,
    1: uname,
    2: usex,
    3: msg
}

UserMsg: 伺服器主動發送
1, 6, body = {
    0: uname,
    1: usex,
    2: msg
}
*/

function encode_enter_talkroom(stype, ctype, body){
    var uname_len = body.uname.utf8_byte_len();
    var total_len = proto_tool.header_size + 2 + uname_len + 2;
    var dataview = proto_tool.alloc_buffer(total_len);
    var offset = proto_tool.write_head_inbuf(dataview, stype, ctype);
    offset = proto_tool.write_str_inbuf(dataview, offset, uname_len, body.uname);
    proto_tool.write_int16(dataview, body.usex, offset);
    return dataview;
}

function decode_user_arrived(buf){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(buf, 0);
    cmd[1] = proto_tool.read_int16(buf, 2);
    var body = {};
    cmd[2] = body;
    var ret = proto_tool.read_str_inbuf(buf, proto_tool.header_size);
    body.uname = ret[0];
    var offset = ret[1];
    body.usex = proto_tool.read_int16(buf, offset);

    return cmd;
}

function decode_user_exit(buf){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(buf, 0);
    cmd[1] = proto_tool.read_int16(buf, 2);
    var body = {};
    cmd[2] = body;
    var ret = proto_tool.read_str_inbuf(buf, proto_tool.header_size);
    body.uname = ret[0];
    var offset = ret[1];
    body.usex = proto_tool.read_int16(buf, offset);

    return cmd;
}

function decode_seng_msg(buf){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(buf, 0);
    cmd[1] = proto_tool.read_int16(buf, 2);
    var body = {};
    cmd[2] = body;

    var offset = proto_tool.header_size;
    body[0] = proto_tool.read_int16(buf, offset);
    offset += 2;
    var ret = proto_tool.read_str_inbuf(buf, offset);
    body[1] = ret[0];
    offset = ret[1];
    body[2] = proto_tool.read_int16(buf, offset);
    offset += 2;
    ret = proto_tool.read_str_inbuf(buf, offset);
    body[3] = ret[0];
    
    return cmd;
}

function decode_user_msg(buf){
    var cmd = {};
    cmd[0] = proto_tool.read_int16(buf, 0);
    cmd[1] = proto_tool.read_int16(buf, 2);
    var body = {};
    cmd[2] = body;

    var offset = proto_tool.header_size;
    var ret = proto_tool.read_str_inbuf(buf, offset);
    body[0] = ret[0];
    offset = ret[1];
    body[1] = proto_tool.read_int16(buf, offset);
    offset += 2;
    ret = proto_tool.read_str_inbuf(buf, offset);
    body[2] = ret[0];
    
    return cmd;
}

proto_man.reg_buf_encoder(1, 1, encode_enter_talkroom);
proto_man.reg_buf_decoder(1, 1, proto_tool.decode_status_cmd);

proto_man.reg_buf_encoder(1, 2, proto_tool.encode_empty_cmd);
proto_man.reg_buf_decoder(1, 2, proto_tool.decode_status_cmd);

proto_man.reg_buf_decoder(1, 3, decode_user_arrived);
proto_man.reg_buf_decoder(1, 4, decode_user_exit);

proto_man.reg_buf_encoder(1, 5, proto_tool.encode_str_cmd);
proto_man.reg_buf_decoder(1, 5, decode_seng_msg);

proto_man.reg_buf_decoder(1, 6, decode_user_msg);
