// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    old: '',
    todoToday: [],
    newlevel: 0,
    newtitle: "",
    newdetail: "",
    level: [{ id: 0, val: "低优先级" }, { id: 1, val: "中优先级" }, { id: 2, val: "高优先级"}],
    idx: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages=getCurrentPages();
    let prev=pages[pages.length-2];
    let index = prev.data.selecting;//通过pages[getCurrentPages()-2]获取前一页元素；
    this.data.todoToday = prev.data.todoToday[index];
    this.setData({
      todoToday : this.data.todoToday
    });
    this.data.newdetail = this.data.todoToday.detail;
    this.data.newtitle = this.data.todoToday.title;
    this.data.newlevel = this.data.todoToday.level;
    this.setData({
      newlevel: this.data.newlevel,
      newtitle: this.data.newtitle,
      newdetail: this.data.newdetail
      
    });
    this.data.old=this.data.newtitle;
  },

  inputLevel: function(e){
    this.data.newlevel = e.detail.value;
    this.setData({
      newlevel: this.data.newlevel
    });
  },

  inputTitle: function(e){
    this.data.newtitle = e.detail.value;
    this.setData({
      newtitle: this.data.newtitle
    });
  },

  inputDetail: function(e){
    this.data.newdetail = e.detail.value;
    this.setData({
      newdetail: this.data.newdetail
    });
  },

  save: function (e){
    if(this.data.newtitle == ""){
      wx.showToast({
        title: "标题不能为空",
        icon: "none"
      });
      return;
    }
    let pages=getCurrentPages();
    let prev=pages[pages.length-2];
    let todoindex=prev.selecting;
    let listindex=this.data.todoToday.eventIndex;
    this.data.todoToday.title=this.data.newtitle;
    this.data.todoToday.detail = this.data.newdetail;
    this.data.todoToday.level = this.data.newlevel;

    let id = ""+prev.data.itemList[listindex].id;//

    prev.data.todoToday[todoindex] = this.data.todoToday;
    prev.data.itemList[listindex].detail = this.data.todoToday.detail;
    prev.data.itemList[listindex].title = this.data.todoToday.title;
    prev.data.itemList[listindex].level = this.data.todoToday.level;
    prev.setData({
      todoToday: prev.data.todoToday,
      itemList: prev.data.itemList
    });

    this.updatecloud(id,this.data.newtitle,this.data.newdetail,this.data.newlevel);

    wx.navigateBack();
  },

  cancel: function (e){
    wx.navigateBack();
  },

  updatecloud: function (id, title, detail, level) {
    // let savedate = "" + year + "-" + month + "-" + day;//ob72m5DCIexIPV-QV8NSF3CmlVTs
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('list').doc(id).update({
      data: {
        title: title,
        detail: detail,
        level: level
      }
    })
    // console.log(id);
    // wx.cloud.callFunction({
    //   name: 'edit',
    //   data: {
    //     _id: id,
    //     title: title,
    //     detail: detail,
    //     level: level
    //   },
    //   complete: res => {
    //     console.log('callFunction test result: ', res)
    //   }
    // })
  }

})