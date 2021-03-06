// 云函数入口文件
const cloud = require("wx-server-sdk");
const time = require("./time");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  return sendSubscribeMessage(event);
};

async function requestSubscribeMessage(event) {
  // 此处为模板 ID，开发者需要到小程序管理后台 - 订阅消息 - 公共模板库中添加模板，
  // 然后在我的模板中找到对应模板的 ID，填入此处
  return "rcv57r2mZ3NeH6HlZtvPKi8zRgMWGIy1sUD0tWB03io"; // 如 'N_J6F05_bjhqd6zh2h1LHJ9TAv9IpkCiAJEpSw0PrmQ'
}

async function sendSubscribeMessage(event) {
  try {
    const db = cloud.database();
    const msg = await db
      .collection("idList3")
      .where({
        need6: "0",
      })
      .get({
        success: function (res) {
          return res;
        },
      });
    let tmpArr = [];
    let filterMsg = [];
    for (let i = 0; i < msg.data.length; i++) {
      if (tmpArr.indexOf(msg.data[i]._openid) === -1) {
        tmpArr.push(msg.data[i]._openid);
        filterMsg.push(msg.data[i]);
      }
    }
    filterMsg.map(async (message) => {
      // try {
      // 发送订阅消息
      const res = await cloud.openapi.subscribeMessage.send({
        touser: message._openid,
        pagepath: "pages/index/index",
        data: {
          thing1: {
            value: "休息日也要喝茶！多喝热水",
          },
          thing3: {
            value: "周六三点🕒",
          },
          thing12: {
            value: "好好休息",
          },
        },
        template_id: "bPBS4BX4GdkUFmfuU_vhbMlTQ8fCeXzIuPTatyl1iMk",
      });
    });
    const _ = db.command;
    msg.data.map(async (msg) => {
      db.collection("idList3")
        .doc(msg._id)
        .update({
          data: {
            need6: "1",
          },
          success(res) {
            return res;
          },
        });
      db.collection("rank")
        .where({
          _openid: msg._openid,
        })
        .update({
          data: {
            rankNum: _.inc(1),
          },
          success(res) {
            return res;
          },
        });
    });
  } catch (e) {
    console.error(e);
  }
}
