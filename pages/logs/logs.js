//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map((log) => { 
        return util.formatTime(new Date(log))
      })
    })
    //console.log(util.formatTime(new Date(1417992924009)));
  }
})
