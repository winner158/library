"use strict";
var app = getApp();
var root_path = "../../../";
var index_obj = require(root_path + 'function/personal_index.js')

Page({
  data: {
    userInfo: {},
    hiddenName: true,
    openid: null
  },
  onLoad: function(options) {
    
    var that = this;
    that.doLogin();
    app.getUserInfo(function(userInfo) {
      console.log(userInfo);

      //设置用户信息
      that.setData({
        userInfo: userInfo
      })
    });
  },
  onReady: function() {
    index_obj.set_title();
  },
  onShow: function() {
    index_obj.set_title();
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  uploadBook: function(e) {
    wx.navigateTo({
      url: "/pages/upload/index/index"
    })
  },
  readThink: function (e) {
    wx.navigateTo({
      url: "/pages/personal/history/index"
    })
  },
  sortBookStore: function (e) {
    wx.navigateTo({
      url: "/pages/personal/bookstore/index"
    })
  },
  aboutUs: function (e) {
    wx.navigateTo({
      url: "/pages/personal/about/index"
    })
  },
  doLogin: function (e) {
    var self = this;
    //获取缓存信息
    wx.getStorage({
      key: 'user',
      success: function (res) {
        // var data = res.data
        // console.log(data.openid)
        self.setData({
          openid: res.data.openid
          })
        var openid = res.data.openid
        // 查看是否授权
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success(res) {
                  self.setData({
                    hiddenName: true
                  })
                  var objz = {};
                  console.log(res)
                  objz.avatarUrl = res.userInfo.avatarUrl;
                  objz.nickName = res.userInfo.nickName;
                  wx.setStorageSync('userInfo', objz);//存储userInfo
                  wx.request({
                    url: 'http://localhost:8080/user?openId=' + openid + '&nickname=' + encodeURIComponent(res.userInfo.nickName) 
                      + '&gender=' + res.userInfo.gender + '&province=' + res.userInfo.province + '&city=' + res.userInfo.city + '&country=' + res.userInfo.country,
                    data: {},
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
                    header: {
                      'Content-Type': 'application/json'
                    },
                    success: function (res) {
                      console.log("init success")
                    }
                  });
                  self.init(openid)

                },
                fail(res) {
                  console.log(res)
                }
              });
            }
            else {
              self.setData({
                hiddenName: false
              })
            }
          }
        })
      }
    })
   
    var self = this;
    
  },
  //初始化
  init(openid) {
    var self = this;
    //获取所有的类别信息
    wx.request({
      url: 'http://localhost:8080/findall',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        if (res.data.responseCode == '1000') {
          // console.log(res.data.content);
          var result = res.data.content;
          var map = {};
          for (var index in result) {
            map[result[index].id] = result[index].content;
          }
          // console.log(map);
          wx.setStorageSync('categoryAll', map);//存储分类信息 

        } else {
          console.log('获取类别出错！');
        }
      }
    });
    this.loadLibraryCategory(openid);
  },
  //加载图书类别
  loadLibraryCategory(openid) {
    var self = this;
    wx.request({
      url: 'http://localhost:8080/findCategoryByOpenid?openid="' + openid +'"',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        if (res.data.responseCode == '1000') {
          var category = res.data.content.categorylist.split(",");
          wx.setStorageSync('categoryMe', category);//存储分类信息 


        } else {
          console.log('获取类别出错！');
        }

      }
    });
  },

})