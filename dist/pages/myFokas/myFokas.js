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
    show3: false,
    show4: false,
    customStyle: {
      top: "0",
      right: "0",
      position: "absolute",
      "background-color": "#FEDFC2",
      color: "#ff1e00"
    },
    swiperCurrent: 0,
    interval: 2000,
    previousmargin: "140rpx",
    nextmargin: "140rpx" //后边距！
  },
  onLoad: function onLoad(op) {
    var _this = this;

    if (op.red) {
      this.setData({
        fromRed: 1
      });
    }
    var token = app.globalData.token;
    _system2.default.http("Scan/luckyShow", {}, "get", token).then(function (res) {
      if (res.code == 200) {
        _this.setData({
          luckyShow: res.data
        });
      } else if (res.code == -1) {
        _system2.default.afreshLogin();
      }
    });
    _system2.default.http("Scan/luckyMoney", {}, "get", token).then(function (res) {
      if (res.code == 200) {
        _this.setData({
          myLuckyList: res.data
        });
      } else if (res.code == -1) {
        _system2.default.afreshLogin();
      }
    });
  },
  handleShow3: function handleShow3() {
    this.setData({
      show3: !this.data.show3
    });
  },
  handleShow4: function handleShow4() {
    this.setData({
      show4: !this.data.show4
    });
  },
  swiperChange: function swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },
  setClipboardData: function setClipboardData() {
    var value = this.data.command;
    wx.setClipboardData({
      data: value,
      success: function success(res) {
        wx.getClipboardData({
          success: function success(res) {}
        });
      }
    });
  },
  clickScan: function clickScan(e) {
    var _this2 = this;

    var code_url = e.currentTarget.dataset.code;
    var index = e.currentTarget.dataset.index;
    var token = app.globalData.token;
    _system2.default.http("Auto/sharePage", { code_url: code_url }, "post", token).then(function (res) {
      if (res.code == 200) {
        var myLuckyList = _this2.data.myLuckyList;
        for (var i = 0; i < myLuckyList.length; i++) {
          myLuckyList[index].is_shared = res.data.is_shared;
          if (myLuckyList[index].is_shared == 1) {
            _this2.setData({
              overflow: "hidden",
              onBottom: true,
              page: 1,
              sharePeopleShow: []
            });
            _this2.handleShow4();
            _this2.sharePeopleShow(1, code_url);
            break;
          }
        }
        _this2.setData({
          myLuckyList: myLuckyList,
          code_url: code_url
        });
      } else if (res.code == -1) {
        _system2.default.afreshLogin();
      }
    });
  },
  more: function more() {
    this.setData({
      overflow: "scroll",
      shareShow: false
    });
    var page = this.data.page + 1;
    this.setData({
      page: page
    });
    this.sharePeopleShow(page, this.data.code_url);
  },
  sharePeopleShow: function sharePeopleShow(page, code_url) {
    var _this3 = this;

    var token = app.globalData.token;
    var sharePeopleShow = this.data.sharePeopleShow;
    _system2.default.http("Auto/sharePeopleShow", { code_url: code_url, pagesize: page, current: page }, "post", token).then(function (res) {
      if (res.code == 200) {
        if (res.data != "") {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var item = _step.value;

              sharePeopleShow.push(item);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          _this3.setData({
            sharePeopleShow: sharePeopleShow
          });
          if (sharePeopleShow.length == 6) {
            _this3.setData({
              shareShow: true
            });
          }
        } else if (res.code == 0) {
          if (page > 1) {
            _this3.data.onBottom = false;
          }
        } else if (res.code == -1) {
          _system2.default.afreshLogin();
        }
      }
    });
  },
  onReachBottom: function onReachBottom() {
    var page = this.data.page + 1;
    this.setData({
      page: page
    });
    if (this.data.onBottom) {
      this.sharePeopleShow(page, this.data.code_url);
    }
  },
  luckyShow: function luckyShow(e) {
    var _this4 = this;

    var luckyShow = this.data.luckyShow;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var num = luckyShow[index].num;
    if (num == 0) {
      wx.showToast({
        title: "你还未集到！",
        icon: "none"
      });
    } else {
      this.handleShow3();
      var token = app.globalData.token;
      _system2.default.http("Scan/createGiveCommand", { id: id }, "post", token).then(function (res) {
        if (res.code == 200) {
          _this4.setData({
            command: res.data.encypt
          });
        } else if (res.code == -1) {
          _system2.default.afreshLogin();
        }
      });
    }
  },
  onUnload: function onUnload() {
    if (this.data.fromRed) {
      wx.switchTab({
        url: "../community/community"
      });
    }
  },
  onShareAppMessage: function onShareAppMessage() {
    var encrypt = app.globalData.encrypt;
    var shareMessage = app.globalData.shareMessage;
    var code_url = this.data.code_url;
    return {
      title: shareMessage,
      path: "/pages/index/index?encrypt=" + encrypt + "&code_url=" + code_url
    };
  }
});