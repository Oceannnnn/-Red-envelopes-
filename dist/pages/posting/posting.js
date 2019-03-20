"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _system = require("../../static/utils/system.js");

var _system2 = _interopRequireDefault(_system);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
exports.default = Page({
  data: {
    content: "",
    disabled: false,
    show5: false,
    showText: "我的福卡",
    image1: "../../static/images/add.png",
    image2: "../../static/images/add.png",
    text1: "选择你的福卡",
    text2: "选择你想换取的福卡",
    customStyle: {
      top: "-10rpx",
      right: "0",
      position: "absolute",
      "background-color": "#FEDFC2",
      color: "#ff1e00"
    }
  },
  onLoad: function onLoad() {
    var _this = this;

    var token = app.globalData.token;
    _system2.default.http("Change/userLuckyShow", {}, "get", token).then(function (res) {
      if (res.code == 200) {
        _this.setData({
          userLuckyShow: res.data
        });
      } else if (res.code == -1) {
        _system2.default.afreshLogin();
      }
    });
  },
  bindinput: function bindinput(e) {
    this.setData({
      content: e.detail.value
    });
  },
  handleShow5: function handleShow5() {
    this.setData({
      show5: !this.data.show5
    });
  },
  change: function change(e) {
    this.handleShow5();
    var type = e.currentTarget.dataset.type;
    var list = [];
    var showText = "";
    if (type == 1) {
      list = this.data.userLuckyShow;
      showText = "我的福卡";
    } else {
      list = this.data.wantLuckyShow;
      showText = "想要换取的福卡";
    }
    this.setData({
      list: list,
      type: type,
      showText: showText
    });
  },
  changeImage: function changeImage(e) {
    var _this2 = this;

    this.handleShow5();
    var image = e.currentTarget.dataset.image;
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    var type = this.data.type;
    if (type == 1) {
      this.setData({
        ischoose: 1,
        image1: image,
        text1: name,
        out_id: id,
        image2: "../../static/images/add.png",
        in_id: ""
      });
      var token = app.globalData.token;
      _system2.default.http("Change/wantLuckyShow", { id: id }, "post", token).then(function (res) {
        if (res.code == 200) {
          _this2.setData({
            wantLuckyShow: res.data
          });
        } else if (res.code == -1) {
          _system2.default.afreshLogin();
        }
      });
    } else {
      this.setData({
        image2: image,
        text2: name,
        in_id: id
      });
    }
  },
  publishLucky: function publishLucky(e) {
    var out_id = this.data.out_id;
    var in_id = this.data.in_id;
    var content = this.data.content;
    if (content == "") {
      wx.showToast({
        title: "内容不能为空",
        icon: "none"
      });
      return;
    }
    if (out_id) {
      if (!in_id || in_id == "") {
        wx.showToast({
          title: "请选择想要的福卡",
          icon: "none"
        });
        return;
      }
    }
    this.setData({
      disabled: true
    });
    var token = app.globalData.token;
    var json = {
      content: content,
      out_id: out_id,
      in_id: in_id
    };
    _system2.default.http("Change/publishLucky", json, "post", token).then(function (res) {
      if (res.code == 200) {
        wx.showToast({
          title: "发表成功",
          icon: "success"
        });
        wx.navigateBack();
      } else if (res.code == -1) {
        _system2.default.afreshLogin();
      }
    });
  }
});