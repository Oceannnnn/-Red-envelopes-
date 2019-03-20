"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _system = require("../../static/utils/system.js");

var _system2 = _interopRequireDefault(_system);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
exports.default = Page({
  data: {},
  onLoad: function onLoad(op) {
    this.init();
  },
  init: function init() {
    this.setData({
      state: app.globalData.state
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
                        hasUserInfo: true,
                        userInfo: e.detail.userInfo
                      });
                      var shareEncrypt = app.globalData.shareEncrypt;
                      var code_url = app.globalData.code_url;
                      console.log(shareEncrypt, code_url);
                      _system2.default.http("Auto/click", { encrypt: shareEncrypt, code_url: code_url }, "post", data.data.token).then(function (res) {
                        console.log(res);
                      });
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