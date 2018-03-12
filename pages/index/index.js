const scoreCalc = require('../../utils/scoreCalc.js')

Page({
  data: {
    showModal: false,
    showModalConfirm:false,
    undoConfirm:false,
    chooseId:0,
    inputv:'',
    players: [{ id: 0, name: 'play0' }, { id: 1, name: 'play1' }, { id: 2, name: 'play2' }, { id: 3, name: 'play3' }],
    tapped: {},
    currentScore: [0, 0, 0, 0],
    currentMoney: [0, 0, 0, 0],
    scoreArray: [],
    scoreArrayCalc: [],
    totalScore: [0, 0, 0, 0],
    totalMoney: [0, 0, 0, 0],
    multiIndex: [0, 0, 0, 0],
    multiArray: [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 
    ],
    dialog: {
      title: '',
      content: '',
      hidden: true
    },
    radioItems: [
      { name: 'P1', value: '1', beChecked: false },
      { name: 'P2', value: '2', beChecked: false },
      { name: 'P3', value: '3', beChecked: false },
      { name: 'P4', value: '4', beChecked: false }
    ]
  },
  playerSet: function (e) {
    console.log (e)
  },
  btnClicked: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    var that = this;
    var doubled = -1;
    for (var i = 0; i < 4; ++i) {
      this.data.currentScore[i] = data.multiArray[i][data.multiIndex[i]]
      if (this.data.radioItems[i].beChecked === true) {
        doubled = i;
      }
    }
    this.data.currentScore[4] = doubled;
    this.data.currentScore[5] = this.data.scoreArray.length;

    if (scoreCalc.testObj(this.data) === true){
      this.resetData ()
      this.setData({
        totalMoney: this.data.totalMoney,
        totalScore: this.data.totalScore,
        scoreArray: this.data.scoreArray,
        scoreArrayCalc: this.data.scoreArrayCalc,
        dialog: this.data.dialog,
      })
      setTimeout(function () {
        that.setData({
          scrollTop: 99999
        });
      }, 0)
      wx.setStorageSync('scorelogs', this.data.scoreArray)
    }else{
      this.setData({
        dialog: this.data.dialog,
      })
    }
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  btnTouchStart: function (e) {
    var code = e.target.dataset.op
    console.log (e)
    var tapped = { [code]: 'active' }
    console.log(tapped[code])
    this.setData({ tapped: tapped })
  },
  btnTouchEnd: function (e) {
    var code = e.target.dataset.op
    var tapped = {}
    this.setData({ tapped: tapped })
  },
  //获取历史数据记录**************************************************
  getScorelogs: function () {
    var storageData
    var players
    var that = this;
    storageData = wx.getStorageSync('scorelogs')
    players = wx.getStorageSync('players')
    console.log('读取历史数据', 'storageData值为', storageData);
    console.log('读取历史数据', 'players值为', players);
    if (storageData === "") {
      this.setData({
        'dialog.hidden': false,
        'dialog.title': '提示',
        'dialog.content': '没有历史分数'
      })
    } else {
      var length = storageData.length
      for (var i = 0; i < length; i++){
        this.data.currentScore[0] = storageData[i].P1;
        this.data.currentScore[1] = storageData[i].P2;
        this.data.currentScore[2] = storageData[i].P3;
        this.data.currentScore[3] = storageData[i].P4;
        this.data.currentScore[4] = storageData[i].X2;
        this.data.currentScore[5] = i;
        //console.log(this.data.currentScore)
        scoreCalc.testObj(this.data)
      }
      if(players === ""){
        players = [{ id: 0, name: 'play0' }, { id: 1, name: 'play1' }, { id: 2, name: 'play2' }, { id: 3, name: 'play3' }]
      }
      this.setData({
        scoreArray: storageData,
        players:players,
        scoreArrayCalc: this.data.scoreArrayCalc,
        totalMoney: this.data.totalMoney,
        totalScore: this.data.totalScore,
        'dialog.hidden': false,
        'dialog.title': '读取历史记录成功',
        'dialog.content': "共有 " + storageData.length + " 条记录"
      })
      setTimeout(function () {
        that.setData({
          scrollTop: 99999
        });
      }, 0)
    }
  },
  confirm: function () {
    this.setData({
      'dialog.hidden': true,
      'dialog.title': '',
      'dialog.content': ''
    })
  },
  //radio 加倍选项响应函数*****************************************************
  radioTouched: function (e) {
    var checked = e.target.id
    var changed = {}

    for (var i = 0; i < this.data.radioItems.length; i++) {
      console.log(this.data.radioItems[i].beChecked + '--' + i)
      if (checked.indexOf(this.data.radioItems[i].name) !== -1) {
        if (this.data.radioItems[i].beChecked === false) {
          changed['radioItems[' + i + '].checked'] = true
          this.data.radioItems[i].beChecked = true
        }else{
          changed['radioItems[' + i + '].checked'] = false
          this.data.radioItems[i].beChecked = false
        }
      }else {
        changed['radioItems[' + i + '].checked'] = false
        this.data.radioItems[i].beChecked = false
      }

      console.log(i + '--' + this.data.radioItems[i].beChecked)
    }
    this.setData(changed)
    //console.log(changed)
  }, 
  preventD: function() {
  },
  resetData: function () {
    var changed = {}

    for (var i = 0; i < this.data.radioItems.length; i++) {
      if (this.data.radioItems[i].beChecked === true) {
         changed['radioItems[' + i + '].checked'] = false
         this.data.radioItems[i].beChecked = false
      }
    }
    this.setData(changed)
    this.setData({
      multiIndex: [0, 0, 0, 0],
    })
  },
  clearAll: function (e) {
    this.setData({
      showModalConfirm: true
    })
    //console.log(this.data.chooseId)
  },
  Undo: function (e) {
    if ((this.data.scoreArray.length > 0) && (this.data.scoreArrayCalc.length > 0)) {
      this.setData({
        undoConfirm: true
      })
    }
  },
  clearStorage: function () {
    wx.clearStorageSync()
  },
  onShareAppMessage: function () {
    return {
      title: '微信小程序',
      desc: '锄大地积分器',
      path: '/pages/index/index'
    }
  }, 
  onPullDownRefresh: function () {
    if (this.data.scoreArray.length === 0) {
      wx.showNavigationBarLoading() //在标题栏中显示加载
      console.log("refresh")
      this.getScorelogs();
    }
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 0);
  },
  /**
   * 弹窗
   */
  changeName : function (e){
    console.log (e.target.id)
    this.data.chooseId = e.target.id
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },

  inputChange:function (e) {
    this.setData({
      inputv: e.detail.value
    })
    //console.log(e.detail.value)
    //console.log(e)
  },
  inputDialogRet: function (e) {
    console.log(e)
    if (e.detail.value === "Ok") {
      var opId = e.currentTarget.id
      if (opId === "changeName") {
        console.log(this.data.chooseId)
        if (this.data.chooseId < 9) {
          this.data.players[this.data.chooseId].name = this.data.inputv
          wx.setStorageSync('players', this.data.players)
          this.setData({
            players: this.data.players
          })
        } else if (this.data.chooseId === 10) {
          this.setData({
            totalMoney: [0, 0, 0, 0],
            totalScore: [0, 0, 0, 0],
            scoreArray: [],
            scoreArrayCalc: []
          })
        }
      } else if (opId === "clearAll") {
        this.setData({
          totalMoney: [0, 0, 0, 0],
          totalScore: [0, 0, 0, 0],
          scoreArray: [],
          scoreArrayCalc: []
        })
      } else if (opId === "undo") {
        if ((this.data.scoreArray.length > 0) && (this.data.scoreArrayCalc.length > 0)) {
          this.data.scoreArray.pop()
          var scoreCalc = this.data.scoreArrayCalc.pop()
          if (scoreCalc === null)
            return;
          console.log(scoreCalc)
          this.data.currentScore[0] = scoreCalc.P1
          this.data.currentScore[1] = scoreCalc.P2
          this.data.currentScore[2] = scoreCalc.P3
          this.data.currentScore[3] = scoreCalc.P4
          for (var i = 0; i < 4; ++i) {
            this.data.totalScore[i] -= this.data.currentScore[i]
            this.data.currentMoney[i] = this.data.currentScore[(i + 1) % 4] +
              this.data.currentScore[(i + 2) % 4] +
              this.data.currentScore[(i + 3) % 4] -
              this.data.currentScore[i] * 3
            this.data.totalMoney[i] -= this.data.currentMoney[i]
          }
        }
        this.setData({
          scoreArray: this.data.scoreArray,
          scoreArrayCalc: this.data.scoreArrayCalc,
          totalMoney: this.data.totalMoney,
          totalScore: this.data.totalScore
        })
      }
    }
  }
})