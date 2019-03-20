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
    show5: false,
    balance: 0,
    with_money: ""
  },
  onShow: function onShow() {
    if (app.globalData.state == 1) {
      this.setData({
        state: 1,
        userInfo: app.globalData.userInfo
      });
      this.init();
    } else {
      this.setData({
        state: 0,
        userInfo: null,
        balance: 0
      });
    }
  },
  onLoad: function onLoad(op) {},
  init: function init() {
    var _this = this;

    var token = app.globalData.token;
    _system2.default.http("My/myInfo", {}, "post", token).then(function (res) {
      if (res.code == 200) {
        _this.setData({
          balance: res.data.account
        });
      } else if (res.code == -1) {
        _system2.default.afreshLogin();
      }
    });
  },
  tixianApply: function tixianApply(e) {
    var _this2 = this;

    var money = e.currentTarget.dataset.money;
    var token = app.globalData.token;
    if (money == "") return;
    _system2.default.http("My/tixianApply", { money: money }, "post", token).then(function (res) {
      if (res.code == 200) {
        wx.showToast({
          title: "申请成功",
          icon: "success"
        });
        _this2.handleShow5();
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
  bindinput: function bindinput(e) {
    this.setData({
      with_money: e.detail.value
    });
  },
  handleShow5: function handleShow5() {
    this.setData({
      show5: !this.data.show5
    });
  },
  toCall: function toCall() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone
    });
  },
  getUserInfo: function getUserInfo(e) {
    var that = this;
    wx.login({
      success: function success(res) {
        var code = res.code;
        wx.getSetting({
          success: function success(res) {
            if (res.authSetting["scope.userInfo"]) {
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
                  _system2.default.http("login/login", json, "post", token).then(function (data) {
                    if (data.code == 200) {
                      app.globalData.userInfo = e.detail.userInfo;
                      app.globalData.encrypt = data.data.encrypt;
                      app.globalData.token = data.data.token;
                      app.globalData.state = 1;
                      wx.setStorage({
                        key: "httpClient",
                        data: {
                          state: 1,
                          userInfo: e.detail.userInfo,
                          token: data.data.token,
                          encrypt: data.data.encrypt
                        }
                      });
                      that.setData({
                        state: 1,
                        userInfo: e.detail.userInfo
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