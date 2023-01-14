/**
 * @file layer/index.ts 图绘绘制
 * @description 处理不同类型的图层
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-12 21:18
 */

import { drawImgLayer } from './image'
import { LayerType } from '../../types'

/**
 * @function drawLayer 绘制图层
 * @param { Object } Canvas 画布实例对象
 * @param { Object } layer 图层对象
 */
export const drawLayer = (Canvas: any, layer: LayerType) => {
    if (layer.type === 'img') {
        // 绘制图片层
        return drawImgLayer(Canvas, layer)
    }
}
