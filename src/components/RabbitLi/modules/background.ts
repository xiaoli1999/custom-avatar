/**
 * @file background.ts 绘制画布背景
 * @description 用于画布绘制背景色、背景图等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-12 14:50
 */
import { BgInfoType } from '../types/index'

/**
 * @function drawBackground 绘制背景
 * @param { Object } Canvas 画布实例
 * @param { bgInfo } bgInfo 背景信息 背景图片链接、url等
 */
export const drawBackground = async (Canvas, bgInfo: BgInfoType) => {
    return new Promise((resolve: any) => {
        if (!bgInfo.url) return resolve()

        const config = {
            originX: 'center',
            originY: 'center',
            left: Canvas.width / 2,
            top: Canvas.height / 2,
            scaleX: Canvas.width / bgInfo.w,
            scaleY: Canvas.width / bgInfo.h
        }

        Canvas.setBackgroundImage(bgInfo.url, Canvas.renderAll.bind(Canvas), config)

        resolve()
    })
}
