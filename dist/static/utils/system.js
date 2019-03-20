'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
exports.default = {
  attachInfo: function attachInfo() {
    var res = wx.getSystemInfoSync();

    wx.WIN_WIDTH = res.screenWidth;
    wx.WIN_HEIGHT = res.screenHeight;
    wx.IS_IOS = /ios/i.test(res.system);
    wx.IS_ANDROID = /android/i.test(res.system);
    wx.STATUS_BAR_HEIGHT = res.statusBarHeight;
    wx.DEFAULT_HEADER_HEIGHT = 46; // res.screenHeight - res.windowHeight - res.statusBarHeight
    wx.DEFAULT_CONTENT_HEIGHT = res.screenHeight - res.statusBarHeight - wx.DEFAULT_HEADER_HEIGHT;
    wx.IS_APP = true;

    wx.showAlert = function (options) {
      options.showCancel = false;
      wx.showModal(options);
    };

    wx.showConfirm = function (options) {
      wx.showModal(options);
    };
  },
  http: function http(url) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';
    var token = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    var u = "https://redbag.fqwlkj.cn/api.php/api/";
    var allUrl = u + url;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: allUrl,
        data: data,
        method: method ? method : 'get',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          token: token
        },
        success: function success(res) {
          resolve(res.data);
        },
        fail: function fail(res) {
          reject(res.data);
        }
      });
    });
  },
  afreshLogin: function afreshLogin() {
    wx.clearStorage();
    app.globalData.state == 0;
    wx.showModal({
      title: '提示',
      confirmText: '确认',
      content: '信息已过期，请重新登陆',
      confirmColor: '#029F53',
      success: function success(res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../../pages/my/my'
          });
        }
      }
    });
  }
};