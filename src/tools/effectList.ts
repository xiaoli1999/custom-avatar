/**
 * @file control.ts 控件基础配置
 * @description 控件样式、显示隐藏等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-19 09:37
 */

import li1Left from '../assets/img/li-1/left.png'
import li1Right from '../assets/img/li-1/right.png'

import li2Left from '../assets/img/li-2/left.png'
import li2Right from '../assets/img/li-2/right.png'

export interface EffectType {
    imgUrl: string,
    designerName: string
}
export const effectList: EffectType[] = [
    {
        imgUrl: li1Left,
        designerName: '小黎-左'
    },
    {
        imgUrl: li1Right,
        designerName: '小黎-右'
    },
    {
        imgUrl: li2Left,
        designerName: '小黎-左'
    },
    {
        imgUrl: li2Right,
        designerName: '小黎-右'
    }
]
