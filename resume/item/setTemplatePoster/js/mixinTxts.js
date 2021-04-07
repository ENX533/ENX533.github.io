/*
 * @Author: MZx
 * @Date: 2020-05-20 14:40:03
 * @Last Modified by: MZx
 * @Last Modified time: 2020-06-12 11:08:08
 * @Description: 混合对象 文字相关
 */

var mixinTxts = {
  data: function () {
    return {
      canvasItemTxts: {}
    }
  },
  methods: {
    // 修改了文字
    // onChangeTxt: function (item, key) {
    //   var aLeftTxt = this.deepClone(this.aLeftTxt)
    //   aLeftTxt[key] = item
    //   this.aLeftTxt = aLeftTxt
    // },
    // 添加正文
    drawTxt: function (txt, initOptions) {
      // var aLeftTxt = this.deepClone(this.aLeftTxt)
      // aLeftTxt.unshift('添加正文')
      // this.aLeftTxt = aLeftTxt
      // this.$nextTick(function () {
      //   this.$refs['textarea-0'][0].focus()
      // })
      var _this = this
      var oTxt = new fabric.IText(txt, {
        tpIndex: 'tp-txt-' + _this.newTPIndex,
        top: 0,
        left: 0,
        opacity: 1,
        angle: 0,
        scaleX: 1,
        scaleY: 1,
        flipX: false, // 水平翻转
        flipY: false, // 垂直翻转
        fontSize: 30,
        fontWeight: 'normal', // 加粗 'normal', 'bold'
        fontStyle: 'normal', // 斜体 'normal', 'italic'
        // overline: false, // 上划线
        underline: false, // 下划线
        linethrough: false, // 删除线
        textAlign: 'left', // 'left', 'center', 'right'  "justify", "justify-left", "justify-center" or "justify-right"
        charSpacing: 0, // 字间距
        lineHeight: 1.16, // 行高 这是默认值
        fill: 'rgb(255,255,255)',
        // stroke: 'blue', // 文字描边效果
        // strokeWidth: 2, // 边框粗细

        // originX: 'center',
        // originY: 'center',
        borderOpacityWhenMoving: 1,
        padding: 10,
        borderDashArray: [3, 3], // 选中框虚线
        // borderDashArray: [6, 6], // 选中框虚线
        borderColor: '#fe484c', // 选中框颜色
        // borderColor: 'red', // 选中框颜色
        cornerColor: '#fe484c', // 角落块颜色
        // cornerColor: 'red', // 角落块颜色
        // cornerStrokeColor: '#fe484c',
        shadow: '2px 2px 20px rgba(0,0,0,0.5)',
        editingBorderColor: '#19a97b' // 编辑时边框颜色
      // cursorWidth: 4, // 输入位置的闪烁光标宽度，默认2
      // cornerSize: 20 // 控制的角的大小 默认13
      // preserveObjectStacking: true // 选中时保持层级不变为最高，没用
      })
      oTxt.set({
        top: (_this.canvasHeight - oTxt.height) / 2,
        left: (_this.canvasWidth - oTxt.width) / 2
      }).setCoords()
      if (initOptions) {
        oTxt.set(initOptions).setCoords()
      }
      // 存储数据
      // 层级记录添加
      _this.canvasItemZIndex.push(oTxt.tpIndex)
      oTxt.set({
        tpZIndex: _this.canvasItemZIndex.length - 1
      }).setCoords()
      var opt = _this.getOptionsFromCanvasItem({
        item: oTxt,
        type: 'txt'
      })
      _this.canvasItemTxts[oTxt.tpIndex] = {
        txt: txt,
        canvasEl: oTxt,
        opt: opt
      }
      _this.newTPIndex++
      // 绘制
      _this.initTxtEvent(oTxt)
      _this.canvas.add(oTxt)
      // oTxt.moveTo(_this.newTPIndex)
      _this.canvas.renderAll()
      // 选中
      if (!initOptions) {
        _this.canvas.setActiveObject(oTxt)
        oTxt.enterEditing()
        // console.log(txt)
        // console.log(txt.length)
        oTxt.setSelectionStart(txt.length)
        oTxt.setSelectionEnd(txt.length)
        // 操作记录
        _this.addActionRecord('txt', oTxt.tpIndex, 'add', '', '')
      }
    },
    initTxtEvent: function (oTxt) {
      var _this = this
      // 选中
      oTxt.on('selected', function () {
        //   // 层级 第一版不做 保留原有层级
        //   _this.bringToFront()
        //   _this.canvas.renderAll()
        // 右侧 编辑层
        _this.nowSelect = 'txt'
        _this.nowSelectIndex = oTxt.tpIndex
        _this.showRightSortControl = false
        _this.setRightEditData()
      })
      // 取消选中
      oTxt.on('deselected', function () {
        if (_this.justNowClickedSortControl) {
          _this.justNowClickedSortControl = false
        } else {
          _this.nowSelect = ''
          _this.nowSelectIndex = ''
          _this.showRightSortControl = false
        }
      })
      // 移动
      oTxt.on('moved', function () {
        _this.addActionRecord('txt', oTxt.tpIndex, 'move', {
          top: oTxt.top,
          left: oTxt.left
        }, {
          top: _this.canvasItemTxts[oTxt.tpIndex].opt.top,
          left: _this.canvasItemTxts[oTxt.tpIndex].opt.left
        })
        _this.canvasItemTxts[oTxt.tpIndex].opt.top = oTxt.top
        _this.canvasItemTxts[oTxt.tpIndex].opt.left = oTxt.left
      })
      // 缩放
      oTxt.on('scaling', function () {
        if (_this.nowFontSize * oTxt.scaleX < 10) {
          oTxt.scaleX = 10 / _this.nowFontSize
          return
        }
        _this.nowFontScaleX = oTxt.scaleX
      })
      oTxt.on('scaled', function () {
        // 操作记录
        _this.addActionRecord('txt', oTxt.tpIndex, 'scale', {
          top: oTxt.top,
          left: oTxt.left,
          scaleX: oTxt.scaleX,
          scaleY: oTxt.scaleY,
          flipX: oTxt.flipX,
          flipY: oTxt.flipY
        }, {
          top: _this.canvasItemTxts[oTxt.tpIndex].opt.top,
          left: _this.canvasItemTxts[oTxt.tpIndex].opt.left,
          scaleX: _this.canvasItemTxts[oTxt.tpIndex].opt.scaleX,
          scaleY: _this.canvasItemTxts[oTxt.tpIndex].opt.scaleY,
          flipX: _this.canvasItemTxts[oTxt.tpIndex].opt.flipX,
          flipY: _this.canvasItemTxts[oTxt.tpIndex].opt.flipY
        })

        _this.canvasItemTxts[oTxt.tpIndex].opt.top = oTxt.top
        _this.canvasItemTxts[oTxt.tpIndex].opt.left = oTxt.left
        _this.canvasItemTxts[oTxt.tpIndex].opt.scaleX = oTxt.scaleX
        _this.nowFontScaleX = oTxt.scaleX
        _this.canvasItemTxts[oTxt.tpIndex].opt.scaleY = oTxt.scaleY
        _this.canvasItemTxts[oTxt.tpIndex].opt.flipX = oTxt.flipX
        _this.canvasItemTxts[oTxt.tpIndex].opt.flipY = oTxt.flipY
      })
      // 旋转
      oTxt.on('rotated', function () {
        // 操作记录
        _this.addActionRecord('txt', oTxt.tpIndex, 'rotate', {
          top: oTxt.top,
          left: oTxt.left,
          angle: oTxt.angle
        }, {
          top: _this.canvasItemTxts[oTxt.tpIndex].opt.top,
          left: _this.canvasItemTxts[oTxt.tpIndex].opt.left,
          angle: _this.canvasItemTxts[oTxt.tpIndex].opt.angle
        })

        _this.canvasItemTxts[oTxt.tpIndex].opt.top = oTxt.top
        _this.canvasItemTxts[oTxt.tpIndex].opt.left = oTxt.left
        _this.canvasItemTxts[oTxt.tpIndex].opt.angle = oTxt.angle
      })
      // 退出编辑
      oTxt.on('editing:exited', function () {
        if (!oTxt.text) {
          // 相当于删除操作
          _this.removeTxt(oTxt.tpIndex)
          return
        }
        if (
          _this.canvasItemTxts[oTxt.tpIndex] &&
          _this.canvasItemTxts[oTxt.tpIndex].txt !== oTxt.text
        ) {
          // 操作记录
          _this.addActionRecord('txt', oTxt.tpIndex, 'edit', oTxt.text, _this.canvasItemTxts[oTxt.tpIndex].txt)
          _this.canvasItemTxts[oTxt.tpIndex].txt = oTxt.text
        }
      })
    },
    // 删除文字
    removeTxt: function (tpIndex) {
      var _this = this
      if (!tpIndex || !_this.canvasItemTxts[tpIndex]) return
      // 操作记录
      _this.addActionRecord('txt', tpIndex, 'remove', '', _this.canvasItemTxts[tpIndex].txt)
      // 备份数据
      _this.aHadRmovedElem[tpIndex] = _this.canvasItemTxts[tpIndex]
      delete _this.canvasItemTxts[tpIndex]
      // 层级记录删除
      _this.canvasItemZIndex.splice(_this.canvasItemZIndex.indexOf(tpIndex), 1)
      // 删除画布
      _this.aHadRmovedElem[tpIndex].canvasEl.exitEditing()
      _this.canvas.renderAll()
      _this.canvas.remove(_this.aHadRmovedElem[tpIndex].canvasEl)
      _this.canvas.renderAll()
    }
  }
}
