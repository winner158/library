Page({
  data:{
    // text:"这是一个页面"
    bookcontent:null,
    isShared:true
  },
  onLoad:function(options){
      console.log(options.id);
    this.findBookByid(options.id)
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  findBookByid(id) {
    var self = this;
    wx.request({
      url: 'http://localhost:8080/findBookById?id=' + id,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        if (res.data.responseCode == '1000') {
          var isShared = res.data.content.isShared>0?true:false;
          self.setData({
            bookcontent: res.data.content,
            isShared
          })

        } else {
          console.log('获取类别出错！');
        }

      }
    });
  },
  shareActon() {
    var self = this;
    var title = self.data.isShared? '取消分享':'分享成功';
    var value = self.data.isShared?false:true;
    self.setData({
      isShared: value
    })
    wx.showToast({
      title,
      icon: 'success'
    });
    wx.request({
      url: 'http://localhost:8080/updateBookById?id=' + self.data.bookcontent.id + '&isShared=' + value,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        if (res.data.responseCode == '1000') {
          console.log('success');
          
        } else {
          console.log('获取数据出错！');
        }

      }
    });
  },
  formSubmit(e){
    var self = this;
    console.log(e.detail.value.text)
    wx.request({
      url: 'http://localhost:8080/updateBookReviewById?id=' + self.data.bookcontent.id + '&bookReview=' + '"' + e.detail.value.text + '"' ,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        if (res.data.responseCode == '1000') {
          console.log('success');
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          });
         
        } else {
          console.log('获取数据出错！');
        }

      }
    });
    self.findBookByid(self.data.bookcontent.id)
  }
})