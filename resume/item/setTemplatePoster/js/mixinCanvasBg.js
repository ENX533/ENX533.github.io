/*
 * @Author: MZx
 * @Date: 2020-05-20 14:40:03
 * @Last Modified by: MZx
 * @Last Modified time: 2021-04-07 16:52:15
 * @Description: 混合对象 初始化画布、绘制背景
 */

var border = 10
var uiRatio = 1 / 2
var mixinCanvasBg = {
  data: function () {
    return {
      border: border * uiRatio,
      bgWidth: (750 - border * 2) * uiRatio,
      bgHeight: ((750 - border * 2) / 2 * 3) * uiRatio,
      canvasWidth: 750 * uiRatio,
      canvasHeight: ((750 - border * 2) / 2 * 3 + border * 2) * uiRatio,

      canvas: '',
      canvasItemBg: {},

      canvasItemZIndex: []
    }
  },
  methods: {
    // 初始化画布
    initCanvas: function () {
      this.canvas = new fabric.Canvas(document.getElementsByClassName('tp-canvas')[0], {
        imageSmoothingEnabled: false, // 不使用图片平滑处理
        fill: '#fff',
        backgroundColor: '#fff',
        selection: false, // 不可拖拽选择 不可组选择
        width: this.canvasWidth,
        height: this.canvasHeight
      })
      // this.canvas.on('selected', function (eee) {
      //   console.log(eee)
      // }.bind(this))
    },
    // 绘制背景
    drawBg: async function (val) {
      var _this = this
      return new Promise(function (resolve, reject) {
        try {
          fabric.Image.fromURL(val, function (bg) {
            bg.set({
              top: _this.border,
              left: _this.border,
              centeredScaling: true,
              opacity: 1,
              selectable: false,
              evented: false
            })
            bg.scaleToWidth(_this.bgWidth)
            bg.scaleToHeight(_this.bgHeight)
            // // 层级
            // bg.moveTo(0)
            // bg.sendToBack()
            // if (_this.canvasItemTxts && _this.canvasItemTxts.length) _this.canvasItemTxts.forEach(function (item) {
            //   item.bringToFront()
            // })
            // if (_this.canvasItemImgs && _this.canvasItemImgs.length) _this.canvasItemImgs.forEach(function (item) {
            //   item.bringToFront()
            // })
            // 存储数据
            _this.canvasItemBg.canvasEl = bg
            // 绘制
            // _this.canvas.add(bg)
            _this.canvas.setBackgroundImage(bg)
            _this.canvas.renderAll()
            resolve()
          }, {
            crossOrigin: 'anonymous'
          })
        } catch (error) {
          console.log(error)
          reject(error)
        }
      })
    },
    // 根据当前的数据 绘制初始状态
    drawByData: async function () {
      // console.log(this.data)
      var _this = this
      layer.load(2)
      // 绘制背景
      if (this.data.poster_img_id !== 0 && this.data.poster_img) {
        this.canvasItemBg = {
          id: this.data.poster_img_id,
          src: this.aliossHost + this.data.poster_img[0]
        }
        await this.drawBg(this.aliossHost + this.data.poster_img[0])
      }

      var aItems = []
      if (this.data.img_info) aItems = aItems.concat(this.data.img_info)
      if (this.data.text_info) aItems = aItems.concat(this.data.text_info)
      if (aItems.length) {
        // 从小到大排列z-index
        aItems.sort(function (o1, o2) {
          return parseInt(o1.opt.tpIndex.replace(/tp-img-|tp-txt-/, '')) - parseInt(o2.opt.tpIndex.replace(/tp-img-|tp-txt-/, ''))
        })
        // 按顺序绘制
        for (var i in aItems) {
          // _this.canvasItemZIndex.push(aItems[i].opt.tpIndex); // 小的层级低 先加进数组 没错
          if (aItems[i].opt.tpIndex.indexOf('tp-img-') === 0) {
            await _this.addDrawImg(this.aliossHost + aItems[i].src, aItems[i].opt)
          } else {
            _this.drawTxt(aItems[i].txt, aItems[i].opt)
          }
        }
        // this.setCanvasItemsZIndex()
        _this.canvas.renderAll()
        // 更新最大tpIndex
        this.newTPIndex = parseInt(aItems[aItems.length - 1].opt.tpIndex.replace(/tp-img-|tp-txt-/, '')) + 1
      }
      layer.closeAll('loading')
    },
    // 用户选择背景图
    selectBg (item) {
      // 没变化
      if (this.canvasItemBg.id === item.id) return
      // 操作记录
      this.addActionRecord('bg', 'tp-bg-0', 'src', {
        id: item.id,
        src: this.aliossHost + item.poster_img[0]
      }, {
        id: this.canvasItemBg.id,
        src: this.canvasItemBg.src
      })
      // 当前对象以及绘制
      this.canvasItemBg = {
        id: item.id,
        src: this.aliossHost + item.poster_img[0]
      }
      this.drawBg(this.aliossHost + item.poster_img[0])
    },
    // 画布没有选择任何东西 右侧编辑栏变化
    nowSelectNothing: function () {
      this.nowSelect = ''
      this.nowSelectIndex = ''
      this.canvas.discardActiveObject()
      this.canvas.renderAll()
    },
    // 根据画布的元素获取需要的json
    getOptionsFromCanvasItem: function (obj) {
      var item = obj.item
      if (obj.type === 'img') {
        // img
        return {
          tpIndex: item.tpIndex,
          top: item.top,
          left: item.left,
          tpRadius: item.tpRadius,
          opacity: item.opacity,
          angle: item.angle,
          scaleX: item.scaleX,
          scaleY: item.scaleY,
          flipX: item.flipX,
          flipY: item.flipY
        }
      } else if (obj.type === 'txt') {
        // txt
        return {
          tpIndex: item.tpIndex,
          top: item.top,
          left: item.left,
          opacity: item.opacity,
          angle: item.angle,
          scaleX: item.scaleX,
          scaleY: item.scaleY,
          flipX: item.flipX,
          flipY: item.flipY,
          fontSize: item.fontSize,
          fontWeight: item.fontWeight,
          fontStyle: item.fontStyle,
          underline: item.underline,
          linethrough: item.linethrough,
          textAlign: item.textAlign,
          charSpacing: item.charSpacing,
          lineHeight: item.lineHeight,
          fill: item.fill
        }
      }
    },
    // // 根据tpIndex设置当前所有文字/图片的层级
    // setCanvasItemsZIndex: function () {
    //   var _this = this
    //   var arr = []
    //   for (var key in _this.canvasItemImgs) {
    //     arr.push(key)
    //   }
    //   for (var key in _this.canvasItemTxts) {
    //     arr.push(key)
    //   }
    //   arr = arr.sort(function (k1, k2) {
    //     return parseInt(k2.replace(/tp-img-|tp-txt-/, '')) - parseInt(k1.replace(/tp-img-|tp-txt-/, ''))
    //   })
    //   for (var i = 0; i < arr.length; i++) {
    //     _this.canvas.sendToBack(
    //       /tp-img-/.test(arr[i]) ?
    //         _this.canvasItemImgs[arr[i]].canvasEl :
    //         _this.canvasItemTxts[arr[i]].canvasEl
    //     )
    //     // if (/tp-img-/.test(arr[i])) {
    //     //   _this.canvasItemImgs[arr[i]].canvasEl.moveTo(parseInt(_this.canvasItemImgs[arr[i]].canvasEl.tpIndex.replace(/tp-img-|tp-txt-/, '')))
    //     // } else {
    //     //   _this.canvasItemTxts[arr[i]].canvasEl.moveTo(parseInt(_this.canvasItemTxts[arr[i]].canvasEl.tpIndex.replace(/tp-img-|tp-txt-/, '')))
    //     // }
    //   }
    // }
    // 纠正全部层级 tpZIndex
    repairCanvasItemsZIndex: function () {
      var _this = this
      _this.canvasItemZIndex.forEach(function (item, index) {
        if (item.indexOf('tp-img-') === 0) {
          _this.canvasItemImgs[item].canvasEl.set({
            tpZIndex: index
          }).setCoords()
        } else {
          _this.canvasItemTxts[item].canvasEl.set({
            tpZIndex: index
          }).setCoords()
        }
      })
    }
  }
}
