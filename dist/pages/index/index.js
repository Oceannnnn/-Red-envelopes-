"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _system = require("../../static/utils/system.js");

var _system2 = _interopRequireDefault(_system);

var _wxParse = require("../../static/wxParse/wxParse.js");

var _wxParse2 = _interopRequireDefault(_wxParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
exports.default = Page({
  data: {
    str: "",
    isShow: false,
    state: 0
  },
  onShow: function onShow() {
    if (app.globalData.state == 1) {
      this.setData({
        state: 1
      });
    } else {
      this.setData({
        state: 0
      });
    }
  },
  onLoad: function onLoad(op) {
    this.init();
    this.share(op);
  },
  init: function init() {
    var _this = this;

    _system2.default.http("Setting/settingInfo", {}, "get").then(function (res) {
      if (res.code == 200) {
        app.globalData.shareMessage = res.data.share;
        app.globalData.phone = res.data.phone;
        _wxParse2.default.wxParse("details", "html", res.data.rule, _this, 0);
      }
    });
  },
  share: function share(op) {
    if (op.code_url) {
      app.globalData.shareEncrypt = op.encrypt;
      app.globalData.code_url = op.code_url;
    }
  },
  bindinput: function bindinput(e) {
    this.setData({
      str: e.detail.value
    });
  },
  rules: function rules() {
    this.setData({
      isShow: !this.data.isShow
    });
  },
  open: function open() {
    var _this2 = this;

    var token = app.globalData.token;
    var str = this.data.str;
    if (str == "") {
      wx.showToast({
        title: "请输入口令",
        icon: "none"
      });
      return;
    }
    _system2.default.http("Scan/copyString", { str: str }, "post", token).then(function (res) {
      if (res.code == 200) {
        wx.navigateTo({
          url: "../myFokas/myFokas"
        });
        _this2.setData({
          str: ""
        });
      } else if (res.code == -1) {
        _system2.default.afreshLogin();
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    });
  },
  saoma: function saoma(identification) {
    var token = app.globalData.token;
    _system2.default.http("Scan/scanOper", { code_id: identification }, "post", token).then(function (res) {
      if (res.code == 200) {
        wx.navigateTo({
          url: "../myFokas/myFokas"
        });
        app.globalData.scene = "";
      } else if (res.code == -1) {
        _system2.default.afreshLogin();
      } else if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    });
  },
  getUserInfo: function getUserInfo(e) {
    var that = this;
    wx.login({
      success: function success(res) {
        var code = res.code;
        wx.getSetting({
          success: function success(loginres) {
            if (loginres.authSetting["scope.userInfo"]) {
              wx.getUserInfo({
                success: function success(msg) {
                  var encryptedData = msg.encryptedData;
                  var iv = msg.iv;
                  var token = "";
                  var json = {
                    code: code,
                    encryptedData: encryptedData,
                    iv: iv
                  };
                  _system2.default.http("Login/login", json, "post", token).then(function (data) {
                    if (data.code == 200) {
                      app.globalData.userInfo = e.detail.userInfo;
                      app.globalData.encrypt = data.data.encrypt;
                      app.globalData.state = 1;
                      app.globalData.token = data.data.token;
                      wx.setStorage({
                        key: "httpClient",
                        data: {
                          state: 1,
                          userInfo: e.detail.userInfo,
                          token: data.data.token,
                          encrypt: data.data.encrypt
                        }
                      });
                      var shareEncrypt = app.globalData.shareEncrypt;
                      var code_url = app.globalData.code_url;
                      _system2.default.http("Auto/click", { encrypt: shareEncrypt, code_url: code_url }, "post", data.data.token).then(function (res) {});
                    }
                  });
                }
              });
            } else {
              wx.showToast({
                title: "授权才能开启哦！",
                icon: "none",
                duration: 2000
              });
            }
          }
        });
      }
    });
  }
});