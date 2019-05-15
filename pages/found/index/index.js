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
    this.findBookList();
  },
  onReady:function(){
      index_obj.set_title();
  },
  onShow:function(){
    this.findBookList();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  findBookList() {
    var self = this;
    wx.request({
      url: 'http://localhost:8080/findBookAll',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        if (res.data.responseCode == '1000') {
          var list = []
          for (var i = 0; i < res.data.content.length; i++) {
            if (res.data.content[i].isShared > 0)
            {
              list.push(res.data.content[i])
            }
          }
          self.setData({
            booklist: list.reverse()
          })

        } else {
          console.log('获取数据出错！');
        }

      }
    });
  }
})