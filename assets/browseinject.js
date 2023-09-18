//cfg.desktop.matchmode
let modeid2room = {
    0:'',
    1:'铜之间', 2:'铜之间', 3:'铜之间', 17:'铜之间', 18:'铜之间', // dou
    4:'银之间', 5:'银之间', 6:'银之间', 19:'银之间', 20:'银之间', // gin
    7:'金之间', 8:'金之间', 9:'金之间', 21:'金之间', 22:'金之间', // kin
    10:'玉之间', 11:'玉之间', 12:'玉之间', 23:'玉之间', 24:'玉之间', // gyoku 
    //13:'乱斗之间', 14:'乱斗之间', // furu
    15:'王座间', 16:'王座间', 25:'王座间', 26:'王座间', // ouza
    // 33:'宝牌狂热', // kyounetu
    // 40:'修罗之战', // syura
    // 41:'赤羽之战', // chuanma
};

const roomname2num = {
    '友人场': 0,
    '铜之间': 1,
    '银之间': 2,
    '金之间': 3,
    '玉之间': 4,
    '王座间': 5,
    '比赛场': 100,
    '乱斗之间': 101,
    '修罗之战': 102,
    '宝牌狂热': 103,
    '赤羽之战': 104,
}

var UserID = -1;
var paipugamedata = {};
var paipugamedata0 = {};

function setUserID(id){
    UserID = id;
}

function getAccountID() {
    return GameMgr.Inst.account_id
}

function analyzeGameRecord(record_list){
    // collect errors and report once
    let target_gamedata = null;
    if (UserID == 0) target_gamedata = paipugamedata0;
    else target_gamedata = paipugamedata;
    let errors = [];
    function reporterrors(data){
        errors.push(data);
    }
    for (let i = 0; i < record_list.length; i ++ ){
        let record = record_list[i];
        // TODO: 对于超过1000个的，当前获取不到元数据的牌谱，需要更新。可以升级元数据牌谱版本号然后对其更新
        //if (target_gamedata[record.uuid] != undefined)
            //已有该数据，不继续分析。以后可以考虑数据的生成版本
            //continue;
        target_gamedata[record.uuid] = null;
        //console.log(record.uuid);
        let gamedata = {
            source: 'majsoul',
            accountid: UserID,
            starttime: record.start_time,
            endtime: record.end_time,
            uuid: record.uuid,
            version: null,
            playerdata: [],
            roomdata: {}
        };
        //对于旧式数据的载入
        if (record.config.mode.extendinfo != undefined && record.config.mode.extendinfo.length > 0){
            gamedata.roomdata = JSON.parse(record.config.mode.extendinfo);
        }
        if (record.config.mode.detail_rule != undefined){
            //console.log(record.constructor.name, JSON.stringify(record.config.mode.detail_rule), record.config.mode.detail_rule);
            gamedata.roomdata = record.constructor.name == 'Object' ? record.config.mode.detail_rule : record.config.mode.detail_rule.toJSON();
        }
        //加上version项，记录生成牌谱的版本以方便以后更新。如果是在浏览器生成则设置为0.0.0.17
        let version = '0.0.0.17';
        //if (protobuf.util.isNode)
        //    version = config.get('Version');
        gamedata.version = version;
        gamedata.roomdata.has_ai = record.config.mode.ai;
        //默认的必要设置
        if (gamedata.roomdata.init_point == undefined) gamedata.roomdata.init_point = 25000;
        if (gamedata.roomdata.fandian == undefined) gamedata.roomdata.fandian = 30000;
        if (gamedata.roomdata.time_fixed == undefined) gamedata.roomdata.time_fixed = 5;
        if (gamedata.roomdata.time_add == undefined) gamedata.roomdata.time_add = 20;
        if (gamedata.roomdata.dora_count == undefined) gamedata.roomdata.dora_count = 3;
        if (gamedata.roomdata.shiduan == undefined) gamedata.roomdata.shiduan = 1;
        if (gamedata.roomdata.room == undefined) gamedata.roomdata.room = 100;
        //把食断改为布尔值
        gamedata.roomdata.shiduan = gamedata.roomdata.shiduan == 1;
        if (record.config.category == 1){
            //友人场
            gamedata.roomdata.room = roomname2num['友人场'];
        }
        else if (record.config.category == 2){
            //段位场
            let roomname = modeid2room[record.config.meta.mode_id];
            if (roomname) gamedata.roomdata.room = roomname2num[roomname];
            // console.log(record.config.meta.mode_id, gamedata.roomdata.room);
            // if (!gamedata.roomdata.room) console.log(record.config.meta.mode_id, roomname);
            if (!roomname){
                reporterrors({ message: '未知房间编号' + record.config.meta.mode_id, data: record});
            }
            if (gamedata.roomdata.room == 101){
                //古役场
            }
            else if (gamedata.roomdata.room == 102){
                //修罗模式
            }
            else if (gamedata.roomdata.room == 103){
                //宝牌狂热
            }
            else if (gamedata.roomdata.room == 104){
                //川麻
            }
            else if (roomname && !gamedata.roomdata.room){
                //查到了房间名字，但是不认识
            }
        }
        else if (record.config.category == 4){
            //比赛场
            gamedata.roomdata.room = roomname2num['比赛场'];
            gamedata.roomdata.contest_id = record.config.meta.contest_uid;
        }
        else{
            reporterrors({ message: '未知牌谱类别编号' + record.config.category, data: record});
        }
        gamedata.roomdata.player = record.config.mode.mode > 10 ? 3 : 4;
        let roundtype = record.config.mode.mode % 10;
        gamedata.roomdata.round = roundtype == 1 ? 4 : roundtype == 2 ? 8 : 1;
        if (record.config.mode.mode >= 20 || roundtype > 4){
            reporterrors({message: '未知房间模式编号' + record.config.mode.mode, data: record});
        }
        for (let i = 0; i < gamedata.roomdata.player; i ++ )
            gamedata.playerdata.push({
                id: 0,
                name: '电脑',
                rank: 1,
                pt: 0
            });
        if (gamedata.roomdata.player != gamedata.playerdata.length || 
            gamedata.roomdata.player != record.result.players.length){
                reporterrors({message: '玩家数目相关条目不统一', data: data});
        }
        for (let i = 0; i < record.accounts.length; i ++ ){
            let acc = record.accounts[i];
            let pos = acc.seat;
            let pdata = gamedata.playerdata[pos];
            pdata.id = acc.account_id;
            pdata.name = acc.nickname;
            let idstr = String(acc.level.id);
            pdata.rank = parseInt(idstr[2]) * 3 + parseInt(idstr[4]) - 3;
            pdata.pt = acc.level.score;
        }
        for (let i = 0; i < gamedata.roomdata.player; i ++ ){
            let point = record.result.players[i];
            let pos = point.seat;
            let pdata = gamedata.playerdata[pos];
            pdata.finalpoint = point.part_point_1;
            pdata.deltapt = point.grading_score;
        }

        target_gamedata[gamedata.uuid] = gamedata;
        //console.log(JSON.stringify(gamedata));
    }
    if (errors.length) reporterrors({message: '牌谱元数据分析错误', data: errors});
}

var cantgetIDstr = '获取信息错误！无法获取用户ID，请确认已经进入大厅。或者尝试刷新页面。';
function showcantgetIDmsg(){
    /*
    dialog.showMessageBox({
        type: 'error',
        noLink: true,
        buttons: ['确定'],
        title: '错误',
        message: cantgetIDstr
    });*/
}

function isspecialrule(roomdata) {
    let isspecialrule = roomdata.fanfu > 1 //>1番缚
        || roomdata.guyi_mode //古役
        || roomdata.begin_open_mode //配牌明牌
        || roomdata.xuezhandaodi //血战到底
        || roomdata.huansanzhang //换三张
        || roomdata.jiuchao_mode //鸠巢
        || roomdata.reveal_discard //暗夜之战
    ;
    const basicrule = {
        "dora_count":3,
        "shiduan":true,
        "can_jifei":true,
        "tianbian_value":0,  // TODO what's mean of tianbian
        "liqibang_value":1000,
        "changbang_value":300,
        "noting_fafu_1":1000,
        "noting_fafu_2":1500,
        "noting_fafu_3":3000,
        "have_liujumanguan":true,
        "have_qieshangmanguan":false,
        "have_biao_dora":true,
        "have_gang_biao_dora":true,
        "ming_dora_immediately_open":false,
        "have_li_dora":true,
        "have_gang_li_dora":true,
        "have_sifenglianda":true,
        "have_sigangsanle":true,
        "have_sijializhi":true,
        "have_jiuzhongjiupai":true,
        "have_sanjiahele":false,
        "have_toutiao":false,
        "have_helelianzhuang":true,
        "have_helezhongju":true,
        "have_tingpailianzhuang":true,
        "have_tingpaizhongju":true,
        "have_yifa":true,
        "have_nanruxiru":true,
        "disable_multi_yukaman":false,
        "disable_leijiyiman":false,
        "fanfu":1,
    }
    const basickey = [
        "player", "round", "init_point", "fandian", "time_fixed", 
        "time_add", "room", "contest_id", "has_ai", "bianjietishi",
        "ai_level"
    ]
    let isbasicrule = true;
    for (let i in basicrule){
        if (!((roomdata[i] == undefined) || roomdata[i] == basicrule[i]))
            //console.log(i, roomdata[i], basicrule[i]);
        isbasicrule = isbasicrule && ((roomdata[i] == undefined) || roomdata[i] == basicrule[i]);
    }
    for (let i in roomdata)
        if (false && basicrule[i] == undefined && !basickey.includes(i) && roomdata[i]){
            // TODO 存在不是基本规则或是基本参数的内容，当做特殊规则。没调试好先disable
            //console.log(i, roomdata[i]);
            isspecialrule = true;
        }
    return isspecialrule || !isbasicrule;
}

function iserrorpaipu(gamedata) {
    // 空数据，无房间号，房间号>=100是活动场
    return !gamedata //空数据
        || !gamedata.roomdata //空房间数据
        || gamedata.roomdata.room == undefined //无房间号
        || gamedata.roomdata.room > 100 //房间号>100是活动场
        || isspecialrule(gamedata.roomdata) //包含特殊规则
    ;
}

function collectallpaipu() {
    //alert("将开始自动收集牌谱基本数据！如果牌谱较多需要一定时间。1000牌谱收集耗时约1分钟。");
    let TYPES = {0: 'ALL', 1: 'FRIEND', 2: 'RANK', 4: 'MATCH', 100: 'COLLECT'};
    let types = []
    for (let i in TYPES) types.push(i);
    const get_more = function (result,start,types=[0],count=30) {
        let type = types[0];
        app.NetAgent.sendReq2Lobby("Lobby", "fetchGameRecordList", {
                    start,
                    count,
                    type
                },
                function(n, {record_list}) {
                    //console.log(start,record_list, types);
                    m = uiscript.UI_PaiPu.record_map;
                    if(record_list.length>0 && !m[record_list[0].uuid]){
                        get_more(result.concat(record_list),start+count,types)
                    }else{
                        types = types.slice(1);
                        //console.log(types);
                        if (types.length) get_more(result.concat(record_list),0,types);
                        else{
                            result.forEach((item)=>{
                                m[item.uuid] = item
                            });
                            let count = 0;
                            for (let i in uiscript.UI_PaiPu.record_map)
                                //console.log(JSON.stringify(uiscript.UI_PaiPu.record_map[i]));
                                count ++ ;
                            //alert("已自动收集牌谱基本数据！牌谱个数：" + count);
                            //callback && callback();
                            //return result;
                        }
                    }
                });
    }
    get_more([], 0, types);
}

function savegamedata(userid, gamedata){
    let gamedatatxt = 'gamedata.json';
    const gamedatamMaxCount =  Object.keys(gamedata).length;
    let jsonFormat = '[';
    let count = 0;
    for (let id in gamedata) {
        count ++;
        if (count < gamedatamMaxCount) {
            jsonFormat = jsonFormat + JSON.stringify(gamedata[id]) + ',\n';
        } else {
            jsonFormat = jsonFormat + JSON.stringify(gamedata[id]) + ']';
        }
    }
    var blob = new Blob([jsonFormat], {type: "text/plain;charset=utf-8"});
    //console.log(gamedatatxt);
    //saveAs(blob, gamedatatxt);
    pywebview.api.savegamedataJson(gamedatatxt, jsonFormat).then( 
        function(response) { 
            console.log(JSON.stringify(response))
            alert(response.message + "文件已生成，收集牌谱个数：" + count);
        } 
    )
}

collectallpaipu();
alert("已自动收集牌谱基本数据！牌谱个数：" + Object.keys(uiscript.UI_PaiPu.record_map).length);

setUserID(GameMgr.Inst.account_id);
let resList = [];
for (let id in uiscript.UI_PaiPu.record_map) {
    resList.push(uiscript.UI_PaiPu.record_map[id]);
    //console.log(JSON.stringify(uiscript.UI_PaiPu.record_map[id]));
}
analyzeGameRecord(resList);
alert("已格式化牌谱个数：" + Object.keys(paipugamedata).length);

savegamedata(GameMgr.Inst.account_id, paipugamedata)

/*
setTimeout( ()=>{
    //console.log(JSON.stringify(uiscript.UI_PaiPu.record_map));
    setUserID(GameMgr.Inst.account_id);
    let resList = [];
    for (let id in uiscript.UI_PaiPu.record_map) {
        resList.push(uiscript.UI_PaiPu.record_map[id]);
        //console.log(JSON.stringify(uiscript.UI_PaiPu.record_map[id]));
    }

    analyzeGameRecord(resList);
    //console.log(UserID)
    //console.log(getAccountID())
    //console.log(JSON.stringify(paipugamedata));
}, 5000);

setTimeout( ()=>{
   savegamedata(GameMgr.Inst.account_id, paipugamedata)
}, 8000);
*/

/*
var InjectOverNode = document.createElement('p');
InjectOverNode.innerHTML = '脚本加载完成，点击隐藏';
InjectOverNode.setAttribute('style', 'color: #2D2;z-index: 999;position: absolute;left: 0px;top: 0px;font-weight: bold;');
InjectOverNode.setAttribute('id', 'InjectOverNode');
InjectOverNode.onclick = function () {
    this.setAttribute('style', 'visibility: collapse');
};
document.getElementsByTagName('body')[0].appendChild(InjectOverNode);
*/
