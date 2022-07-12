// pages/index/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state:'paused',  //状态
    play:{
        title:'歌曲名称',
        singer:'演唱',
        coverImgUrl:'',
        currentTime:'00:00',
        duration:'00:00',
        percent:0 
    },
    
    musicList:[
      {
        id:1,
        filename:'西楼别序',
        singer:'尹昔眠',
        src:'https://www.ytmp3.cn/down/74271.mp3',
        coverImgUrl:'https://img3.kuwo.cn/star/albumcover/500/81/18/1113153742.jpg'
      },
      {
        id:2,
        filename:'辞九门回忆',
        singer:'等什么君',
        src:'https://www.ytmp3.cn/down/60150.mp3',
        coverImgUrl:'https://img2.kuwo.cn/star/albumcover/500/45/81/3049437906.jpg'
      }
    ],

    item:0,          //页面发生改变
    tab:0,           //页面
    bannerList:[],   //轮播图
    topList:[],      //TOP歌曲
    recommendList:[],//推荐数据 
    mvList:[],       //MV
    click:false,
    exit:false
  },

  // 自定义方法

  //点击顶部(音乐/助眠/听书)时获取-响应
  changeItem:function(e){
    // console.log(e);
    this.setData({ 
      item : e.target.dataset.item
    })
  },
  //滑动Tap时获取-响应
  changeTab:function(e){
    // console.log(e);
    this.setData({ 
      tab : e.detail.current
    })
    // console.log(this.data.tab)
  },
  //点击跳转
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
      success: (res) => {
        // console.log(跳转成功)
      }
    })
  },
  //轮播图获取
  getBanner(){
    wx.request({
      url: 'http://m.kugou.com/?json=true',
      method:'GET',
      success:(res)=>{
        // console.log(res);
        this.setData({
          bannerList : res.data.banner
        })
        // console.log(this.data.bannerList);
      }
    })
  },
  //Top获取
  getTop(){
    wx.request({
      url: 'http://m.kugou.com/rank/info/?rankid=8888&page=1&json=truerl',
      method:'GET',
      success:(res)=>{
        // console.log(res);
        // console.log(res.data.songs.list);
        this.setData({
          topList : res.data.songs.list.splice(0,3)
        })
        // console.log(this.data.topList);
      }
    })
  },

  //推荐获取
  getRecommend(){
    wx.request({
      // url: 'http://m.kugou.com/plist/index&json=true',
      // url:'http://mobilecdnbj.kugou.com/api/v5/special/recommend?recommend_expire=0&sign=52186982747e1404d426fa3f2a1e8ee4&plat=0&uid=0&version=9108&page=1&area_code=1&appid=1005&mid=286974383886022203545511837994020015101&_t=1545746286',
      url:'http://23.224.99.235:16961/recommend',
      method:'GET',
      success:(res)=>{
        // console.log(res);
        res.recommendList
        this.setData({
          // recommendList : res.data.plist.list.info.splice(0,6)
          recommendList : res.data.data.list.splice(0,6), 
        })
        // console.log(this.data.recommendList);
        // console.log(this.data.recommendList[0].imgurl);
      }
    })
  },

  //MV获取
  getMv(){
    wx.request({
      url: 'http://mobilecdnbj.kugou.com/api/v3/singer/mv?singername=%E9%A3%8E%E5%B0%8F%E7%AD%9D&pagesize=20&singerid=86747',
      method:'GET',
      success:(res)=>{
        // console.log(res);
        this.setData({
          mvList : res.data.data.info.splice(0,4)
        })
        // console.log(this.data.mvList);
      }
    })
  },

  //歌曲获取
  getMusic:function(){
    wx.request({
      url:'http://23.224.99.235:16961/musicList',
      method:'GET',
      success:(res)=>{
        // console.log(res);
        this.setData({
          // musicList : res.data.data.info
        })
        console.log(this.data.musicList);
      }
    })
  },

  // setMusic
  setMusic:function(index){
    var music = this.data.musicList[index]
    // console.log(this.data.musicList[0])
    this.audioCtx.src = music.src
    this.setData({
      playIndex:index,
      'play.title':music.filename,
      'play.singer':music.singer,
      'play.coverImgUrl':music.coverImgUrl,
      'play.currenTime':'00:00',
      'play.duration':'00:00',
      'play.percent':0
    })
  },
  pList(){
    this.setData({
      click:true
    })
  },
  exit(){
    this.setData({exit:true})
    console.log(this.data.exit)
  },
  close(){
    this.setData({click:false,exit:false})
  },
  // 播放按钮
  pPlay: function() {
    this.audioCtx.play()
    this.setData({
      state: 'running'
    })
  },
  // 暂停按钮
  pPause: function() {
    this.audioCtx.pause()
    this.setData({
      state: 'paused'
    })
  },
  // 下一曲按钮
  pNext: function() {
    var index = this.data.playIndex >= this.data.musicList.length - 1 ? 0 : this.data.playIndex + 1
    this.setMusic(index)
    if (this.data.state === 'running') {
      this.pPlay()
    }
  },
  // 播放列表换曲功能
  change: function(e) {
    this.setMusic(e.currentTarget.dataset.index)
    this.pPlay()
  },

  playPage(){
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取banner图
    this.getBanner();
    //获取Top歌曲
    this.getTop();
    //获取推荐板块
    this.getRecommend();
    // 获取Mv板块
    this.getMv();
    // 获取音乐
    this.getMusic();
    
      console.log(options);
      this.data.musicList.push(options)
      this.setData({
        musicList : this.data.musicList,
      })
    
    
  },  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  audioCtx: null,
  onReady: function () {
    this.audioCtx = wx.createInnerAudioContext()
    // 默认选择第1曲
    this.setMusic(0);
    var that = this;
    // 播放进度检测
    this.audioCtx.onError(function() {
      console.log('播放失败：' + that.audioCtx.src)
    })
    // 播放完成自动换下一曲
    this.audioCtx.onEnded(function() {
      that.next()
    })
    // 自动更新播放进度
    this.audioCtx.onPlay(function() {})
    this.audioCtx.onTimeUpdate(function() {
      that.setData({
        'play.duration': formatTime(that.audioCtx.duration),
        'play.currentTime': formatTime(that.audioCtx.currentTime),
        'play.percent': that.audioCtx.currentTime / that.audioCtx.duration * 100
      })
    })
    // 格式化时间
    function formatTime(time) {
      var minute = Math.floor(time / 60) % 60;
      var second = Math.floor(time) % 60
      return (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
    }
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
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
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