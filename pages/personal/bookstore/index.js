//var message = require('../../component/message/message')
//var douban = require('../../comm/script/fetch')
//var config = require('../../comm/script/config')
var app = getApp();
Page({
  data: {
    searchType: 'keyword',
    hotKeyword: ['功夫熊猫', '烈日灼心', '摆渡人', '长城', '我不是潘金莲', '这个杀手不太冷', '驴得水', '海贼王之黄金城', '西游伏妖片', '我在故宫修文物', '你的名字'],
    mindex: [],
    hotTag: ['动作', '喜剧', '爱情', '悬疑'],
    keyword: {}
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.init()

  },
  onUnload: function () {
    var self = this
    wx.getStorage({
      key: 'user',
      success(res) {
        self.loadLibraryCategory(res.data['openid'])
      }
    })
  },
  onHide: function () {
    var self = this
    wx.getStorage({
      key: 'user',
      success(res) {
        self.loadLibraryCategory(res.data['openid'])
      }
    })
  },
  //加载图书类别
  loadLibraryCategory(openid) {
    var self = this;
    wx.request({
      url: 'http://localhost:8080/findCategoryByOpenid?openid="' + openid + '"',
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
  init(){
    var self = this;
    wx.getStorage({
      key: 'user',
      success(res) {
        app.loadLibraryCategory(res.data['openid'])
        //获取缓存信息
        wx.getStorage({
          key: 'categoryAll',
          success: function (res) {
            var all = res.data
            var keyword = {}
            console.log(all)
            self.setData({
              keyword: all
            })
            wx.getStorage({
              key: 'categoryMe',
              success: function (res) {

                // self.setData({
                //   hotKeyword:res.data,
                //   hotTag:all
                // })

                var mindex = []
                var mcate = []
                //mindex.push(0)
                for (var i = 0; i < res.data.length; i++) {
                  var index = res.data[i]
                  mcate.push(all[index])
                  mindex.push(index)
                  // console.log(menuAll[index])
                }
                // mcate.push('全部')
                self.setData({
                  hotTag: all,
                  hotKeyword: mcate,
                  mindex: mindex
                })

              }
            });
          }
        });
      }
    })
    
    
  },

  changeSearchType: function() {
    var types = ['默认', '类型'];
    var searchType = ['keyword', 'tag']
    var that = this
    wx.showActionSheet({
      itemList: types,
      success: function(res) {
        console.log(res)
        if (!res.cancel) {
          that.setData({
            searchType: searchType[res.tapIndex]
          })
        }
      }
    })
  },
  search: function(e) {
    var that = this
    var keyword = e.detail.value.keyword
    if (keyword == '') {
      message.show.call(that, {
        content: '请输入内容',
        icon: 'null',
        duration: 1500
      })
      return false
    } else {
      var searchUrl = that.data.searchType == 'keyword' ? config.apiList.search.byKeyword : config.apiList.search.byTag
      wx.redirectTo({
        url: '../searchResult/searchResult?url=' + encodeURIComponent(searchUrl) + '&keyword=' + keyword
      })
    }
  },
  delKeyword: function(e) {
    var self = this
    var keyword = e.currentTarget.dataset.keyword
    var keywordid = 0;
    for (var key in self.data.keyword){
      if (self.data.keyword[key] == keyword){
        keywordid=key
      }
    }

    console.log(keyword)
    console.log(keywordid)
    // wx.redirectTo({
    //   url: '../searchResult/searchResult?url=' + encodeURIComponent(config.apiList.search.byKeyword) + '&keyword=' + keyword
    // })
    wx.showModal({
      title: '提示',
      content: '您确定要移除当前标签吗?',
      success: function(e) {
        var ll = self.data.mindex
        Array.prototype.remove = function (val) {
          var index = this.indexOf(val);
          if (index > -1) {
            this.splice(index, 1);
          }
        };
        ll.remove(keywordid)
        var cate = ''
        for (var i=0;i<ll.length;i++){
          if(i!=ll.length-1){
            cate += ll[i]
            cate += ','
          }else{
            cate += ll[i]
          }
        }
        console.log(cate)
        wx.getStorage({
          key: 'user',
          success(res) {
           // self.findBookByOpenid(res.data['openid']);
            var openid = res.data['openid']
            wx.request({
              url: 'http://localhost:8080/UpdateOrAddCategory?userId=10&userOpenid=' + res.data['openid']  + '&categorylist=' + cate,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              header: {
                'Content-Type': 'application/json'
              },
              success: function (res) {
                if (res.data.responseCode == '1000') {
                  self.loadLibraryCategory(openid)
                } else {
                  console.log('获取类别出错！');
                }

              }
            });
          }
        })
        //var openid = '1'
        
      }
    })
    self.init()
  },
  addKeyword: function(e) {
    var self = this
    var keyword = e.currentTarget.dataset.keyword
    var keywordid = 0;
    for (var key in self.data.keyword) {
      if (self.data.keyword[key] == keyword) {
        keywordid = key
      }
    }

    console.log(keyword)
    console.log(keywordid)
    // wx.redirectTo({
    //   url: '../searchResult/searchResult?url=' + encodeURIComponent(config.apiList.search.byKeyword) + '&keyword=' + keyword
    // })
    wx.showModal({
      title: '提示',
      content: '您确定要增加当前标签吗?',
      success: function (e) {
        var ll = self.data.mindex
        ll.push(keywordid)
        var cate = ''
        for (var i = 0; i < ll.length; i++) {
          if (i != ll.length - 1) {
            cate += ll[i]
            cate += ','
          } else {
            cate += ll[i]
          }
        }
        console.log(cate)
        wx.getStorage({
          key: 'user',
          success(res) {
            var openid = res.data['openid']
            wx.request({
              url: 'http://localhost:8080/UpdateOrAddCategory?userId=10&userOpenid=' + res.data['openid'] + '&categorylist=' + cate,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              header: {
                'Content-Type': 'application/json'
              }, 
              success: function (res) {
                if (res.data.responseCode == '1000') {
                  self.loadLibraryCategory(openid)
                } else {
                  console.log('获取类别出错！');
                }
              }
            });
          }
        })
        // var openid = '1'
       
      }
    })
    self.init()
  },
  NavigatoP(){
    wx.startPullDownRefresh()
  }
})