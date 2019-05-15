"use strict";

var root_path = "../../../";
var index_obj = require(root_path + 'function/information_index.js')
var figure_obj = require(root_path + 'function/information_figure.js')
var api = require(root_path + 'api/information_api.js');
var menu_static = 0;


Page({

  data: {
    hid: false,
    menuStatic: menu_static,
    dis: "display_block",
    menu: ['全部', '哲学', '计算机', '量子力学', '凝聚态物理', '化学'],
    menulist: [],
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    indicatorDots: true,
    booklist: {},
    booklistAll: {}
  },
  onLoad: function(options) {
    var self = this;
    var menuAll = {};
    wx.getStorage({
      key: 'categoryAll',
      success: function(res) {
        menuAll = res.data
        console.log(menuAll)
        wx.getStorage({
          key: 'categoryMe',
          success: function(r) {
            console.log(r.data)

            var mindex = []
            var mcate = []
            mindex.push(0)
            for (var i = 0; i < r.data.length; i++) {
              var index = r.data[i]
              mcate.push(menuAll[index])
              mindex.push(index)
              // console.log(menuAll[index])
            }
            mcate.push('全部')
            self.setData({
              menu: mcate.reverse(),
              menulist: mindex.reverse()
            })
          }
        });
      }
    });
    wx.getStorage({
      key: 'user',
      success(res) {
        console.log(res.data.openid)
        self.findBookByOpenid(res.data.openid);
        console.log('ahhahah')
      }
    })


  },
  onPullDownRefresh: function() {
    console.log('onPullDownRefresh', new Date())
  },
  stopPullDownRefresh: function() {
    wx.stopPullDownRefresh({
      complete: function(res) {
        console.log(res, new Date())
      }
    })
  },
  onReady: function() {
    var that = this;
    setTimeout(function() {
      that.setData({
        hid: true
      });
    }, 2000);
  },

  onShow: function() {
    var that = this;
    setTimeout(function() {
      that.setData({
        dis: "display_none"
      });
    }, 1500);

    if (figure_obj.get_figure_cookie()) {
      this.setData({
        dis: "display_none"
      });
    } else {
      figure_obj.set_figure_cookie();
    }
  },

  detail: function(event) {
    console.log(event.currentTarget.id)
    wx.navigateTo({
      url: '/pages/information/detail/detail?id=' + event.currentTarget.id
    })
  },

  click_menu: function(event) {
    // var self = this;
    this.menu_static = event.currentTarget.id;
    console.log(this.menu_static)
    this.setData({
      menuStatic: this.menu_static
    });
    var list = []
    for (var i = 0; i < this.data.booklistAll.length; i++) {
      if (this.menu_static == 0) {
        list.push(this.data.booklistAll[i])
      } else if (this.data.booklistAll[i].bookCategoryId == this.menu_static) {
        list.push(this.data.booklistAll[i])
      }
    }
    this.setData({
      booklist: list.reverse()
    })
  },

  findBookByOpenid(openid) {
    var self = this;
    wx.request({
      url: 'http://localhost:8080/findBookByOpenid?openid=' + openid,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function(res) {
        if (res.data.responseCode == '1000') {

          self.setData({
            booklist: res.data.content.reverse(),
            booklistAll: res.data.content
          })

        } else {
          console.log('获取类别出错！');
        }

      }
    });
  }

});