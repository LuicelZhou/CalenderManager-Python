Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    todoToday: [],
    listLength: 0,
    todoNum: 0, //数量
    eventIndex: 0, //记录在itemlist中位置
    selecting: 0,
    watchingdate: "",
    itemList:[]
    // itemList: [{
    //   // id: '',
    //   // year: 0,
    //   // month: 0,
    //   // date: 0,
    //   // level: 0, //优先级，0为低级，1为中级，2为高级
    //   // title: '',
    //   // detail: ''
    // }],
  },
  onLoad: function() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.dateInit();
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate()
    });
    this.setData({
      watchingdate: "" + year + "-" + month + "-" + now.getDate()
    })

    const db = wx.cloud.database();
    const _ = db.command;
    var ll = [];
    let i = 0;
    db.collection('list').get({
      success: function(res) {
        while (i < res.data.length) {
          let l = {
            id: res.data[i]._id,
            year: res.data[i].year,
            month: res.data[i].month,
            date: res.data[i].date,
            title: res.data[i].title,
            detail: res.data[i].detail,
            level: res.data[i].level
          }
          ll=ll.concat(l);
          i++;
        }       
      },
      complete:()=>{
        this.setData({
          itemList: ll
        });
        this.data.listLength = (this.data.itemList.length == 1 && this.data.itemList[0].title == '') ? 0 : this.data.itemList.length;
        var d=new Date();
        this.inittodo(d.getDate(),d.getMonth()+1,d.getFullYear());
        this.setData({todoToday: this.data.todoToday});
      }
    })
    
    
    this.setData({
      itemList: this.data.itemList
    });
  },
  onShow: function(o) {
    let t = this.data.todoToday;
    this.setData({
      todoToday: t
    });
  },

  dateInit: function(setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay(); //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  /**
   * 上月切换
   */
  lastMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  /**
   * 下月切换
   */
  nextMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  /*查看活动*/
  showEvents: function(e) {
    this.data.todoNum = 0;
    this.data.todoToday = [];
    this.setData({
      todoNum: this.data.todoNum,
      todoToday: this.data.todoToday
    })
    let dset = e.currentTarget.dataset;
    let year = dset.year;
    let month = dset.month;
    let date = dset.datenum;
    // let ls = this.data.itemList;
    this.inittodo(date,month,year);
    // let obj = {};
    // let j = 0;
    // for (let i = 0; i < this.data.listLength; i++) {
    //   if (ls[i].year == year && ls[i].month == month && ls[i].date == date) {
    //     obj = {
    //       title: ls[i].title,
    //       detail: ls[i].detail,
    //       year: ls[i].year,
    //       month: ls[i].month,
    //       date: ls[i].date,
    //       level: ls[i].level,
    //       eventIndex: i
    //     }
    //     this.data.todoNum++;
    //     this.data.todoToday[j] = obj;
    //     this.setData({
    //       todoToday: this.data.todoToday,
    //       todoNum: this.data.todoNum,
    //       watchingdate: "" + year + "-" + month + "-" + date
    //     });
    //     j++;
    //   }
    // }
  },
  inittodo:function(date,month,year){
    let j=0;
    let ls = this.data.itemList;
    let obj={};
    for (let i = 0; i < this.data.itemList.length; i++) {
      console.log(ls[i].year , year , ls[i].month , month , ls[i].date , date)
      if (ls[i].year == year && ls[i].month == month && ls[i].date == date) {
        obj = {
          title: ls[i].title,
          detail: ls[i].detail,
          year: ls[i].year,
          month: ls[i].month,
          date: ls[i].date,
          level: ls[i].level,
          eventIndex: i
        }
        console.log(obj)
        this.data.todoNum++;
        this.data.todoToday[j] = obj;
        this.setData({
          todoToday: this.data.todoToday,
          todoNum: this.data.todoNum,
          watchingdate: "" + year + "-" + month + "-" + date
        });
        j++;
      }
    }
  },



  //显示细节
  showDetail: function(e) {
    let todoIndex = e.currentTarget.dataset.index;
    this.setData({
      selecting: todoIndex
    });
    wx.navigateTo({  
      url: '../detail/detail',
    })
  },

  //添加新任务
  addEvents: function() {
    wx.navigateTo({
      url: '../setevents/setevents',
    })
  },

  delEvent: function(e) {
    let listl = this.data.todoNum;
    let iteml = this.data.listLength;
    let delIndex = e.currentTarget.dataset.index;
    let delList = this.data.todoToday[delIndex].eventIndex;
    let todoobj = [];
    let itemojb = [];
    let i = 0;
    let me = this;
    let clouddel = this.data.itemList[delList].id;
    //console.log(this.data.todoNum);



    wx.showModal({
      title: '删除',
      content: '确定要删除该事项？',
      showCancel: true,
      cancelText: "否",
      confirmText: "是",
      success: function(res) {
        if (res.cancel) {} else {
          for (i = delIndex; i < (listl - 1); i++) {
            me.data.todoToday[i] = me.data.todoToday[i + 1];
            me.data.todoToday[i].eventIndex--;
          }
          for (i = delList; i < (iteml - 1); i++) me.data.itemList[i] = me.data.itemList[i + 1];
          me.data.todoNum--;
          me.data.listLength--;
          me.data.todoToday.pop();
          me.data.itemList.pop();
          me.setData({
            todoToday: me.data.todoToday,
            itemList: me.data.itemList,
            todoNum: me.data.todoNum,
            listLength: me.data.listLength
          })
        }
      }
    })

    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('list').doc(clouddel).remove({
      success: function (res) {
        console.log(res.data)
      }
    })
  },

})