// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var ws = require("websocket");
var Stype = require("Stype");
var Cmd = require("Cmd");
var Response = require("Response");
var ugame = require("ugame");
var five_chess = require("five_chess");
var game_seat = require("game_seat");
var State = require("State");

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
        seatA: {
            default: null,
            type: game_seat,
        },

        seatB: {
            default: null,
            type: game_seat,
        },

        prop_prefab: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.disk = this.node.getChildByName("chessbox").getComponent("chess_disk");
        this.checkout = this.node.getChildByName("checkout").getComponent("checkout");

        var service_handler = {};
        service_handler[Stype.Game5Chess] = this.on_five_chess_service_return.bind(this);
        ws.register_serivces_handler(service_handler);

        // this.ready_btn.active = true;
    },

    start () {
        var prev_round_data = ugame.prev_round_data;

        //寫入座位
        var seat_data = prev_round_data[0];
        this.user_arrived_return(seat_data[0], true);
        this.user_arrived_return(seat_data[1], false);

        this.cmd_set = prev_round_data[1];
        this.cur_cmd = 0;

        console.log(this.cmd_set);
        this.exec_cmd();
    },

    exec_cmd: function(){
        if(this.cur_cmd >= this.cmd_set.length){
            return;
        }

        var cmd = this.cmd_set[this.cur_cmd];
        this.cur_cmd ++;
        if(!cmd){
            return;
        }

        var stype = cmd[1];
        var ctype = cmd[2];
        var body = cmd[3];

        this.on_five_chess_service_return(stype, ctype, body);

        if(this.cur_cmd < this.cmd_set.length){
            //還有指令
            var next_cmd = this.cmd_set[this.cur_cmd];
            var left_time = next_cmd[0] - cmd[0];
            this.scheduleOnce(this.exec_cmd.bind(this), left_time);
        }else{
            //最後一個指令
            this.scheduleOnce(this.checkout_over_return.bind(this), 5);
        }
    },

    on_close_click: function(){
        cc.director.loadScene("home_scene");
    },

    on_do_ready_click: function(){
        // this.ready_btn.active = false;
        five_chess.do_ready();
    },

    on_play_again_click: function(){
        this.unscheduleAllCallbacks();
        this.checkout_over_return();

        this.cur_cmd = 0;

        console.log(this.cmd_set);
        this.exec_cmd();
    },

    enter_zone_return: function(status){
        if(status != Response.OK){
            console.log("enter_zone_return fail, status: ", status);
            return;
        }

        console.log("enter_zone_return success");
    },

    user_quit_return: function(status){
        if(status != Response.OK){
            console.log("user_quit_return fail, status: ", status);
            return;
        }

        console.log("user_quit_return success");
        cc.director.loadScene("home_scene");
    },

    enter_room_return: function(body){
        if(body[0] != Response.OK){
            console.log("enter_room_return fail, status: ", status);
            return;
        }

        console.log("enter_room_return success");
    },

    exit_room_return: function(body){
        if(body != Response.OK){
            console.log("exit_room_return fail, status: ", status);
            return;
        }

        console.log("exit_room_return success");
    },

    user_sitdown_return: function(body){
        if(body[0] != Response.OK){
            console.log("user_sitdown_return fail, status: ", status);
            return;
        }

        console.log("user_sitdown_return success");
        var uinfo = {
            sv_seat: body[1],
            unick: ugame.unick,
            usex: ugame.usex,
            uface: ugame.uface,

            uchip: ugame.user_game_info.uchip,
            uexp: ugame.user_game_info.uexp,
            uvip: ugame.user_game_info.uvip,
            state: State.InView,
        }
        this.seatA.seat_sitdown(uinfo, true);
    },

    user_standup_return: function(body){
        if(body[0] != Response.OK){
            console.log("user_standup_return fail, status: ", status);
            return;
        }
        console.log("user_standup_return success");

        var sv_seat = body[1];
        if(this.seatA.get_seat_id() == sv_seat){
            this.seatA.seat_standup();
        }else{
            this.seatB.seat_standup();
        }
    },

    user_arrived_return: function(body, is_seatA){
        console.log("user_arrived_return success");

        var uinfo = {
            sv_seat: body[0],
            unick: body[1],
            usex: body[2],
            uface: body[3],

            uchip: body[4],
            uexp: body[5],
            uvip: body[6],
            state: body[7],
        }

        if(is_seatA){
            this.seatA.seat_sitdown(uinfo, false)
        }else{
            this.seatB.seat_sitdown(uinfo, false)
        }
    },

    send_prop_return: function(body){
        if(body[0] != Response.OK){
            console.log("send_prop_return fail");
            return;
        }

        console.log("seat_id:", body[1], "to_seat_id: ", body[2], "prop_id:", body[3]);

        var prop = cc.instantiate(this.prop_prefab);
        this.node.addChild(prop);
        var game_prop = prop.getComponent("game_prop");

        var from, to_dst;
        if(body[1] === this.seatA.get_seat_id()){
            //從自己發送
            from = this.seatA.node.getPosition();
            to_dst = this.seatB.node.getPosition();
        }else{
            //從對面發送
            from = this.seatB.node.getPosition();
            to_dst = this.seatA.node.getPosition();
        }

        game_prop.play_prop_anim(from, to_dst, body[3]);
    },

    do_ready_return: function(body){
        if(body[0] != Response.OK){
            //會有錯誤，一定是自己按送出出問題。因為後端廣播的是寫Response.OK
            console.log("do_ready_return fail");
            // this.ready_btn.active = true;
            return;
        }

        if(body[1] == this.seatA.get_seat_id()){
            this.seatA.do_ready();
        }else{
            this.seatB.do_ready();
        }
    },

    round_game_start_return: function(body){
        this.seatA.round_game_start(body);
        this.seatB.round_game_start(body);
    },

    turn_to_player_return: function(body){
        var action_time = body[0];
        var seat_id = body[1];

        if(seat_id == this.seatA.get_seat_id()){
            this.seatA.turn_to_player(action_time);
            this.disk.set_your_turn(true);
        }else{
            this.seatB.turn_to_player(action_time);
            this.disk.set_your_turn(false);
        }
    },

    put_chess_return: function(body){
        if(body[0] != Response.OK){
            console.log("put_chess fail");
            return;
        }

        var block_x = body[1];
        var block_y = body[2];
        var chess_type = body[3];
        this.disk.put_chess(chess_type, block_x, block_y);

        //放完棋子後關閉timebar
        this.seatA.hide_timebar();
        this.seatB.hide_timebar();
    },

    checkout_return: function(body){
        var winner_seatid = body[0];
        var winner_score = body[1];

        if(winner_seatid == -1){
            this.checkout.show_result(2, null);
            return;
        }

        if(winner_seatid === this.seatA.get_seat_id()){
            this.checkout.show_result(1, winner_score);
            ugame.user_game_info.uchip += winner_score;
        }else{
            this.checkout.show_result(0, winner_score);
            ugame.user_game_info.uchip -= winner_score;
        }
    },

    checkout_over_return: function(body){
        //隱藏result
        this.checkout.hide_dlg();

        //還原位置
        this.seatA.checkout_over();
        this.seatB.checkout_over();

        //清理棋盤
        this.disk.clear_chess();

        //顯示開始鍵
        // this.ready_btn.active = true;
    },

    reconnect_return: function(body){
        // this.ready_btn.active = false;

        var seat_id = body[0];
        var arrived_data = body[1][0];
        var game_round_data = body[2];
        var chess_disk = body[3];
        var game_ctl = body[4];

        //玩家坐下
        this.user_sitdown_return({
            0: Response.OK,
            1: seat_id,
        })

        //玩家抵達
        this.user_arrived_return(arrived_data);
        
        //開局數據
        this.round_game_start_return(game_round_data);

        //棋盤數據 x=j, y=i
        for(var i = 0; i < 15; i ++){
            for(var j = 0; j < 15; j ++){
                if(chess_disk[i * 15 + j] != 0){
                    this.disk.put_chess(chess_disk[i * 15 + j], j, i);
                }
            }
        }
        
        //遊戲進度數據
        var action_time = game_ctl[1];
        var seat_id = game_ctl[0];

        if(seat_id == this.seatA.get_seat_id()){
            this.seatA.turn_to_player(action_time);
            this.disk.set_your_turn(true);
        }else{
            this.seatB.turn_to_player(action_time);
            this.disk.set_your_turn(false);
        }
    },

    get_prev_round_return: function(body){
        if(body[0] != Response.OK){
            console.log("get_prev_round_return fail, status = ", body[0]);
            return;
        }

        //離開房間
        this.on_close_click();

        //關閉websocket通知
        ws.register_serivces_handler(null);

        //儲存上局回放至ugame
        ugame.prev_round_data = body[1];

        //跳轉至回放頁
        // cc.director.loadScene("replay_scene");
    },

    on_five_chess_service_return: function(stype, ctype, body){
        console.log(stype, ctype, body);
        switch (ctype){
            case Cmd.Game5Chess.ENTER_ZONE:
                this.enter_zone_return(body);
            break
            case Cmd.Game5Chess.USER_QUIT:
                this.user_quit_return(body);
            break
            case Cmd.Game5Chess.ENTER_ROOM:
                this.enter_room_return(body);
            break
            case Cmd.Game5Chess.EXIT_ROOM:
                this.exit_room_return(body);
            break
            case Cmd.Game5Chess.USER_SITDOWN:
                this.user_sitdown_return(body);
            break
            case Cmd.Game5Chess.USER_STANDUP:
                this.user_standup_return(body);
            break
            case Cmd.Game5Chess.USER_ARRIVED:
                this.user_arrived_return(body);
            break
            case Cmd.Game5Chess.SEND_PROP:
                this.send_prop_return(body);
            break
            case Cmd.Game5Chess.DO_READY:
                this.do_ready_return(body);
            break
            case Cmd.Game5Chess.ROUND_GAME_START:
                this.round_game_start_return(body);
            break
            case Cmd.Game5Chess.TURN_TO_PLAYER:
                this.turn_to_player_return(body);
            break
            case Cmd.Game5Chess.PUT_CHESS:
                this.put_chess_return(body);
            break
            case Cmd.Game5Chess.CHECKOUT:
                this.checkout_return(body);
            break
            case Cmd.Game5Chess.CHECKOUT_OVER:
                this.checkout_over_return(body);
            break
            case Cmd.Game5Chess.RECONNECT:
                this.reconnect_return(body);
            break
            case Cmd.Game5Chess.GET_PREV_ROUND_DATA:
                this.get_prev_round_return(body);
            break
        }
    },

    // update (dt) {},
});
