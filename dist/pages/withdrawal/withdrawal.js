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
    list: [],
    onBottom: true,
    page: 1
  },
  onLoad: function onLoad(op) {
    this.list(1);
  },
  list: function list(page) {
    var _this = this;

    var json = {
      pagesize: 10,
      current: page
    };
    var list = this.data.list;
    var token = app.globalData.token;
    _system2.default.http("My/tixianList", json, "post", token).then(function (res) {
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
            list: list
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
      this.list(page);
    }
  }
});