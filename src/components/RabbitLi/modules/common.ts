/**
 * @file common.ts 公共方法
 * @description 用于画布的公共方法等
 * @author xiao li
 * @copyright 北溟有鱼<https://inkinkme.com>
 * @createDate 2022-08-04 12:22
 */
import { hiddenLayerNameArr } from '../config/name'

/**
 * @function judgePC 判断是当前浏览器信息是否为pc
 * @return { Boolean } 返回是否是pc
 */
export const judgePC = () => {
    let userAgent
    if (window && window.navigator) {
        userAgent = window.navigator.userAgent
    } else {
        return true
    }

    const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod', 'iPad']
    for (let i = 0; i < agents.length; i++) {
        if (userAgent.indexOf(agents[i]) >= 0) return false
    }
    return true
}

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
        Canvas.add(layer).renderAll()
    } else {
        Canvas.insertAt(layer, index)
        Canvas.remove(item)
        Canvas.renderAll()
    }
}

interface Location {
    x: number,
    y: number
}

interface SkuInfo {
    design: {
        x: number,
        y: number,
        w?: number,
        h?: number
    },
    visible: {
        x: number,
        y: number,
        w?: number,
        h?: number
    }
}

/**
 * @function calcOffsetToCanvas 计算缩放到画布的画布坐标
 * @param { Object } Canvas 缩放比例
 * @param { Object } skuInfo sku信息
 * @param { Object } location location信息
 * @return { Object } { left, top } 返回坐标信息
 */
export const calcOffsetToCanvas = (Canvas: any, skuInfo: SkuInfo, location: Location) => {
    if (Canvas.drawSku) {
        return {
            left: (location.x - skuInfo.design.x) * Canvas.Scale + skuInfo.visible.x * Canvas.originalScale,
            top: (location.y - skuInfo.design.y) * Canvas.Scale + skuInfo.visible.y * Canvas.originalScale
        }
    } else {
        return { left: location.x * Canvas.originalScale, top: location.y * Canvas.originalScale }
    }
}

/**
 * @function calcOffsetToReal 计算画布缩放坐标转为真实坐标
 * @param { Object } Canvas 缩放比例
 * @param { Number } left x坐标
 * @param { Number } top y坐标
 * @param { Object } skuInfo sku信息
 * @return { Object } { x, y } 返回坐标信息
 */
export const calcOffsetToReal = (Canvas: any, left: number, top: number, skuInfo: SkuInfo) => {
    if (Canvas.drawSku) {
        return {
            x: (left - skuInfo.visible.x * Canvas.originalScale) / Canvas.Scale + skuInfo.design.x,
            y: (top - skuInfo.visible.y * Canvas.originalScale) / Canvas.Scale + skuInfo.design.y
        }
    } else {
        return { x: left / Canvas.originalScale, y: top / Canvas.originalScale }
    }
}

/**
 * @function setSkuOrOtherVisible 设置图层可见
 * @param { Object } Canvas Canvas对象
 * @param { Boolean } visible 默认为false
 */
export const setSkuOrOtherVisible = (Canvas: any, visible = false) => {
    hiddenLayerNameArr.map(name => {
        const [index, item] = findCanvasItem(Canvas, name)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (index !== -1) item.visible = visible
    })
    Canvas.renderAll()
}
