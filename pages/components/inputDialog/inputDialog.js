// pages/components/inputDialog/inputDialog.js
Component({
  properties: {
    modalHidden: {
      type: Boolean,
      value: true
    }, //这里定义了modalHidden属性，属性值可以在组件使用时指定.写法为modal-hidden  
    tipMsg: {
      type: String,
      value: ' ',
    },
    title: {
      type: String,
      value: ' ',
    },
    noInput:{
      type:Boolean,
      value:false
    }
  },
  data: {
    // 这里是一些组件内部数据  
    inputText: ''
  },
  methods: {
    // 这里放置自定义方法  
    /**
     * 弹出框蒙层截断touchmove事件
     */
    _preventTouchMove: function () {
      this.triggerEvent("move");
    },
    Cancel: function () {
      this.triggerEvent("ret", { value: 'Cancel' });
      this.setData({
        modalHidden: true,
        inputText: ''
      })
    },
    // 确定  
    Ok: function () {
      this.triggerEvent("ret", { value: 'Ok' });
      this.setData({
        modalHidden: true,
        inputText: ''
      })
    },
    _inputChange:function(e){
      this.triggerEvent("input", { value: e.detail.value});
    }
  }
})