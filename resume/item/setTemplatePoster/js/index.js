/*
 * @Author: MZx
 * @Date: 2020-05-19 9:52:41
 * @Last Modified by: MZx
 * @Last Modified time: 2020-06-12 15:46:55
 * @Description: 页面Vue对象
 */

(function () {
  new Vue({
    el: '#template-poster-add',
    computed: {
    },
    mixins: [
      mixinTopControls,

      mixinLeftMenu,

      mixinCanvasBg,
      mixinTxts,
      mixinImgs,

      mixinRightForm
    ],
    data: function () {
      return {
        aliossHost: phpTemplatePosterData.aliossHost,
        data: phpTemplatePosterData.data
      }
    },
    methods: {
      // 深度克隆
      deepClone: function (target) {
        // 定义一个变量
        let result;
        // 如果当前需要深拷贝的是一个对象的话
        if (typeof target === 'object') {
          // 如果是一个数组的话
          if (Array.isArray(target)) {
            result = []; // 将result赋值为一个数组，并且执行遍历
            for (let i in target) {
              // 递归克隆数组中的每一项
              result.push(this.deepClone(target[i]))
            }
            // 判断如果当前的值是null的话；直接赋值为null
          } else if(target === null) {
            result = null;
            // 判断如果当前的值是一个RegExp对象的话，直接赋值
          } else if(target.constructor === RegExp){
            result = target;
          } else {
            // 否则是普通对象，直接for in循环，递归赋值对象的所有值
            result = {};
            for (let i in target) {
              result[i] = this.deepClone(target[i]);
            }
          }
        // 如果不是对象的话，就是基本数据类型，那么直接赋值
        } else {
          result = target;
        }
        // 返回最终结果
        return result;
      },
      // 设置窗口高度 顺便去掉自带的头部
      setWindowHeight: function () {
        Array.prototype.slice.call(window.parent.document.getElementsByTagName('iframe')).forEach(function (item) {
          if (item.src.indexOf('poster_template/setTemplate') > -1) {
            if (item.parentNode.parentNode.getElementsByClassName('layui-layer-title')[0].style.display === 'none') return
            item.parentNode.parentNode.style.position = 'fixed';
            item.parentNode.parentNode.style.top = 0;
            item.parentNode.parentNode.style.left = 0;
            item.parentNode.parentNode.getElementsByClassName('layui-layer-title')[0].style.display = 'none';
            item.parentNode.parentNode.getElementsByClassName('layui-layer-setwin')[0].style.display = 'none';
            item.style.height = parseInt(item.style.height) + 43 + 'px';
          }
        })
      },
      // 页面滚动的问题
      windowScroll: function () {
        // console.log(document.documentElement.scrollTop)
        if (this.nowSelectIndex) document.documentElement.scrollTop = 0
      },
      // 监听当前页面按键事件
      docPressKey: function (e) {
        var _this = this
        // 发现用户按下了'delete'键
        if (e.keyCode === 46) {
          if (!_this.canvas) return
          var canvasElem = _this.canvas.getActiveObject()
          if (!canvasElem) return
          // 当前画布有选中的元素
          if (canvasElem.tpIndex.indexOf('tp-img-') === 0) {
            // 选中的是图片，删除
            _this.removeImg()
          } else if (canvasElem.tpIndex.indexOf('tp-txt-') === 0 && !canvasElem.isEditing) {
            // 选中的是不在编辑状态的文字，删除
            _this.removeTxt(canvasElem.tpIndex)
          }
        }
      }
    },
    mounted: async function () {
      // var _this = this;
      this.setWindowHeight()

      // 初始化画布
      this.initCanvas();
      this.drawByData();

      // 事件
      // 取消选中画布元素
      document.removeEventListener('click', this.nowSelectNothing)
      document.addEventListener('click', this.nowSelectNothing)
      // 配合range记录操作历史
      document.removeEventListener('mouseup', this.rangeMouseUp)
      document.addEventListener('mouseup', this.rangeMouseUp)
      // 画布里文字换行时页面不滚动
      window.removeEventListener('scroll', this.windowScroll)
      window.addEventListener('scroll', this.windowScroll)
      // 选中画布元素后按删除键
      document.removeEventListener('keydown', this.docPressKey)
      document.addEventListener('keydown', this.docPressKey)
      // 初始化表单
      this.initRightTxtColorPick();
    }
  });
})();
