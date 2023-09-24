/**
 * @file canvas.ts 画布基础配置
 * @description 画布大小配置等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-12 14:36
 */

export interface canvasType {
    width: number,
    height: number
}

/**
 * @desc 操纵控件
 * @param { Object } canvasSize 画布尺寸 { width, height }
 */
export const canvasSize: canvasType = {
    width: 1000,
    height: 1000
}
