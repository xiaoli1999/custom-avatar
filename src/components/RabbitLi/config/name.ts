/**
 * @file name.ts 固定图层命名配置文件
 * @description 图层固定命名
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-12 17:50
 */

/**
 * @constant { Object } fixedLayerName 固定name
 */
export const fixedLayerName = {
    visibleArea: 'visibleArea-line'
}

/**
 * @constant { Array } fixedLayerNameArr 重绘图层时不参与重绘的图层
 */
export const fixedLayerNameArr: Array<string> = Object.values(fixedLayerName)

/**
 * @constant { Array } hiddenLayerNameArr 输出图片时隐藏的图层
 */
export const hiddenLayerNameArr: Array<string> = ['visibleArea-line']
