/**
 * @file control.ts 控件基础配置
 * @description 控件样式、显示隐藏等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-19 09:37
 */

import liLeft from '../assets/img/li/left.png'
import liRight from '../assets/img/li/right.png'

export interface EffectType {
    imgUrl: string,
    designerName: string
}
export const effectList: EffectType[] = [
    {
        imgUrl: liLeft,
        designerName: '小黎-左'
    },
    {
        imgUrl: liRight,
        designerName: '小黎-右'
    }
]
