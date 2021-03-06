// pages/move/move.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moveList:[]//电影列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getMoveList()
   
  },
  //获取电影列表
  getMoveList(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'moveList',
      data: {
        start: this.data.moveList.length,
        count: 10
      },
      // 传递给云函数的参数
      success: res => {
        this.setData({
          moveList: this.data.moveList.concat(JSON.parse(res.result).subjects)
        })
        wx.hideLoading()
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      },
      complete: () => {
        // ...
      }
    })
  },
  //跳转评论页
  review(event){
    event.target.dataset.moveid
    wx.navigateTo({
      url: `../comment/comment?movieid=${event.target.dataset.moveid}`,
    })
  },
  onChange(){

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
  bindgetuserinfo(e) {
    console.log(event)

  },
   /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMoveList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})