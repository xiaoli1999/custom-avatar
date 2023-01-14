/**
 * @file index.ts type类型、接口等
 * @description 用于画布组件的props及其他参数类型接口
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-12 14:54
 */

export interface BgInfoType {
    url: string
    w: number
    h: number,
    name: string
}

export interface LayerType {
    uuid: string,
    type: string,
    url: string,
    w: number,
    h: number,
    x: number,
    y: number,
    scale: number,
    angle: number
    [propName: string]: any
}

export interface ControlType {
    [propName: string]: any
}
