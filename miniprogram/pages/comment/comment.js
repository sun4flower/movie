// pages/comment/comment.js
const db = wx.cloud.database()
//console.log(db)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:[],
    content:"",
    rate:5,
    imgs:[],
    fileId:[],
    moveid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      moveid: options.movieid
    })
    wx.cloud.callFunction({
      name:"getDetail",
      data:{
        moveid: options.movieid
      }
    }).then(res=>{
      this.setData({
        detail:JSON.parse(res.result)
      })
      console.log(JSON.parse(res.result))
    }).catch(res=>{
      console.log(res)
    })
    this.getComment()
  },
  onContentChange(e){
    this.setData({
      content:e.detail
    })
  },
  onRateChange(e){
    this.setData({
      rate: e.detail
    })
  },
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
          console.log(res.fileID)
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
          fileId:this.data.fileId

        }
      }).then(res=>{
        wx.hideLoading()
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
  uploadImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        this.setData({
          imgs:this.data.imgs.concat(tempFilePaths)
        })
      }
    })


  },
  getComment(){
    console.log(888)
    db.collection('comment').where({
        moveid: this.data.moveid
    }).get().then(res => {
      console.log(res)
    }).catch(err => {
      
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