//app.js
App({
  onLaunch: function () {
    var openid = null;
    var that = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function (res) {
          if (res.code) {
            console.log(res.code)
            wx.request({//需要修改url
              url: 'http://getopen.borrowingpartner.com/index.php/Book/index?code=' + res.code,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              // header: {}, // 设置请求的 header  
              success: function (res) {
                // console.log(res)
                var obj = {};
                obj.openid = res.data.openid;
                //obj.openid = '1'
                openid = res.data.openid;
                that.init(openid);
                obj.expires_in = Date.now() + res.data.expires_in;
                // console.log(obj);
                wx.setStorageSync('user', obj);//存储openid  
                //that.getuserInfo(openid)
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }

  },
  getuserInfo:function(openid){
    console.log('----')
    console.log(openid)
    wx.getUserInfo({
      success(res) {
        var objz = {};
        console.log(res)
        objz.avatarUrl = res.userInfo.avatarUrl;
        objz.nickName = res.userInfo.nickName;
        wx.setStorageSync('userInfo', objz);//存储userInfo
        wx.request({
          url: 'http://localhost:8080/user?openId=' + openid + '&nickname=' + res.data.nickName + '&avatarUrl=' + res.data.avatarUrl + '&gender=' + res.data.gender + '&province=' + res.data.province + '&city=' + res.data.city + '&country=' + res.data.country,
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
          // header: {}, // 设置请求的 header  
          success: function (res) {
            console.log("init success")
          }
        });
        //console.log(objz);

      },
      fail(res) {
        console.log(res)
      }
    });
  },
  //初始化
  init(openid){
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
      url: 'http://localhost:8080/findCategoryByOpenid?openid=' + openid,
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
  globalData:{
    userInfo:null
  }
})