/**
 * @file init.ts 初始化
 * @description 初始化画布、遮罩层、可视区域等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-12 18:04
 */

import { fabric } from 'fabric'
import { addOrReplaceLayer, getUrlBase64 } from './common'
import { canvasType } from '../config/canvas'
import { fixedLayerName } from '../config/name'

/**
 * @function initCanvas 初始化画布
 * @param { String } inkId 画布dom id
 * @param { Object } size 画布大小 { width, height }
 * @param { Boolean } isStatic 是否静态画布
 * @return { Object } Canvas 返回画布实例对象
 */
export const initCanvas = (inkId: string, size: canvasType, isStatic: boolean) => {
    const Canvas = new fabric[isStatic ? 'StaticCanvas' : 'Canvas'](inkId, size)
    // 关闭点击后图层被置顶
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Canvas.preserveObjectStacking = true
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore 关闭多选
    Canvas.selection = false
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore 设置中心缩放
    Canvas.centeredScaling = true
    return Canvas
}


/**
 * @function initDrawArea 绘制可视区域
 * @desc 绘制可视区域辅助线（圆形头像）
 * @param { Object } Canvas 画布实例
 * @return { Object } circleArea 返回可视区域实例
 */
export const initVisibleArea = async (Canvas: any) => {
    return new Promise((resolve:any) => {
        const circleArea = new fabric.Circle({
            originX: 'center',
            originY: 'center',
            left: 0,
            top: 0,
            radius: Canvas.width / 2,
            stroke: '#1E90FF80',
            fill: undefined,
            strokeWidth: 1,
            strokeDashArray: [4, 4],
            padding: 0,
            selectable: false
        })
        circleArea.name = fixedLayerName.visibleArea

        // 替换或新增
        addOrReplaceLayer(Canvas, circleArea)
        return resolve(circleArea)
    })
}
