/**
 * @file control.ts 控件基础配置
 * @description 控件样式、显示隐藏等
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-19 09:37
 */
import { getStaticUrl } from './common'

export interface EffectType {
    imgUrl: string,
    designerName: string,
    designerUrl: string
}
export const effectList: EffectType[] = [
    {
        imgUrl: getStaticUrl('../assets/img/li/left.png'),
        designerName: '小黎购买',
        designerUrl: ''
    }
]
