// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [], //搜索数据存放位置
    keyword: '',    //搜索关键字
    click: false,   //未点击
    newList:[],     //新歌列表
    historyList:[],   //搜索历史
    hash:'',
    play:{
      id:'',
      filename:'',
      singer:'',
      src:'',
      coverImgUrl:''
    }
  },

  //获取输入搜索框的文本
  getWord(e) {
    // console.log(e);
    this.setData({
      keyword: e.detail.value
    })
    // console.log(this.data.keyword);

    //判断搜索框是否为空，空则不继续显示搜索列表
    if(this.data.keyword==''){
      this.setData({
        click:false
      })
    }
  },

  //点击搜索
  search() {
    //判断输入框中是否为空,空则提示,不是则请求
    if (this.data.keyword != '') {
      wx.request({
        url: 'http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=' + this.data.keyword,
        method: 'GET',
        success: (res) => {
          // console.log(res);
          // 记录搜索
          // 记录6条记录,如果大于6条记录将大于6条的旧搜索删除
          if(this.data.historyList.length < 7){
            this.data.historyList.unshift(this.data.keyword);
          }else{
            this.data.historyList.pop(this.data.keyword)
          }

          this.setData({
            searchList: res.data.data.info,
            click: true,
            historyList : this.data.historyList
          })
          // console.log(this.data.searchList);
          // console.log(this.data.click);
          // console.log(this.data.historyList);
        }
      })
    } else {
      //空则提示
      wx.showToast({
        icon:'error',
        title: '请输入关键字',
      })
    }

  },

  //清楚历史记录
  clearHistory(){
    this.setData({
      historyList : []
    })
  },

  listen(e){
    console.log('listen')
    // console.log(e)
    // console.log(this.data.searchList[e.currentTarget.dataset.index].hash)
    this.setData({
      hash:this.data.searchList[e.currentTarget.dataset.index].hash,
    })
    wx.request({
      url: 'http://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash='+this.data.hash,
      success:(res)=>{
        console.log(res)
        // console.log(res.data.backup_url[0])
        // console.log(res.data.backup_url);
        // console.log(this.data.play.coverImgUrl)
        this.data.play.coverImgUrl = res.data.album_img
        this.data.play.coverImgUrl = this.data.play.coverImgUrl.replace('{size}/','')
        console.log(this.data.play.coverImgUrl)
        this.setData({
          'play.id' : JSON.parse(res.data.audio_id),
          'play.singer' : res.data.author_name,
          'play.filename' : res.data.fileName,
          'play.src' : res.data.backup_url[0],
          'play.coverImgurl': res.data.album_img
        })
        // console.log(this.data.singer+'|'+this.data.filename)
        // console.log(this.data.play.id)
        wx.navigateTo({
          // url:'/pages/index/index?play='+this.data.p
          url: '/pages/index/index?id='+this.data.play.id+'&filename='+this.data.play.filename+'&singer='+this.data.play.singer+'&src='+this.data.play.src+'&coverImgUrl='+this.data.play.coverImgUrl,
          // 测试： title=傅梦彤 - 潮汐 (Natural)&singer=傅梦彤&src=https://sharefs.tx.kugou.com/202207091055/75db08415b9435e7657aa57889b6abba/KGTX/CLTX001/72d3f4bdf8379f60c7563900d3e0080e.mp3
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url:'http://m.kugou.com/?json=true',
      success:(res)=>{
        // console.log(res);
        this.setData({
          newList : res.data.data.slice(0,8)
        })
        // console.log(this.data.newList)
      }
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