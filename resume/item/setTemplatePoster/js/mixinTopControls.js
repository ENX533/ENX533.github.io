/*
 * @Author: MZx
 * @Date: 2020-05-20 16:44:09
 * @Last Modified by: MZx
 * @Last Modified time: 2021-04-07 16:36:26
 * @Description: 混合对象 顶部控制栏 历史操作记录、预览、保存等
 */

var mixinTopControls = {
  data: function () {
    return {
      aActionRecord: [], // 历史操作记录
      aHadRmovedElem: {} // 被删除的元素 操作返回上一步 则需配合setCanvasItemsZIndex设置好层级
    }
  },
  methods: {
    // 上一步
    topCtrlCancel: function () {
      // console.log('复杂的"上一步"')
      if (!this.aActionRecord.length) return
      this.actionRecordBack()
    },
    // 重做
    topCtrlReload: function () {
      if (this.aActionRecord.length) {
        layer.confirm(
          '放弃修改，从头再来？', {
          btn: ['确认', '取消']
        }, function () {
          window.location.reload()
        }, function () {
          // console.log('不刷新')
        }
        )
      } else {
        window.location.reload()
      }
    },
    // 预览
    topCtrlPreview: async function () {
      if (!this.canvasItemBg.id) {
        layer.msg('请先选择背景')
        return
      }
      var _this = this
      var data = await _this.getNowData()
      data.poster_img = _this.canvasItemBg.src
      data.img_info = data.img_info.map(function (item) {
        item.src = _this.aliossHost + item.src
        return item
      })
      sessionStorage.setItem('posterTemplateDetail', JSON.stringify(data))
      // window.parent.layer_show('预览', phpTemplatePosterData.previewRoute, 375, 686)
      layer.open({
        type: 2,
        content: phpTemplatePosterData.previewRoute,
        area: ['375px', '686px']
      })
    },
    // 保存
    topCtrlSave: async function () {
      if (!this.canvasItemBg.id) {
        layer.msg('请先选择背景')
        return
      }
      var _this = this
      _this.canvas.discardActiveObject().renderAll()
      layer.load(2)
      var data = await _this.getNowData()
      // console.log(data)
      var cb = function () {
        layer.closeAll('loading')
        window.parent.location.reload()
        _this.topCtrlShutdown()
      }
      phpTemplatePosterData.saveData(data, cb)
      // 存库的方法 最后关闭本layer弹层
    },
    // 关闭
    topCtrlShutdown: function () {
      // 引入本iframe的window 关闭弹层
      window.parent.layer.closeAll()

      layer.msg(
        "点击了关闭",
        {
          time: 2000,
        }
      )
    },
    // 获取当前画布数据
    getNowData: async function () {
      var _this = this
      var text_info = []
      var img_info = []
      var preview_url = ''
      // for (var k1 in _this.canvasItemTxts) {
      //   text_info.push({
      //     txt: _this.canvasItemTxts[k1].txt,
      //     opt: _this.canvasItemTxts[k1].opt
      //   })
      // }
      // for (var k2 in _this.canvasItemImgs) {
      //   img_info.push({
      //     src: _this.canvasItemImgs[k2].src.replace(/http.*?\.com\/tongmeng/, 'tongmeng'),
      //     opt: _this.canvasItemImgs[k2].opt
      //   })
      // }
      // 画布元素
      _this.canvasItemZIndex.forEach(function (item, index) {
        if (item.indexOf('tp-img-') === 0) {
          img_info.push({
            src: _this.canvasItemImgs[item].src.replace(/http.*?\.com\/tongmeng/, 'tongmeng'),
            opt: $.extend(_this.canvasItemImgs[item].opt, {
              tpIndex: 'tp-img-' + (_this.canvasItemImgs[item].canvasEl.tpZIndex + 1)
            })
          })
        } else {
          text_info.push({
            txt: _this.canvasItemTxts[item].txt,
            opt: $.extend(_this.canvasItemTxts[item].opt, {
              tpIndex: 'tp-txt-' + (_this.canvasItemTxts[item].canvasEl.tpZIndex + 1)
            })
          })
        }
      })
      // 预览图
      var base64url = _this.canvas.lowerCanvasEl.toDataURL('image/jpeg', 1)
      var testfile = _this.dataURLtoFile(base64url, Date.parse(new Date()) + '.jpg')
      // 本地 试试效果 不需要预览图上传
      // preview_url = await phpTemplatePosterData.uploadImgToOssWithCb(testfile)
      // preview_url = preview_url.replace(/http.*?\.com\/tongmeng/, 'tongmeng')
      // 整合 含本数据id、背景图id
      return {
        id: _this.data.id,
        poster_img_id: _this.canvasItemBg.id,
        text_info: text_info,
        img_info: img_info,
        preview_url: preview_url
      }
    },
    // 添加操作记录
    addActionRecord: function (type, index, prop, val, oldVal) {
      this.aActionRecord.push({
        type: type,
        index: index,
        prop: prop,
        val: val,
        oldVal: oldVal
      })
    },
    // 撤销操作
    actionRecordBack: async function () {
      var _this = this
      var lastAction = _this.aActionRecord.pop()
      var aim = lastAction.oldVal
      layer.load(2)
      switch (lastAction.type) {
        case 'bg':
          // 背景图更换
          _this.canvasItemBg = {
            id: aim.id,
            src: aim.src
          }
          await _this.drawBg(aim.src)
          break
        case 'img':
          switch (lastAction.prop) {
            // 图片添加
            case 'add':
              // 备份数据
              _this.aHadRmovedElem[lastAction.index] = _this.canvasItemImgs[lastAction.index]
              delete _this.canvasItemImgs[lastAction.index]
              // 删除画布
              _this.canvas.remove(_this.aHadRmovedElem[lastAction.index].canvasEl)
              // 纠正层级
              _this.canvasItemZIndex.splice(_this.canvasItemZIndex.indexOf(lastAction.index), 1)
              _this.repairCanvasItemsZIndex()
              break
            // 图片移动
            case 'move':
            // 图片旋转
            case 'rotate':
            // 图片缩放
            case 'scale':
              _this.canvasItemImgs[lastAction.index].canvasEl.set(aim).setCoords()
              _this.canvasItemImgs[lastAction.index].opt = $.extend(_this.canvasItemImgs[lastAction.index].opt, aim)
              break
            // 图片替换
            case 'replace':
              await _this.replaceDrawImg(aim, lastAction.index, true)
              break
            // 图片不透明度
            case 'opacity':
              _this.canvasItemImgs[lastAction.index].canvasEl.set({ opacity: aim }).setCoords()
              _this.canvasItemImgs[lastAction.index].opt = $.extend(_this.canvasItemImgs[lastAction.index].opt, { opacity: aim })
              if (_this.nowSelectIndex === lastAction.index) _this.nowImgOpacity = aim
              break
            // 图片圆角
            case 'tpRadius':
              _this.canvasItemImgs[lastAction.index].canvasEl.set({
                tpRadius: aim,
                clipPath: new fabric.Rect({ // 圆角
                  top: 0,
                  left: 0,
                  originX: 'center',
                  originY: 'center',
                  width: _this.canvasItemImgs[lastAction.index].canvasEl.width,
                  height: _this.canvasItemImgs[lastAction.index].canvasEl.height,
                  rx: aim, // 圆角半径
                  ry: aim // 圆角半径
                })
              }).setCoords()
              _this.canvasItemImgs[lastAction.index].opt = $.extend(_this.canvasItemImgs[lastAction.index].opt, {
                tpRadius: aim
              })
              if (_this.nowSelectIndex === lastAction.index) _this.nowImgRadicus = aim
              break
            // 图片删除
            case 'remove':
              _this.canvasItemImgs[lastAction.index] = _this.aHadRmovedElem[lastAction.index]
              delete _this.aHadRmovedElem[lastAction.index]
              _this.canvas.add(_this.canvasItemImgs[lastAction.index].canvasEl)
              // 初始化层级
              // _this.setCanvasItemsZIndex()
              // 纠正层级
              var tpZIndex = _this.canvasItemImgs[lastAction.index].canvasEl.tpZIndex
              _this.canvasItemImgs[lastAction.index].canvasEl.moveTo(tpZIndex)
              _this.canvasItemZIndex.splice(tpZIndex, 0, lastAction.index)
              _this.repairCanvasItemsZIndex()
              break
            // 排序/层级
            case 'zIndex':
              _this.canvasItemImgs[lastAction.index].canvasEl.moveTo(aim)
              // 纠正层级
              _this.canvasItemZIndex.splice(aim, 0, _this.canvasItemZIndex.splice(_this.canvasItemZIndex.indexOf(lastAction.index), 1)[0])
              if (_this.nowSelectIndex === lastAction.index) _this.nowZIndex = aim
              _this.repairCanvasItemsZIndex()
              break
          }
          break
        case 'txt':
          switch (lastAction.prop) {
            // 文字添加
            case 'add':
              // 备份数据
              _this.aHadRmovedElem[lastAction.index] = _this.canvasItemTxts[lastAction.index]
              delete _this.canvasItemTxts[lastAction.index]
              // 删除画布
              _this.canvas.remove(_this.aHadRmovedElem[lastAction.index].canvasEl)
              // 纠正层级
              _this.canvasItemZIndex.splice(_this.canvasItemZIndex.indexOf(lastAction.index), 1)
              _this.repairCanvasItemsZIndex()
              break
            // 文字移动
            case 'move':
            // 文字旋转
            case 'rotate':
            // 文字缩放
            case 'scale':
              _this.canvasItemTxts[lastAction.index].canvasEl.set(aim).setCoords()
              _this.canvasItemTxts[lastAction.index].opt = $.extend(_this.canvasItemTxts[lastAction.index].opt, aim)
              break
            // 文字编辑
            case 'edit':
              _this.canvasItemTxts[lastAction.index].canvasEl.set({ text: aim }).setCoords()
              _this.canvasItemTxts[lastAction.index].txt = aim
              break
            // 文字大小
            case 'fontSize':
              _this.canvasItemTxts[lastAction.index].canvasEl.set({ fontSize: aim }).setCoords()
              _this.canvasItemTxts[lastAction.index].opt = $.extend(_this.canvasItemTxts[lastAction.index].opt, { fontSize: aim })
              if (_this.nowSelectIndex === lastAction.index) _this.nowFontSize = aim
              break
            // 文字颜色
            case 'fill':
              _this.canvasItemTxts[lastAction.index].canvasEl.set({ fill: aim }).setCoords()
              _this.canvasItemTxts[lastAction.index].opt = $.extend(_this.canvasItemTxts[lastAction.index].opt, { fill: aim })
              if (_this.nowSelectIndex === lastAction.index) {
                _this.nowFontColor = aim
                $('#picker').spectrum('set', aim)
              }
              break
            // 文字加粗
            case 'fontWeight':
              _this.canvasItemTxts[lastAction.index].canvasEl.set({ fontWeight: aim }).setCoords()
              _this.canvasItemTxts[lastAction.index].opt = $.extend(_this.canvasItemTxts[lastAction.index].opt, { fontWeight: aim })
              if (_this.nowSelectIndex === lastAction.index) _this.nowFontWeight = aim
              break
            // 文字斜体
            case 'fontStyle':
              _this.canvasItemTxts[lastAction.index].canvasEl.set({ fontStyle: aim }).setCoords()
              _this.canvasItemTxts[lastAction.index].opt = $.extend(_this.canvasItemTxts[lastAction.index].opt, { fontStyle: aim })
              if (_this.nowSelectIndex === lastAction.index) _this.nowFontStyle = aim
              break
            // 文字下划线
            case 'underline':
              _this.canvasItemTxts[lastAction.index].canvasEl.set({ underline: aim }).setCoords()
              _this.canvasItemTxts[lastAction.index].opt = $.extend(_this.canvasItemTxts[lastAction.index].opt, { underline: aim })
              if (_this.nowSelectIndex === lastAction.index) _this.nowFontUnderline = aim
              break
            // 文字删除线
            case 'linethrough':
              _this.canvasItemTxts[lastAction.index].canvasEl.set({ linethrough: aim }).setCoords()
              _this.canvasItemTxts[lastAction.index].opt = $.extend(_this.canvasItemTxts[lastAction.index].opt, { linethrough: aim })
              if (_this.nowSelectIndex === lastAction.index) _this.nowFontLinethrough = aim
              break
            // 文字水平对齐方式
            case 'textAlign':
              _this.canvasItemTxts[lastAction.index].canvasEl.set({ textAlign: aim }).setCoords()
              _this.canvasItemTxts[lastAction.index].opt = $.extend(_this.canvasItemTxts[lastAction.index].opt, { textAlign: aim })
              if (_this.nowSelectIndex === lastAction.index) _this.nowFontTextAlign = aim
              break
            // 文字不透明度
            case 'opacity':
              _this.canvasItemTxts[lastAction.index].canvasEl.set({ opacity: aim }).setCoords()
              _this.canvasItemTxts[lastAction.index].opt = $.extend(_this.canvasItemTxts[lastAction.index].opt, { opacity: aim })
              if (_this.nowSelectIndex === lastAction.index) _this.nowFontOpacity = aim
              break
            // 文字字间距
            case 'charSpacing':
              _this.canvasItemTxts[lastAction.index].canvasEl.set({ charSpacing: aim }).setCoords()
              _this.canvasItemTxts[lastAction.index].opt = $.extend(_this.canvasItemTxts[lastAction.index].opt, { charSpacing: aim })
              if (_this.nowSelectIndex === lastAction.index) _this.nowFontSpace = aim
              break
            // 文字行高
            case 'lineHeight':
              _this.canvasItemTxts[lastAction.index].canvasEl.set({ lineHeight: aim }).setCoords()
              _this.canvasItemTxts[lastAction.index].opt = $.extend(_this.canvasItemTxts[lastAction.index].opt, { lineHeight: aim })
              if (_this.nowSelectIndex === lastAction.index) _this.nowFontLineHeight = aim
              break
            // 文字删除
            case 'remove':
              _this.canvasItemTxts[lastAction.index] = _this.aHadRmovedElem[lastAction.index]
              delete _this.aHadRmovedElem[lastAction.index]
              _this.canvasItemTxts[lastAction.index].canvasEl.set({ text: aim }).setCoords()
              _this.canvas.add(_this.canvasItemTxts[lastAction.index].canvasEl)
              // 初始化层级
              // _this.setCanvasItemsZIndex()
              // 纠正层级
              var tpZIndex = _this.canvasItemTxts[lastAction.index].canvasEl.tpZIndex
              _this.canvasItemTxts[lastAction.index].canvasEl.moveTo(tpZIndex)
              _this.canvasItemZIndex.splice(tpZIndex, 0, lastAction.index)
              _this.repairCanvasItemsZIndex()
              break
              break
            // 排序/层级
            case 'zIndex':
              _this.canvasItemTxts[lastAction.index].canvasEl.moveTo(aim)
              // 纠正层级
              _this.canvasItemZIndex.splice(aim, 0, _this.canvasItemZIndex.splice(_this.canvasItemZIndex.indexOf(lastAction.index), 1)[0])
              if (_this.nowSelectIndex === lastAction.index) _this.nowZIndex = aim
              _this.repairCanvasItemsZIndex()
              break
          }
          break
      }
      _this.canvas.renderAll()
      layer.closeAll('loading')
    }
  }
}
