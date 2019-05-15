// var util = require('../../util/util')
var app = getApp();
Page({
  data: {
    name: '',
    nickName: '',
    gender: 0,
    genderArray: [],
    genderList:[],
    category:{},
    genderIndex: 0,
    age: 0,
    birthday: '',
    constellation: '',
    constellationArray: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
    constellationIndex: 0,
    company: '',
    school: '',
    tel: '',
    email: '',
    intro: '',
    openid:''
  },
  onLoad: function(options) {
    var that = this
    //获取缓存信息
    wx.getStorage({
      key: 'user',
      success: function(res) {
        var data = res.data
        console.log(data.openid)
        that.setData({
          openid: data.openid
          // name: data.name,
          // nickName: data.nickName,
          // gender: data.gender,
          // age: data.age,
          // birthday: data.birthday,
          // constellation: data.constellation,
          // company: data.company,
          // school: data.school,
          // tel: data.tel,
          // email: data.email,
          // intro: data.intro
        })
        that.loadLibraryCategory(data.openid);
      }
    });
    
  },
  savePersonInfo: function(e) {
    var data = e.detail.value
    console.log(data);
    wx.setStorage({
      key: 'person_info',
      data: {
        name: data.name,
        nickName: data.nickName,
        gender: data.gender,
        age: data.age,
        birthday: data.birthday,
        constellation: data.constellation,
        company: data.company,
        school: data.school,
        tel: data.tel,
        email: data.email,
        intro: data.intro
      },
      success: function(res) {
        wx.showToast({
          title: '资料修改成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function() {
          wx.navigateTo({
            url: '../personInfo/personInfo'
          })
        }, 2000)
      }
    })
  },
  changeGender: function(e) {
    console.log(e)
    var genderIndex = e.detail.value
    if (genderIndex != "null") {
      this.setData({
        genderIndex: genderIndex,
        gender: this.data.genderArray[this.data.genderIndex]
      })
    }
  },
  changeBirthday: function(e) {
    var birthday = e.detail.value
    if (birthday != "null") {
      this.setData({
        birthday: birthday
      })
    }
  },
  changeConstellation: function(e) {
    var constellationIndex = e.detail.value
    if (constellationIndex != "null") {
      this.setData({
        constellationIndex: constellationIndex,
        constellation: this.data.constellationArray[this.data.constellationIndex]
      })
    }
  },
  //加载图书类别
  loadLibraryCategory(openid){
    var self = this;
    wx.request({
      url: 'http://localhost:8080/findCategoryByOpenid?openid=' + openid ,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        if (res.data.responseCode=='1000')
        {
          var category = res.data.content.categorylist.split(",");
          wx.setStorageSync('categoryMe', category);//存储分类信息 
          wx.getStorage({
            key: 'categoryAll',
            success: function (res) {
              var categorylist = [];
              var index =[];
              // var categorylist = new Map();
              category.forEach(v => {
                // console.log(v)
                // var index = v
                categorylist.push(res.data[v])
                index.push(v)
                // categorylist.set(v, res.data[v])
              });
              console.log(categorylist)
              self.setData({
                genderArray: categorylist,
                genderList:index
              })
            }
          });
          
        }else
        {
          console.log('获取类别出错！');
        }
        
      }
    });
  },
  formSubmit(e) {
    var self = this;
    var form = e.detail.value;
    console.log('form发生了submit事件，携带数据为：', form)
    //获取分类id
    var cate = self.data.genderList[e.detail.value.bookCategoryId]
    console.log(cate);
    wx.request({
      url: 'http://localhost:8080/addbook?bookCategoryId=' + cate + '&uploadUserId=0&uploadUserOpenid=' + self.data.openid + '&bookName=' + form.bookName + '&bookReview=' + form.bookReview +  '&isShared=0&readPeriod='+ form.readPeriod,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function (res) {
        if (res.data.responseCode == '1000') {
          // console.log(res.data.content);
          //提示用户
          var title = '上传完成';
          wx.showToast({
            title,
            icon: 'success'
          });

        } else {
          console.log('添加信息出错！');
        }

      }
    });
  }
})