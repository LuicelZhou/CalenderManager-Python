// pages/setevents/setevents.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curdate: [],
    todoToday: [],
    newdate: 0,
    newmonth: 0,
    newyear: 0,
    newlevel: 0,
    newtitle: "",
    newdetail: "",
    level: [{ id: 0, val: "低优先级" }, { id: 1, val: "中优先级" }, { id: 2, val: "高优先级" }],
    idx: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let now=new Date();
    let day=now.getDate();
    let month=now.getMonth()+1;
    let year=now.getFullYear();
    this.data.newdate  = day;
    this.data.newmonth = month;
    this.data.newyear = year;

    this.setData({
      curdate: ""+year+"-"+month+"-"+day,
      newdate: this.data.newdate,
      newmonth: this.data.newmonth,
      newyear: this.data.newyear,
    })
  },

  inputLevel: function (e) {//更改优先级
    this.data.newlevel = parseInt(e.detail.value) ;
    this.setData({
      newlevel: this.data.newlevel
    });
  },

  inputTitle: function (e) {//输入标题
    this.data.newtitle = e.detail.value;
    this.setData({
      newtitle: this.data.newtitle
    });
  },

  inputDate: function (e){//输入日期
    this.data.curdate = e.detail.value;
    let cpydate = this.data.curdate.split("-");
    this.data.newyear=parseInt(cpydate[0]);
    this.data.newmonth = parseInt(cpydate[1]);
    this.data.newdate = parseInt(cpydate[2]);
    this.setData({
      newyear: this.data.newyear,
      newmonth: this.data.newmonth,
      newdate: this.data.newdate,
      curdate: e.detail.value
    });
  },

  inputDetail: function (e) {//输入备忘
    this.data.newdetail = e.detail.value;
    this.setData({
      newdetail: this.data.newdetail
    });
  },

  save: function (e) {
    if (this.data.newtitle == "") {
      wx.showToast({
        title: "标题不能为空",
        icon: "none"
      });
      return;
    }
    let pages = getCurrentPages();
    let prev = pages[pages.length - 2];
    let todoIndex = prev.data.todoNum;
    let listIndex;
    if (prev.data.itemList.length == 1 && prev.data.itemList[0].date == 0) listIndex=0;//itemlist初始长度为1
    else listIndex=prev.data.itemList.length;
    let id = this.data.newtitle + "" + listIndex;//
    let obj = {
      id: id,//
      year: this.data.newyear,
      month: this.data.newmonth,
      date: this.data.newdate,
      level: this.data.newlevel, 
      title: this.data.newtitle,
      detail: this.data.newdetail,
    }
    if(prev.data.watchingdate == this.data.curdate){//编辑了当前选择的日期，更改todoToday
      let objinner = {
        title: this.data.newtitle,
        detail: this.data.newdetail,
        year: this.data.newyear,
        month: this.data.newmonth,
        date: this.data.newdate,
        level: this.data.newlevel,
        eventIndex: listIndex
      }
      prev.data.todoToday[todoIndex] = objinner; 
      prev.setData({
        todoNum: prev.data.todoNum + 1,
        todoToday: prev.data.todoToday,
      })
    }
    
    prev.data.itemList[listIndex] = obj;//改变itemList
    prev.setData({
      itemList: prev.data.itemList,
      listLength: prev.data.listLength + 1
    })

    this.savecloud(id, this.data.newyear, this.data.newmonth, this.data.newdate,this.data.newtitle, this.data.newdetail, this.data.newlevel);

    wx.navigateBack();
  },

  cancel: function (e) {
    wx.navigateBack();
  },

  savecloud: function (id,year,month,date,title,detail,level){
    //let savedate=""+year+"-"+month+"-"+day;
    wx.cloud.callFunction({
      name: 'add',
      data: {
        id: id,
        year: year,
        month: month,
        date: date,
        title: title,
        detail: detail,
        level: level
      },
      complete: res => {
        console.log('set callFunction test result: ', res)
      }
    })
  }

})