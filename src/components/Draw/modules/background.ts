/**
 * @file background.ts 绘制画布背景
 * @description 用于画布绘制背景色、背景图等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-09-24 21:48
 */
import { fabric } from 'fabric'

/**
 * @function drawBackground 绘制背景
 * @param { Object } Canvas 画布实例
 * @param { String } bgUrl 用户上传得原图片链接
 */
export const drawBackground = async (Canvas, bgUrl: string) => {
    return new Promise((resolve: any) => {
        if (!bgUrl) return resolve()

        fabric.Image.fromURL(bgUrl, (img: any) => {

            img.set({
                left: Canvas.width / 2,
                top: Canvas.height / 2,
                originX: 'center',
                originY: 'center'
            })

            /* 短边适配 */
            img.width > img.height ? img.scaleToHeight(Canvas.height, true) : img.scaleToWidth(Canvas.width, true)
            Canvas.setBackgroundImage(img, Canvas.renderAll.bind(Canvas))

            resolve()
        }, { crossOrigin: 'Anonymous' })
    })
}
