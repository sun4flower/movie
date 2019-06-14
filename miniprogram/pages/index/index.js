// pages/index/index.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //用户登录
    wx.cloud.callFunction({
      name:"login"
    }).then(res=>{
      let openid=res.result.openid
      let user={
        openid:openid
      }
      wx.setStorageSync("user",user )
      this.getUserInfor()
    }).catch(err=>{
      console.log(err)
    })
    
  },
  //判断用户是否授权
  getUserInfor(){
    db.collection("userInfor").where({
      openid:wx.getStorageSync("user").openid
    }).get().then(res=>{
      if(res.data.length>0){
        wx.switchTab({
          url: '../move/move',
        })
      }
     // console.log(res)
    })
  },
  //获取用户信息
  bindgetuserinfo(e){
    if(e.detail.errMsg=="getUserInfo:ok"){
      let userInfo=e.detail.userInfo
      db.collection("userInfor").add({
      data:{
        nickname:userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        openid:wx.getStorageSync("user").openid
      }
    }).then(res=>{
      if (res.errMsg =="collection.add:ok"){
        wx.switchTab({
          url: '../move/move',
        })
      }
      console.log(res)
    }).catch(res=>{

    })
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})