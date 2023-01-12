/**
 * @file image.ts 图片图层
 * @description 绘制图片、模板照片图层等
 * @author xiao li
 * @copyright 北溟有鱼<https://inkinkme.com>
 * @createDate 2022-07-25 14:20
 */
import { fabric } from 'fabric'
import { calcOffsetToCanvas, addOrReplaceLayer } from '../common'
import {LayerType} from '../../types'

/**
 * @function drawImgLayer 绘制图片图层
 * @param { Object } Canvas 画布实例对象
 * @param { Object } layer 图层对象
 * @return { Object } layer 返回图片 图层对象
 */
export const drawImgLayer = (Canvas: any, layer: LayerType) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve: any) => {
        /* todo 绘制图片 */
        return resolve()
    })
}

/**
 * @function getImgInfo 获取图片信息
 * @param { String } url 图片链接
 * @return { Object } img 返回图片对象信息
 */
export const getImgInfo = (url: string) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve: any) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.src = url
    })
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
