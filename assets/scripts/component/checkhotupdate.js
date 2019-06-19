var http = require("http");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        url: "http://127.0.0.1:10001",
    },

    // use this for initialization
    onLoad: function () {

    },

    set_hotupdate_search_path: function() {
        var path = jsb.fileUtils.getSearchPaths();
        console.log("jsb.fileUtils.getSearchPaths() = ", path);

        var write_path = this._storagePath;
        var hotpath = write_path + "hotupdate/";
        if (!jsb.fileUtils.isDirectoryExist(hotpath)) {
            console.log("hotupdate目錄不存在，創建一個");

            jsb.fileUtils.createDirectory(hotpath);
        }

        path.unshift(hotpath);
        jsb.fileUtils.setSearchPaths(path);
        console.log("jsb.fileUtils.getSearchPaths() = ", jsb.fileUtils.getSearchPaths());

        this.hotpath = hotpath;
    }, 
    
    local_hotupdate_download_list: function(hotpath) {
        var json = {};
        var str;
        if (jsb.fileUtils.isFileExist(hotpath + "/hotupdate.json")) {
            console.log("熱更新的hotupdate.json檔案在，使用");

            str = jsb.fileUtils.getStringFromFile(hotpath + "/hotupdate.json");
            json = JSON.parse(str);
        }
        else {
            console.log("熱更新的hotupdate.json檔案不在，使用本地")
            if(jsb.fileUtils.isFileExist("hotupdate.json")){
                console.log("本地hotupdate.json檔案在，進行解析");

                str = jsb.fileUtils.getStringFromFile("hotupdate.json");
                json = JSON.parse(str);
            }else{
                console.log("本地hotupdate.json檔案不在，無法解析");

                json = null;
            }
        }
        
        return json;
    }, 

    download_item: function(write_path, server_item, end_func) {
        if (server_item.file.indexOf(".json") >= 0) {
            http.get(this.url, "/" + server_item.file, null, function(err, data) {
                if (err) {
                    if (end_func) {
                        end_func();
                    }
                    return;
                }

                {
                    var dir_array = new Array(); //定义一数组 
                    dir_array = server_item.dir.split("/");
                    var walk_dir = write_path;

                    for(var j = 0; j < dir_array.length; j ++) {
                        walk_dir = walk_dir + "/" + dir_array[j];
                        if (!jsb.fileUtils.isDirectoryExist(walk_dir)) {
                            jsb.fileUtils.createDirectory(walk_dir);
                        }
                    }
                    jsb.fileUtils.writeStringToFile(data, write_path + "/" + server_item.file);
                }    
                if (end_func) {
                    end_func();
                }
            });
        }
        else {
            http.download(this.url, "/" + server_item.file, null, function(err, data) {
                if (err) {
                    if (end_func) {
                        end_func();
                    }
                    return;
                }

                {
                    var dir_array = new Array(); //定义一数组 
                    dir_array = server_item.dir.split("/");
                    var walk_dir = write_path;

                    for(var j = 0; j < dir_array.length; j ++) {
                        walk_dir = walk_dir + "/" + dir_array[j];
                        if (!jsb.fileUtils.isDirectoryExist(walk_dir)) {
                            jsb.fileUtils.createDirectory(walk_dir);
                        }
                    }
                    jsb.fileUtils.writeDataToFile(data, write_path + "/" + server_item.file);
                }

                if (end_func) {
                    end_func();
                }
            });
        }
        
    },

    start: function() {
        this._storagePath = jsb.fileUtils.getWritablePath();
        console.log("jsb.fileUtils.getWritablePath() = ", this._storagePath);
        // 设置一下搜索路径
        this.set_hotupdate_search_path();
        // end 

        var now_list = this.local_hotupdate_download_list(this.hotpath);

        if(!now_list){
            console.log("无本地hotupdate.js, 不连server直接开....");
            this.node.removeFromParent();
            return;
        }
        
        var server_list = null;
        // http_download("http://127.0.0.1:6080", "/hotupdate/hotupdate.json", null, function(err, data) {
        http.get(this.url, "/hotupdate/hotupdate.json", null, function(err, data) {
            if (err) {
                this.node.removeFromParent();
                return;
            }

            server_list = JSON.parse(data);


            var i = 0;
            var download_array = [];
            for(var key in server_list) {
                if (now_list[key] && now_list[key].md5 === server_list[key].md5) {
                    continue;
                }

                download_array.push(server_list[key]);
            }

            if (download_array.length <= 0) {
                console.log("下载列表为空");
                this.node.removeFromParent();
                return;
            }

            
            var i = 0;
            var callback = function() {
                i ++;
                if (i >= download_array.length) {
                    jsb.fileUtils.writeStringToFile(data, this.hotpath + "/hotupdate.json");
                    this.node.removeFromParent();
                    
                    this.scheduleOnce(function(){

                        console.log("即将重起...................");
                        cc.audioEngine.stopAll();
                        cc.game.restart();
                        return;
                    }, 3000);
                    
                }

                this.download_item(this._storagePath, download_array[i], callback);
            }.bind(this);

            this.download_item(this._storagePath, download_array[i], callback);
        }.bind(this));
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
