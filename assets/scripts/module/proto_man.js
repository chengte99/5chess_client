var proto_tool = require("proto_tool");
/*
1. 服務號、命令號、數據
2. 服務號、命令號，都以兩個字節存放
*/
var log = {
    info: console.log,
    warn: console.log,
    error: console.log
}

var proto_man = {
    PROTO_JSON: 1,
    PROTO_BUF: 2,
    encode_cmd: encode_cmd,
    decode_cmd: decode_cmd,
    reg_buf_encoder: reg_buf_encoder,
    reg_buf_decoder: reg_buf_decoder
};

function encrypt_cmd(str_or_buf){
    return str_or_buf;
}

function decrypt_cmd(str_or_buf){
    return str_or_buf;
}

function _json_encode(stype, ctype, body){
    var cmd = {};
    cmd[0] = body;

    var str = JSON.stringify(cmd);
    var cmd_buf = proto_tool.encode_str_cmd(stype, ctype, str);

    return cmd_buf;
}

function _json_decode(cmd_buf){
    var cmd = proto_tool.decode_str_cmd(cmd_buf);
    var cmd_json = cmd[2];

    try {
        var body_set = JSON.parse(cmd_json);
        cmd[2] = body_set[0];
    } catch (e) {
        return null;
    }

    if(!cmd ||
        typeof(cmd[0])=="undefined" ||
        typeof(cmd[1])=="undefined" ||
        typeof(cmd[2])=="undefined"){
        return null;
    }

    return cmd;
}

/*
proto_type: json, buf
stype
ctype
body
return str_or_buf
*/
function encode_cmd(proto_type, stype, ctype, body){
    var cmd_buf = null;
    var dataview;

    if(proto_type == proto_man.PROTO_JSON){
        dataview = _json_encode(stype, ctype, body);
    }else{
        var key = get_key(stype, ctype);
        if(!encoder[key]){
            log.warn("encoder's " + key + " is null");
            return null
        }
        
        // str_or_buf = encoder[key](body);
        dataview = encoder[key](stype, ctype, body);
    }

    proto_tool.write_prototype_inbuf(dataview, proto_type);

    cmd_buf = dataview.buffer;
    if(cmd_buf){
        cmd_buf = encrypt_cmd(cmd_buf);
    }

    return cmd_buf;
}

/*
proto_type: json, buf
str_or_buf
return cmd: {0: stype, 1: ctype, 2: body}
*/
function decode_cmd(proto_type, cmd_buf){
    cmd_buf = decrypt_cmd(cmd_buf);
    var dataview = new DataView(cmd_buf);
    var cmd = null;

    if(proto_type == proto_man.PROTO_JSON){
        cmd = _json_decode(dataview);
    }else{
        if (dataview.byteLength < proto_tool.header_size) {
            return null;
        }
        
        var stype = proto_tool.read_int16(dataview, 0);
        var ctype = proto_tool.read_int16(dataview, 2);

        var key = get_key(stype, ctype);
        if(!decoder[key]){
            log.warn("decoder's " + key + " is null");
            return null;
        }

        // cmd = decoder[key](str_or_buf);
        cmd = decoder[key](dataview);
    }
    
    return cmd;
}

var encoder = {};
var decoder = {};

function get_key(stype, ctype){
    var key = stype * 65536 + ctype;
    return key;
}

/*
encode_func(body)
*/
function reg_buf_encoder(stype, ctype, encode_func){
    var key = get_key(stype, ctype);
    if(encoder[key]){
        log.warn("encoder, stype: " + stype + ", ctype: " + ctype + " is reged");
        return null
    }

    encoder[key] = encode_func;
}

/*
decode_func(buf)
*/
function reg_buf_decoder(stype, ctype, decode_func){
    var key = get_key(stype, ctype);
    if(decoder[key]){
        log.warn("decoder, stype: " + stype + ", ctype: " + ctype + " is reged");
        return null
    }

    decoder[key] = decode_func;
}

module.exports = proto_man;