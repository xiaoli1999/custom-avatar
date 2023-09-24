/**
 * @file common.ts 公共方法
 * @description 用于画布的公共方法等
 * @author xiao li
 * @copyright 北溟有鱼<https://inkinkme.com>
 * @createDate 2022-08-04 12:22
 */
import { fabric } from 'fabric'

/**
 * @function createUuid 创建uuid
 * @return { String } uuid 随机id
 */

export const createUuid = (): string => {
    const tempUrl = URL.createObjectURL(new Blob())
    const uuid = tempUrl.toString()
    URL.revokeObjectURL(tempUrl)
    return uuid.substr(uuid.lastIndexOf('/') + 1)
}

interface imgToBase64ObjType {
    url: string
    w: number
    h: number
}

/**
 * @function getUrlBase64 图片转base64
 * @param { String } url 图片链接
 * @param { String } type 转图片的格式
 * @return { String } base64
 */
export const getUrlBase64 = (url:string, type: string): object => {
    return new Promise((resolve: any) => {
        let canvas: any = document.createElement('canvas')
        const ctx: any = canvas.getContext('2d')
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0, img.width, img.height)
            const dataURL = canvas.toDataURL(`image/${type}`)
            canvas = null
            const data: imgToBase64ObjType = {
                url: dataURL,
                w: img.width,
                h: img.height
            }
            resolve(data)
        }
        img.src = url
    })
}

/**
 * @function findCanvasItem 查找当前对象及下标
 * @param { Object } Canvas 画布实例对象
 * @param { string } name 画布对象name
 * @return { Array } [index, item] 下标及对象
 */
export const findCanvasItem = (Canvas: any, name: string): Array<number | object> => {
    const index = Canvas.getObjects().findIndex((i: any) => i.name === name)
    return [index, index === -1 ? null : Canvas.item(index)]
}

/**
 * @function addOrReplaceLayer 新增或替换图层
 * @param { Object } Canvas 画布实例对象
 * @param { Object } layer 画布对象
 */
export const addOrReplaceLayer = (Canvas: any, layer: any) => {
    const [index, item] = findCanvasItem(Canvas, layer.name)
    if (index === -1) {
        if (layer.name === 'frame') {
            Canvas.insertAt(layer, index).renderAll()
        } else {
            Canvas.add(layer).renderAll()
        }
    } else {
        Canvas.insertAt(layer, index)
        Canvas.remove(item)
        Canvas.renderAll()
    }
}

/**
 * @function drawImg 绘制图片
 * @param { String } url 图片链接
 * @return { Object } img 返回图片画布对象
 */
export const drawImg = (url: string) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve: any) => {
        fabric.Image.fromURL(url, (img) => resolve(img), { crossOrigin: 'Anonymous' })
    })
}
