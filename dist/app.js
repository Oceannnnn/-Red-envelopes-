'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _system = require('./static/utils/system.js');

var _system2 = _interopRequireDefault(_system);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = App({
  globalData: {
    state: 0,
    scene: '',
    encrypt: '',
    code_url: ''
  },
  onLaunch: function onLaunch() {
    if (wx.getStorageSync('httpClient')) {
      this.globalData.state = wx.getStorageSync('httpClient').state;
      this.globalData.userInfo = wx.getStorageSync('httpClient').userInfo;
      this.globalData.token = wx.getStorageSync('httpClient').token;
      this.globalData.encrypt = wx.getStorageSync('httpClient').encrypt;
    }
    _system2.default.attachInfo();
  },
  onShow: function onShow() {},
  onHide: function onHide() {}
});