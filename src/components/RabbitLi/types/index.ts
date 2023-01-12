/**
 * @file index.ts type类型、接口等
 * @description 用于画布组件的props及其他参数类型接口
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-12 14:54
 */

export interface SkuInfoType {
    [propName: string]: any
}

export interface LayerType {
    uuid: string,
    type: string,
    url: string,
    width: number,
    height: number,
    top: number,
    left: number,
    scale: number,
    angle: number
    [propName: string]: any
}

export interface BgInfoType {
    bgUrl: string
    bgW?: number
    bgH?: number
    [propName: string]: any
}

export interface ControlType {
    [propName: string]: any
}
