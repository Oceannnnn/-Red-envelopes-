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
    var _this = this;

    var token = app.globalData.token;
    _system2.default.http("My/redbagList", {}, "post", token).then(function (res) {
      if (res.code == 200) {
        _this.setData({
          redRanking: res.data
        });
      } else if (res.code == -1) {
        _system2.default.afreshLogin();
      }
    });
  }
});