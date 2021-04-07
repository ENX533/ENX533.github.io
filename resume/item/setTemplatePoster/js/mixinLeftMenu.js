/*
 * @Author: MZx
 * @Date: 2020-05-20 14:40:03
 * @Last Modified by: MZx
 * @Last Modified time: 2020-05-20 14:48:54
 * @Description: 混合对象 左边内容层 菜单的数据
 */

var mixinLeftMenu = {
  data: function () {
    return {
      sLeftView: 'txt',
      bLeftItemsHide: false,
      aLeftTxt: phpTemplatePosterData.txts || [],
      aLeftImg: phpTemplatePosterData.imgs || [],
      aLeftBg: phpTemplatePosterData.bgs || []
    }
  },
  methods: {
  }
}
