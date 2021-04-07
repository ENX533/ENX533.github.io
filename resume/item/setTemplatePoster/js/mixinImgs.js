/*
 * @Author: MZx
 * @Date: 2020-05-20 14:40:03
 * @Last Modified by: MZx
 * @Last Modified time: 2020-06-12 11:07:26
 * @Description: 混合对象 图片相关
 */

var mixinImgs = {
  data: function () {
    return {
      canvasItemImgs: {}
    }
  },
  methods: {
    // 添加图片 input_file onchange 选择了文件
    onUploadAddImg: function (e) {
      var _this = this
      var oInput = e.target
      if (!oInput.value) return
      // 拿到文件
      var file = oInput.files[0]
      var reader = new FileReader()
      reader.readAsDataURL(file); // 通过file文件获取图片base64
      reader.onload = function (e) {
        // 文件转base64去裁剪
        _this.cropperImg(e.target.result)
        // 清空输入框
        oInput.value = ''
      }
    },
    // 替换图片 input_file onchange 选择了文件
    onUploadReplaceImg: function (e) {
      var _this = this
      if (!_this.nowSelectIndex) return
      var oInput = e.target
      if (!oInput.value) return
      // 拿到文件
      var file = oInput.files[0]
      var reader = new FileReader()
      reader.readAsDataURL(file); // 通过file文件获取图片base64
      reader.onload = function (e) {
        // 文件转base64去裁剪
        _this.cropperImg(e.target.result, _this.nowSelectIndex)
        // 清空输入框
        oInput.value = ''
      }
    },
    // 裁剪图片
    cropperImg: function (base64, selectIndex) {
      if (!selectIndex) selectIndex = ''
      var _this = this
      var cropper = null
      // 弹层
      layer.open({
        type: 1,
        area: ['60%', '100%'],
        content: '<div style="height: 90%;">' +
          '<img src="' + base64 + '" class="cropper-img">' +
          '<div class="cropper-img-btn">剪切</div>' +
          '</div>'
      })
      // 确认裁剪按钮
      $('.cropper-img-btn').click(function () {
        layer.load(0, { shade: [0.5, '#393D49'] })
        // • 图片如果是内容层添加的，图片显示时，宽度100%显示，高度不限；
        // • 图片如果是自定义添加的，图片显示时，宽度50%，高度不限；
        var canvas = cropper.getCroppedCanvas({
          width: parseInt(_this.canvasWidth / 2),
          // height: 1200,
          imageSmoothingEnabled: false,
          imageSmoothingQuality: 'high'
        })
        // 获取裁剪后的base64
        var base64url = canvas.toDataURL('image/png', 1)
        // base64转file
        var testfile = _this.dataURLtoFile(base64url, Date.parse(new Date()) + '.jpg')
        if (cropper instanceof Cropper) cropper.destroy()
        // 上传file 传参回调函数 绘制图片
        phpTemplatePosterData.uploadImgToOssWithCb(testfile, function () {
          if (!selectIndex) {
            _this.addDrawImg(phpTemplatePosterData.imgUrl)
          } else {
            _this.replaceDrawImg(phpTemplatePosterData.imgUrl, selectIndex)
          }
        })
        // 开发中 先写死 不上传了
        // if (!selectIndex) {
        //   _this.addDrawImg(base64url)
        // } else {
        //   _this.replaceDrawImg(base64url, selectIndex)
        // }
        layer.closeAll()
      })
      // 初始化裁剪对象
      cropper = new Cropper($('.cropper-img')[0], {
        aspectRatio: null,
        viewMode: 1,
        autoCropArea: 1,
        movable: true,
        dragMode: 'move',
        cropBoxMovable: false
      })
    },
    // base64转file对象
    dataURLtoFile: function (dataurl, filename) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, {type: mime})
    },
    // 添加 绘制图片
    addDrawImg: async function (val, initOptions) {
      var _this = this
      return new Promise(function (resolve, reject) {
        try {
          var afterReadImg = function (img) {
            img.set({
              tpIndex: 'tp-img-' + _this.newTPIndex,
              top: 0,
              left: 0,
              tpRadius: 0,
              opacity: 1,
              angle: 0,
              scaleX: 1,
              scaleY: 1,
              flipX: false, // 水平翻转
              flipY: false, // 垂直翻转

              // originX: 'center',
              // originY: 'center',
              // centeredRotation: true, // 旋转随中心
              // centeredScaling: true, // 缩放随中心
              borderOpacityWhenMoving: 1,
              padding: 10,
              borderDashArray: [3, 3], // 选中框虚线
              // borderDashArray: [6, 6], // 选中框虚线
              borderColor: '#fe484c', // 选中框颜色
              // borderColor: 'red', // 选中框颜色
              cornerColor: '#fe484c' // 角落块颜色
              // cornerColor: 'red', // 角落块颜色
              // cornerStrokeColor: '#fe484c',
              // cornerSize: 20 // 控制的角的大小 默认13
              // preserveObjectStacking: true // 选中时保持层级不变为最高，没用
            }).setCoords()
            img.set({
              top: (_this.canvasHeight - img.height) / 2,
              left: (_this.canvasWidth - img.width) / 2
            }).setCoords()
            if (initOptions) {
              img.set(initOptions).setCoords()
              if (initOptions.tpRadius) {
                img.set({
                  clipPath: new fabric.Rect({ // 圆角
                    top: 0,
                    left: 0,
                    originX: 'center',
                    originY: 'center',
                    width: img.width,
                    height: img.height,
                    rx: initOptions.tpRadius, // 圆角半径
                    ry: initOptions.tpRadius // 圆角半径
                  })
                }).setCoords()
              }
            }
            // 存储数据
            // 层级记录添加
            _this.canvasItemZIndex.push(img.tpIndex);
            img.set({
              tpZIndex: _this.canvasItemZIndex.length - 1
            }).setCoords();
            var opt = _this.getOptionsFromCanvasItem({
              item: img,
              type: 'img'
            })
            _this.canvasItemImgs[img.tpIndex] = {
              src: val,
              canvasEl: img,
              opt: opt
            }
            _this.newTPIndex++
            // 绘制
            _this.initImgEvent(img)
            _this.canvas.add(img)
            // _this.canvas.moveTo(img, _this.newTPIndex)
            // 选中
            _this.canvas.renderAll()
            if (!initOptions) {
              _this.canvas.setActiveObject(img)
              // 操作记录
              _this.addActionRecord('img', img.tpIndex, 'add', '', '')
            }
          }
          // if (val.indexOf('base64') === -1) {
          //   // 网络图片
          //   fabric.Image.fromURL(val, function (img) {
          //     afterReadImg(img)
          //   }.bind(this), {
          //     crossOrigin: 'anonymous'
          //   })
          // } else {
          //   // // 本地base64
          //   // var oImg = new Image()
          //   // oImg.onload = function () {
          //   //   afterReadImg(new fabric.Image(oImg))
          //   // }
          //   // oImg.src = val
          // }
          // 网络图片或base64都行
          fabric.Image.fromURL(val, function (img) {
            afterReadImg(img)
            resolve()
          }.bind(this), {
            crossOrigin: 'anonymous'
          })
        } catch (error) {
          console.log(error)
          reject(error)
        }
      })
    },
    // 替换 绘制图片
    replaceDrawImg: function (val, tpIndex, noAddActionRecord) {
      var _this = this
      return new Promise(function (resolve, reject) {
        try {
          layer.load(2)
          // 操作记录
          if (!noAddActionRecord) _this.addActionRecord('img', tpIndex, 'replace', val, _this.canvasItemImgs[tpIndex].src)
          _this.canvasItemImgs[tpIndex].canvasEl.setSrc(val, function () {
            _this.canvasItemImgs[tpIndex].canvasEl.set(_this.canvasItemImgs[tpIndex].opt).setCoords()
            if (_this.canvasItemImgs[tpIndex].opt.tpRadius) {
              _this.canvasItemImgs[tpIndex].canvasEl.set({
                clipPath: new fabric.Rect({ // 圆角
                  top: 0,
                  left: 0,
                  originX: 'center',
                  originY: 'center',
                  width: _this.canvasItemImgs[tpIndex].canvasEl.width,
                  height: _this.canvasItemImgs[tpIndex].canvasEl.height,
                  rx: _this.canvasItemImgs[tpIndex].opt.tpRadius, // 圆角半径
                  ry: _this.canvasItemImgs[tpIndex].opt.tpRadius // 圆角半径
                })
              }).setCoords()
            }
            layer.closeAll('loading')
            _this.canvas.renderAll()
            _this.canvas.setActiveObject(_this.canvasItemImgs[tpIndex].canvasEl)
            _this.canvasItemImgs[tpIndex].src = val
            resolve()
          })
        } catch (error) {
          console.log(error)
          reject(error)
        }
      })
    },
    // 画布元素事件绑定
    initImgEvent: function (img) {
      var _this = this
      // 选中
      img.on('selected', function () {
        //   // 层级 第一版不做 保留原有层级
        //   this.bringToFront()
        //   _this.canvas.renderAll()
        // 右侧 编辑层
        _this.nowSelect = 'img'
        _this.nowSelectIndex = img.tpIndex
        _this.showRightSortControl = false
        // img.moveTo(1); // 1 是 画布所有项目 数组下标
        // console.log(_this.canvasItemImgs)
        // console.log(img.tpIndex)
        // console.log(img)
        _this.setRightEditData()
      })
      // 取消选中
      img.on('deselected', function () {
        if (_this.justNowClickedSortControl) {
          _this.justNowClickedSortControl = false
        } else {
          _this.nowSelect = ''
          _this.nowSelectIndex = ''
          _this.showRightSortControl = false
        }
      })
      // 移动
      img.on('moved', function () {
        // 操作记录
        _this.addActionRecord('img', img.tpIndex, 'move', {
          top: img.top,
          left: img.left
        }, {
          top: _this.canvasItemImgs[img.tpIndex].opt.top,
          left: _this.canvasItemImgs[img.tpIndex].opt.left
        })
        _this.canvasItemImgs[img.tpIndex].opt.top = img.top
        _this.canvasItemImgs[img.tpIndex].opt.left = img.left
      })
      // 缩放
      img.on('scaling', function () {
        if (img.scaleX * img.width < 10) {
          img.scaleX = 10 / img.width
          return
        }
      })
      img.on('scaled', function () {
        // 操作记录
        _this.addActionRecord('img', img.tpIndex, 'scale', {
          top: img.top,
          left: img.left,
          scaleX: img.scaleX,
          scaleY: img.scaleY,
          flipX: img.flipX,
          flipY: img.flipY
        }, {
          top: _this.canvasItemImgs[img.tpIndex].opt.top,
          left: _this.canvasItemImgs[img.tpIndex].opt.left,
          scaleX: _this.canvasItemImgs[img.tpIndex].opt.scaleX,
          scaleY: _this.canvasItemImgs[img.tpIndex].opt.scaleY,
          flipX: _this.canvasItemImgs[img.tpIndex].opt.flipX,
          flipY: _this.canvasItemImgs[img.tpIndex].opt.flipY
        })

        _this.canvasItemImgs[img.tpIndex].opt.top = img.top
        _this.canvasItemImgs[img.tpIndex].opt.left = img.left
        _this.canvasItemImgs[img.tpIndex].opt.scaleX = img.scaleX
        _this.canvasItemImgs[img.tpIndex].opt.scaleY = img.scaleY
        _this.canvasItemImgs[img.tpIndex].opt.flipX = img.flipX
        _this.canvasItemImgs[img.tpIndex].opt.flipY = img.flipY
      })
      // 旋转
      img.on('rotated', function () {
        // 操作记录
        _this.addActionRecord('img', img.tpIndex, 'rotate', {
          top: img.top,
          left: img.left,
          angle: img.angle
        }, {
          top: _this.canvasItemImgs[img.tpIndex].opt.top,
          left: _this.canvasItemImgs[img.tpIndex].opt.left,
          angle: _this.canvasItemImgs[img.tpIndex].opt.angle
        })

        _this.canvasItemImgs[img.tpIndex].opt.top = img.top
        _this.canvasItemImgs[img.tpIndex].opt.left = img.left
        _this.canvasItemImgs[img.tpIndex].opt.angle = img.angle
      })
    },
    // 删除图片
    removeImg: function () {
      var _this = this
      if (!_this.nowSelectIndex) return
      // 操作记录
      _this.addActionRecord('img', _this.nowSelectIndex, 'remove', '', '')
      // 备份数据
      _this.aHadRmovedElem[_this.nowSelectIndex] = _this.canvasItemImgs[_this.nowSelectIndex]
      delete _this.canvasItemImgs[_this.nowSelectIndex]
      // 层级记录删除
      _this.canvasItemZIndex.splice(_this.canvasItemZIndex.indexOf(_this.nowSelectIndex), 1)
      // 删除画布
      _this.canvas.remove(_this.aHadRmovedElem[_this.nowSelectIndex].canvasEl)
      _this.canvas.renderAll()
    }
  }
}
