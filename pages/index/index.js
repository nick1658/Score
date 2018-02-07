Page({
  data: {
    players: ['峰', '莉', '肥', '老板'],
    tapped: {},
    scoreArray: [],
    scoreArrayCalc: [],
    doubled: [],
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
    const length = this.data.scoreArray.length;
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    var that = this;
    var isDataValid = 0;
    for (var i = 0; i < 4; ++i) {
      if (data.multiArray[i][data.multiIndex[i]] === 0) {
        isDataValid += 1;
        console.log(isDataValid);
      }
    }

    switch (isDataValid) {
      case 0:
        console.log("至少要有一位赢家");
        this.setData({
          'dialog.hidden': false,
          'dialog.title': '至少要有一位赢家',
          //'dialog.content': "请重新设置分数"
        })
        break;
      case 1:
        console.log("合理的数据");
        break;
      case 2:
      case 3:
      case 4:
        console.log("最多只能有一位赢家");
        this.setData({
          'dialog.hidden': false,
          'dialog.title': '最多只能有一位赢家',
          //'dialog.content': "请重新设置分数"
        })
        break;
      default:
        console.log("default");
    }
    if (isDataValid === 1){
      var p = [];
      p[0] = data.multiArray[0][data.multiIndex[0]];
      p[1] = data.multiArray[1][data.multiIndex[1]];
      p[2] = data.multiArray[2][data.multiIndex[2]];
      p[3] = data.multiArray[3][data.multiIndex[3]];
      this.data.scoreArray.push({
        id: length + 1,
        P1: p[0],
        P2: p[1],
        P3: p[2],
        P4: p[3]
      })
      var doubled = -1;
      for (var i = 0; i < 4; ++i){
        if (p[i] < 8) {

        }else if (p[i] < 10) {
          p[i] *= 2;
        } else if (p[i] < 13) {
          p[i] *= 3;
        }else{
          p[i] *= 4;
        }
        if (this.data.radioItems[i].beChecked === true) {
          p[i] *= 2;
          doubled = i;
        }
      }
      this.data.scoreArrayCalc.push({
        id: length + 1,
        P1: p[0],
        P2: p[1],
        P3: p[2],
        P4: p[3],
        X2: doubled
      })

      var length_new = this.data.scoreArray.length;
      console.log ("当前数据长度" + length_new);
      console.log (doubled)
      for (var i = 0; i < 4; ++i)
      {
        this.data.totalScore[i] += p[i]
      }
      this.data.totalMoney[0] = (this.data.totalScore[1] + 
        this.data.totalScore[2] + 
        this.data.totalScore[3]) - this.data.totalScore[0] * 3;

      this.data.totalMoney[1] = (this.data.totalScore[0] +
        this.data.totalScore[2] +
        this.data.totalScore[3]) - this.data.totalScore[1] * 3;

      this.data.totalMoney[2] = (this.data.totalScore[0] +
        this.data.totalScore[1] +
        this.data.totalScore[3]) - this.data.totalScore[2] * 3;

      this.data.totalMoney[3] = (this.data.totalScore[0] +
        this.data.totalScore[1] +
        this.data.totalScore[2]) - this.data.totalScore[3] * 3;

      for (var i = 0; i < 4; ++i) {
        this.data.totalMoney[i] /= 10;
      }
      this.resetData ()
      this.setData({
        totalMoney: this.data.totalMoney,
        totalScore: this.data.totalScore,
        scoreArray: this.data.scoreArray,
        scoreArrayCalc: this.data.scoreArrayCalc,
      })
      setTimeout(function () {
        that.setData({
          scrollTop: 99999
        });
      }, 0)
      wx.setStorageSync('scorelogs', this.data.scoreArray)
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
  getScorelogs: function () {
    var storageData
    var that = this;
    storageData = wx.getStorageSync('scorelogs')
    console.log('读取历史数据', 'storageData值为', storageData);
    if (storageData === "") {
      this.setData({
        'dialog.hidden': false,
        'dialog.title': '提示',
        'dialog.content': '没有历史分数'
      })
    } else {
      this.setData({
        scoreArray: storageData,
        'dialog.hidden': false,
        'dialog.title': '读取数据成功',
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
  radioChange: function (e) {
    var checked = e.detail.value
    var changed = {}
    console.log(e)
    for (var i = 0; i < this.data.radioItems.length; i++) {
      if (checked.indexOf(this.data.radioItems[i].name) !== -1) {
        changed['radioItems[' + i + '].checked'] = true
      } else {
        changed['radioItems[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
    //console.log (changed)
  },
  radioTouched: function (e) {
    var checked = e.target.id
    var changed = {}

    for (var i = 0; i < this.data.radioItems.length; i++) {
      //console.log(this.data.radioItems[i].beChecked + '--' + i)
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

      //console.log(i + '--' + this.data.radioItems[i].beChecked)
    }
    this.setData(changed)
    //console.log(changed)
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
  clearStorage: function () {
    wx.clearStorageSync()
  },
})