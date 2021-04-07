/*
 * @Author: MZx
 * @Date: 2020-05-21 11:14:18
 * @Last Modified by: MZx
 * @Last Modified time: 2020-06-12 13:53:38
 * @Description: 混合对象 右边编辑层 表单的数据
 */

var mixinRightForm = {
  computed: {
    showFontSize: function () {
      return parseInt(this.nowFontSize * this.nowFontScaleX)
    },
    showFontLineHeight: function () {
      return parseInt(this.nowFontSize * this.nowFontScaleX * (this.nowFontLineHeight - 1))
    },
    showFontOpacity: function () {
      return parseInt(this.nowFontOpacity * 100) + '%'
    },
    showImgOpacity: function () {
      return parseInt(this.nowImgOpacity * 100) + '%'
    }
  },
  data: function () {
    return {
      newTPIndex: 1,

      nowSelect: '',
      nowSelectIndex: '',

      txtSettingConfig: {
        maxFontSize: 750 / 2,
        minFontSize: 10
      },
      nowFontSize: 60 / 2,
      nowFontScaleX: 1, // 配合显示字号的值
      nowFontColor: 'rgb(255,255,255)',
      nowFontWeight: '',
      nowFontStyle: '',
      nowFontUnderline: false,
      nowFontLinethrough: false,
      nowFontTextAlign: '',
      nowFontOpacity: 100,
      nowFontSpace: 0,
      nowFontLineHeight: 0,

      nowImgOpacity: 100,
      nowImgRadicus: 0,

      clickRange: '',
      clickRangeVal: '',
      saveNowTxtColor: '',
      saveNowTxtColorTpIndex: '',

      showRightSortControl: false,
      justNowClickedSortControl: false,
      nowZIndex: 0
    }
  },
  watch: {
    // txt 文字大小
    nowFontSize: function (val, oldVal) {
      if (this.nowSelect !== 'txt' || !this.nowSelectIndex) return
      this.canvasItemTxts[this.nowSelectIndex].canvasEl.set({
        fontSize: val
      })
      this.canvas.renderAll()
      this.canvasItemTxts[this.nowSelectIndex].opt.fontSize = this.canvasItemTxts[this.nowSelectIndex].canvasEl.fontSize
    },
    // txt color
    nowFontColor: function (val, oldVal) {
      if (this.nowSelect !== 'txt' || !this.nowSelectIndex) return
      this.canvasItemTxts[this.nowSelectIndex].canvasEl.set({
        fill: val
      })
      this.canvas.renderAll()
      this.canvasItemTxts[this.nowSelectIndex].opt.fill = this.canvasItemTxts[this.nowSelectIndex].canvasEl.fill
    },
    // txt 加粗
    nowFontWeight: function (val, oldVal) {
      if (this.nowSelect !== 'txt' || !this.nowSelectIndex) return
      this.canvasItemTxts[this.nowSelectIndex].canvasEl.set({
        fontWeight: val
      })
      this.canvas.renderAll()
      this.canvasItemTxts[this.nowSelectIndex].opt.fontWeight = this.canvasItemTxts[this.nowSelectIndex].canvasEl.fontWeight
    },
    // txt 斜体
    nowFontStyle: function (val, oldVal) {
      if (this.nowSelect !== 'txt' || !this.nowSelectIndex) return
      this.canvasItemTxts[this.nowSelectIndex].canvasEl.set({
        fontStyle: val
      })
      this.canvas.renderAll()
      this.canvasItemTxts[this.nowSelectIndex].opt.fontStyle = this.canvasItemTxts[this.nowSelectIndex].canvasEl.fontStyle
    },
    // txt 下划线
    nowFontUnderline: function (val, oldVal) {
      if (this.nowSelect !== 'txt' || !this.nowSelectIndex) return
      this.canvasItemTxts[this.nowSelectIndex].canvasEl.set({
        underline: val
      })
      this.canvas.renderAll()
      this.canvasItemTxts[this.nowSelectIndex].opt.underline = this.canvasItemTxts[this.nowSelectIndex].canvasEl.underline
    },
    // txt 删除线
    nowFontLinethrough: function (val, oldVal) {
      if (this.nowSelect !== 'txt' || !this.nowSelectIndex) return
      this.canvasItemTxts[this.nowSelectIndex].canvasEl.set({
        linethrough: val
      })
      this.canvas.renderAll()
      this.canvasItemTxts[this.nowSelectIndex].opt.linethrough = this.canvasItemTxts[this.nowSelectIndex].canvasEl.linethrough
    },
    // txt 水平对齐方式
    nowFontTextAlign: function (val, oldVal) {
      if (this.nowSelect !== 'txt' || !this.nowSelectIndex) return
      this.canvasItemTxts[this.nowSelectIndex].canvasEl.set({
        textAlign: val
      })
      this.canvas.renderAll()
      this.canvasItemTxts[this.nowSelectIndex].opt.textAlign = this.canvasItemTxts[this.nowSelectIndex].canvasEl.textAlign
    },
    // txt 不透明度 0-100
    nowFontOpacity: function (val, oldVal) {
      if (this.nowSelect !== 'txt' || !this.nowSelectIndex) return
      this.canvasItemTxts[this.nowSelectIndex].canvasEl.set({
        opacity: val // 0-1
      })
      this.canvas.renderAll()
      this.canvasItemTxts[this.nowSelectIndex].opt.opacity = this.canvasItemTxts[this.nowSelectIndex].canvasEl.opacity
    },
    // txt 字间距
    nowFontSpace: function (val, oldVal) {
      if (this.nowSelect !== 'txt' || !this.nowSelectIndex) return
      this.canvasItemTxts[this.nowSelectIndex].canvasEl.set({
        charSpacing: val
      })
      this.canvas.renderAll()
      this.canvasItemTxts[this.nowSelectIndex].opt.charSpacing = this.canvasItemTxts[this.nowSelectIndex].canvasEl.charSpacing
    },
    // txt 行间距
    nowFontLineHeight: function (val, oldVal) {
      if (this.nowSelect !== 'txt' || !this.nowSelectIndex) return
      this.canvasItemTxts[this.nowSelectIndex].canvasEl.set({
        lineHeight: val
      })
      this.canvas.renderAll()
      this.canvasItemTxts[this.nowSelectIndex].opt.lineHeight = this.canvasItemTxts[this.nowSelectIndex].canvasEl.lineHeight
    },
    // img 不透明度 0-100
    nowImgOpacity: function (val, oldVal) {
      if (this.nowSelect !== 'img' || !this.nowSelectIndex) return
      this.canvasItemImgs[this.nowSelectIndex].canvasEl.set({
        opacity: Number(val) // 0-1
      })
      this.canvas.renderAll()
      this.canvasItemImgs[this.nowSelectIndex].opt.opacity = this.canvasItemImgs[this.nowSelectIndex].canvasEl.opacity
    },
    // img 圆角 0-100px
    nowImgRadicus: function (val, oldVal) {
      if (this.nowSelect !== 'img' || !this.nowSelectIndex) return
      this.canvasItemImgs[this.nowSelectIndex].canvasEl.set({
        tpRadius: parseInt(val),
        clipPath: new fabric.Rect({ // 圆角
          top: 0,
          left: 0,
          originX: 'center',
          originY: 'center',
          width: this.canvasItemImgs[this.nowSelectIndex].canvasEl.width,
          height: this.canvasItemImgs[this.nowSelectIndex].canvasEl.height,
          rx: val, // 圆角半径
          ry: val // 圆角半径
        })
      })
      this.canvas.renderAll()
      this.canvasItemImgs[this.nowSelectIndex].opt.tpRadius = this.canvasItemImgs[this.nowSelectIndex].canvasEl.tpRadius
    },
    // txt/img z-index
    nowZIndex: function (val, oldVal) {
      var _this = this
      var obj = _this.nowSelectIndex.indexOf('tp-img-') === 0 ?
        _this.canvasItemImgs[_this.nowSelectIndex].canvasEl :
        _this.canvasItemTxts[_this.nowSelectIndex].canvasEl
      obj.moveTo(parseInt(val))
      // obj.set({
      //   'tpZIndex': parseInt(val)
      // }).setCoords()
      _this.canvasItemZIndex.splice(parseInt(val), 0, _this.canvasItemZIndex.splice(_this.canvasItemZIndex.indexOf(_this.nowSelectIndex), 1)[0])
      // console.log(_this.canvasItemZIndex)
      _this.repairCanvasItemsZIndex()
    }
  },
  methods: {
    // 初始化颜色拾取器
    initRightTxtColorPick: function () {
      var _this = this
      $('#picker').spectrum({
        color: '#ffffff',
        showPalette: true,
        palette: [
          // ['#ffffff', '#000000', '#807f80', '#cccccc', '#e53e35', '#ff4066'],
          // ['#ff706b', '#ff6619', '#ffb300', '#e69404', '#a2e82d', '#09af3a'],
          // ['#77cdb5', '#98d3fb', '#398def', '#aaa9d3', '#8873f6', '#c468f7']

          ['rgb(255,255,255)', 'rgb(0,0,0)', 'rgb(128,127,128)', 'rgb(204,204,204)', 'rgb(229,62,53)', 'rgb(255,64,102)'],
          ['rgb(255,112,107)', 'rgb(255,102,25)', 'rgb(255,179,0)', 'rgb(230,148,4)', 'rgb(162,232,45)', 'rgb(9,175,58)'],
          ['rgb(119,205,181)', 'rgb(152,211,251)', 'rgb(57,141,239)', 'rgb(170,169,211)', 'rgb(136,115,246)', 'rgb(196,104,247)']
        ],
        showInitial: true,
        showInput: true,
        chooseText: '确定',
        cancelText: '取消',
        preferredFormat: 'rgb',
        move: function (tinycolor) {
          // 选择中
          // 改变值时触发
          _this.nowFontColor = tinycolor.toRgbString().replace(/\s/g, '')
        },
        // show: function(tinycolor) {},
        hide: function (tinycolor) {
          // 选择后
          // 隐藏选择框时触发
          // 需要自己判断是否改变了值
          // console.log(tinycolor.toRgb())
          _this.nowFontColor = tinycolor.toRgbString().replace(/\s/g, '')
          if (_this.saveNowTxtColor !== _this.nowFontColor) {
            // 值改变了 记录操作历史
            _this.addActionRecord('txt', _this.saveNowTxtColorTpIndex, 'fill', _this.nowFontColor, _this.saveNowTxtColor)
          }
          _this.saveNowTxtColor = ''
          _this.saveNowTxtColorTpIndex = ''
        // var nowVal = tinycolor.toHexString(); // #ffffff格式
        // console.log(nowVal)
        }
      // change: function (tinycolor) {}, // 同hide
      // beforeShow: function(tinycolor) {}
      })
    },
    // 画布里的数据被selected 右侧编辑层数据初始化
    setRightEditData: function () {
      var item = ''
      if (this.nowSelect === 'txt') {
        // txt
        item = this.canvasItemTxts[this.nowSelectIndex]
        this.nowFontOpacity = Number(item.opt.opacity)
        this.nowFontSize = item.opt.fontSize
        this.nowFontColor = item.opt.fill
        $('#picker').spectrum('set', this.nowFontColor)
        this.nowFontWeight = item.opt.fontWeight
        this.nowFontStyle = item.opt.fontStyle
        this.nowFontUnderline = item.opt.underline
        this.nowFontLinethrough = item.opt.linethrough
        this.nowFontTextAlign = item.opt.textAlign
        this.nowFontSpace = item.opt.charSpacing
        this.nowFontLineHeight = item.opt.lineHeight
      } else if (this.nowSelect === 'img') {
        // img
        item = this.canvasItemImgs[this.nowSelectIndex]
        this.nowImgOpacity = Number(item.opt.opacity)
        this.nowImgRadicus = item.opt.tpRadius
      }
    },
    // 滑块的点击 鼠标按下事件
    rangeMouseDown: function (e, str) {
      this.clickRange = str
      this.clickRangeVal = e.target.value
    },
    // 滑块的点击 鼠标放开事件
    rangeMouseUp: function () {
      var _this = this
      if (!_this.nowSelectIndex || !_this.clickRange) return
      // input_range处鼠标按下事件 确定下了此次历史操作记录的准确性
      var propName = _this.clickRange.split('_')[1]
      var newVal = ''
      if (propName === 'zIndex') {
        newVal = _this.nowZIndex
      } else {
        newVal = _this.nowSelectIndex.indexOf('tp-img-') === 0 ?
          _this.canvasItemImgs[_this.nowSelectIndex].canvasEl[propName] :
          _this.canvasItemTxts[_this.nowSelectIndex].canvasEl[propName]
      }
      // 旧的值跟新的一致 不记录 == 数字和字符串类型不一致
      if (newVal == _this.clickRangeVal) return
      // 操作记录
      _this.addActionRecord(
        // img/txt 标识
        _this.clickRange.split('_')[0],
        // tpIndex 当前元素自定义下标
        _this.nowSelectIndex,
        // propName 修改的属性名
        propName,
        // newVal 当前值
        newVal,
        // oldVal 旧的值
        _this.clickRangeVal
      )
      _this.clickRange = ''
      _this.clickRangeVal = ''
    },
    // 开始选择颜色
    colorPickMouseUp: function () {
      if (this.saveNowTxtColor) return
      this.saveNowTxtColor = this.canvasItemTxts[this.nowSelectIndex].opt.fill
      this.saveNowTxtColorTpIndex = this.nowSelectIndex
    },
    // 显示排序弹层 控制层级的
    toggleSortControl: function () {
      var _this = this
      _this.showRightSortControl = !_this.showRightSortControl
      _this.justNowClickedSortControl = _this.showRightSortControl
      if (_this.showRightSortControl) {
        // 当前所在层级
        _this.nowZIndex = _this.canvasItemZIndex.indexOf(_this.nowSelectIndex)
        // 显示了排序弹层 取消画布里元素的选择
        _this.canvas.discardActiveObject().renderAll()
      } else {
        // 隐藏了排序弹层 恢复画布里元素的选中
        _this.canvas.setActiveObject(
          _this.nowSelectIndex.indexOf('tp-img-') === 0 ?
            _this.canvasItemImgs[_this.nowSelectIndex].canvasEl :
            _this.canvasItemTxts[_this.nowSelectIndex].canvasEl
        ).renderAll()
      }
    },
    // 冒泡到右侧编辑区 隐藏掉排序弹层
    hideSortControl: function () {
      if (this.showRightSortControl) this.toggleSortControl()
    }
  }
}
