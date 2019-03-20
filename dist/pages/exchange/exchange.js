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
  onLoad: function onLoad() {
    this.init();
  },
  onShow: function onShow() {
    if (app.globalData.state == 1) {
      this.setData({
        nickName: app.globalData.userInfo.nickName
      });
    }
    this.init();
  },
  init: function init() {
    this.setData({
      page: 1,
      onBottom: true,
      search: "",
      ex_items: []
    });
    this.ex_items(1, "");
  },
  publishLucky: function publishLucky() {
    wx.navigateTo({
      url: "../posting/posting"
    });
  },
  ex_items: function ex_items(page, search) {
    var _this = this;

    var json = {
      pagesize: 10,
      current: page,
      search: search
    };
    var list = this.data.ex_items;
    var token = app.globalData.token;
    _system2.default.http("Change/publishList", json, "post", token).then(function (res) {
      if (res.code == 200) {
        if (res.data != "") {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var item = _step.value;

              list.push(item);
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

          _this.setData({
            ex_items: list
          });
        } else if (res.code == 0) {
          if (page > 1) {
            _this.data.onBottom = false;
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
      this.ex_items(page, this.data.search);
    }
  },

  onPullDownRefresh: function onPullDownRefresh() {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.init();
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }, 1500);
  },
  bindconfirm: function bindconfirm(e) {
    var value = e.detail.value;
    this.setData({
      search: value,
      page: 1,
      onBottom: true,
      ex_items: []
    });
    this.ex_items(1, value);
  },
  add_plun: function add_plun(e) {
    var _this2 = this;

    if (app.globalData.state == 1) {
      var comment = e.detail.value;
      var token = app.globalData.token;
      var id = e.currentTarget.dataset.id;
      var index = e.currentTarget.dataset.index;
      var nick_name = e.currentTarget.dataset.name;
      var ex_items = this.data.ex_items;
      var json = {
        comment_user: nick_name,
        content: comment
      };
      _system2.default.http("Comment/comment", { change_id: id, content: comment }, "post", token).then(function (res) {
        if (res.code == 200) {
          ex_items[index].commentList.unshift(json);
          _this2.setData({
            ex_items: ex_items,
            value: ""
          });
        }
      });
    } else if (res.code == -1) {
      _system2.default.afreshLogin();
    }
  },
  changeLucky: function changeLucky(e) {
    var token = app.globalData.token;
    var list = this.data.ex_items;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var self = e.currentTarget.dataset.self;
    var that = this;
    wx.showModal({
      title: "提示",
      content: "确定交换吗？",
      success: function success(res) {
        if (res.confirm) {
          if (self == 1) {
            wx.showToast({
              title: "不能交换自己的",
              icon: "none"
            });
            return;
          }
          _system2.default.http("Change/changeLucky", { change_id: id }, "post", token).then(function (res) {
            if (res.code == 200) {
              wx.showToast({
                title: "交换成功",
                icon: "success"
              });
              list.splice(index, 1);
              that.setData({
                ex_items: list
              });
            } else if (res.code == -1) {
              _system2.default.afreshLogin();
            } else if (res.code == 0) {
              wx.showToast({
                title: "没有可以交换的福卡",
                icon: "none"
              });
            }
          });
        }
      }
    });
  }
});