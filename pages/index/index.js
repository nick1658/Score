Page({
  data: {
    calc: {},
    tapped: {},
    scoreArray: [],
    multiIndex: [0, 0, 0, 0],
    multiArray: [
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], 
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], 
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], 
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], 
    ]
  },
  btnClicked: function (e) {
    const length = this.data.scoreArray.length;
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    this.data.scoreArray = [{ id: length+1, 
      P1: data.multiArray[0][data.multiIndex[0]],
      P2: data.multiArray[1][data.multiIndex[1]], 
      P3: data.multiArray[2][data.multiIndex[2]], 
      P4: data.multiArray[3][data.multiIndex[3]], }].concat(this.data.scoreArray)
    this.setData({
      scoreArray: this.data.scoreArray
    })

    wx.setStorageSync('scorelogs', this.data.scoreArray)
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
    var tapped = { [code]: 'active' }
    this.setData({ tapped: tapped })
  },
  btnTouchEnd: function (e) {
    var code = e.target.dataset.op
    var tapped = {}
    this.setData({ tapped: tapped })
  },
  getScorelogs: function () {
    var storageData
    storageData = wx.getStorageSync('scorelogs')
    console.log('读取历史数据', 'storageData值为', storageData);
    this.setData({ scoreArray: storageData})
    if (storageData === "") {
      this.setData({
        'dialog.hidden': false,
        'dialog.title': '读取数据失败',
        'dialog.content': '找不到 key 对应的数据'
      })
    } else {
      this.setData({
        'dialog.hidden': false,
        'dialog.title': '读取数据成功',
        'dialog.content': "data: '" + storageData + "'"
      })
    }
  }
})