/**
 * @file control.ts 控件基础配置
 * @description 控件样式、显示隐藏等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-12 14:42
 */

/**
 * @desc 操纵控件
 * @param { Object } controlMobile
 * @param { Boolean } transparentCorners 边角控件是否透明
 * @param { String } cornerStrokeColor 边角描边颜色
 * @param { String } cornerColor 边角颜色
 * @param { String } cornerStyle 边角形状 rect | circle
 * @param { Number } cornerSize 边角大小
 * @param { Number } borderScaleFactor 描边边框大小
 * @param { Number } padding 控件距离内容的边距
 * @param { Number } mtrOffsetY 旋转摇杆偏移
 */
export const controlMobile: any = {
    transparentCorners: false,
    cornerStrokeColor: '#fff',
    cornerColor: '#fff',
    cornerStyle: 'rect',
    cornerSize: 28,
    borderScaleFactor: 4,
    borderColor: '#e8e8e8',
    padding: 0,
    mtrOffsetY: -60
}

/**
 * @desc 操纵控件
 * @param { Object } controlPc
 * @param { Boolean } transparentCorners 边角控件是否透明
 * @param { String } cornerStrokeColor 边角描边颜色
 * @param { String } cornerColor 边角颜色
 * @param { String } cornerStyle 边角形状 rect | circle
 * @param { Number } cornerSize 边角大小
 * @param { Number } borderScaleFactor 描边边框大小
 * @param { Number } padding 控件距离内容的边距
 * @param { Number } mtrOffsetY 旋转摇杆偏移
 */
export const controlPc: any = {
    transparentCorners: false,
    cornerStrokeColor: '#00BFFF',
    cornerColor: '#00BFFF',
    cornerStyle: 'rect',
    cornerSize: 36,
    borderScaleFactor: 5,
    borderColor: '#00BFFF',
    padding: 30,
    mtrOffsetY: -40
}

/**
 * @desc 需要隐藏的控件
 * @param { Array } hiddenControl 藏的控件名的数组集合
 */
export const hiddenControl: Array<string> = ['ml', 'mb', 'mr', 'mt']

export const control = controlMobile
