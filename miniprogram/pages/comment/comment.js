// pages/comment/comment.js
const db = wx.cloud.database()
//console.log(db)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:[],//详情
    content:"",//评论
    rate:5,//星级
    imgs:[],//图片
    fileId:[],//图片id
    moveid:"",//电影ID
    headImg:"",//头像
    nickName:"",//昵称,
    commentArr:[]//评论列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      moveid: options.movieid
    })
    //获取电影信息
    wx.cloud.callFunction({
      name:"getDetail",
      data:{
        moveid: options.movieid
      }
    }).then(res=>{
      this.setData({
        detail:JSON.parse(res.result)
      })
    }).catch(err=>{
      console.log(err)
    })
    //获取评论
    this.getComment()
    this.getHeadImg()
  },
  getHeadImg(){
    db.collection('userInfor').where({
      openid:wx.getStorageSync("user").openid
    }).get().then(res=>{
      let data=res.data[0];
      this.setData({
        headImg:data.avatarUrl,//头像
        nickName:data.nickname//昵称
      })
      
    })
  },
  //填写评论
  onContentChange(e){
    this.setData({
      content:e.detail
    })
  },
  //更改星级
  onRateChange(e){
    this.setData({
      rate: e.detail
    })
  },
  //提交评论
  submit(){
    console.log(this.data.content)
    wx.showLoading({
      title: '评论中',
    })
    let promiseArr=[]
    for(var i=0;i<this.data.imgs.length;i++){
    promiseArr.push(new Promise((resolve,reject)=>{
      let item=this.data.imgs[i]
      let sffix=/\.\w+$/.exec(item)[0]
      wx.cloud.uploadFile({
        cloudPath: new Date().getTime()+sffix,
        filePath: item, // 文件路径
        success: res => {
          // get resource ID
          this.setData({
            fileId:this.data.fileId.concat(res.fileID)
          })
          resolve()
        },
        fail: err => {
          // handle error
        }
      })
    }))
    }
    Promise.all(promiseArr).then(res=>{
      
      db.collection('comment').add({
        data:{
          content:this.data.content,
          rate:this.data.rate,
          moveid:this.data.moveid,
          fileId:this.data.fileId,
          headImg:this.data.headImg,
          nickName:this.data.nickName

        }
      }).then(res=>{
        wx.hideLoading()
        this.getComment()
        this.setData({
          content:"",
          rate:5,
          imgs:[]
        })
        wx.showToast({
          title: '评论成功',
        })
        console.log(res)
      }).catch(err=>{
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '评论失败',
        })
      })
    })
  },
  //上传评论图片
  uploadImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        this.setData({
          imgs:this.data.imgs.concat(tempFilePaths)
        })
      }
    })


  },
  //获取用户评论
  getComment(){
    db.collection('comment').where({
        moveid: this.data.moveid
    }).get().then(res => {
      this.setData({
        commentArr:res.data
      })
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
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