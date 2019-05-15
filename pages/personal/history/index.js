"use strict";

var root_path = "../../../";
var index_obj = require(root_path+'function/found_index.js')

Page({
  data:{
    // text:"这是一个页面"
    booklist: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var self = this;
    // this.findBookByOpenid('1');
    wx.getStorage({
      key: 'user',
      success(res) {
        self.findBookByOpenid(res.data['openid']);
       
      }
    })
  },
  onReady:function(){
      index_obj.set_title();
  },
  onShow:function(){
      index_obj.set_title();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  findBookByOpenid(openid) {
    var self = this;
    wx.request({
      url: 'http://localhost:8080/findBookByOpenid?openid=' + openid,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        if (res.data.responseCode == '1000') {

          self.setData({
            booklist: res.data.content
          })

        } else {
          console.log('获取类别出错！');
        }

      }
    });
  }
})