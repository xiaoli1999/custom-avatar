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
    designerName: string
}
export const effectList: EffectType[] = [
    {
        imgUrl: getStaticUrl('../assets/img/li/left.png'),
        designerName: '小黎-左'
    },
    {
        imgUrl: getStaticUrl('../assets/img/li/right.png'),
        designerName: '小黎-右'
    },
    {
        imgUrl: 'https://img1.baidu.com/it/u=1746898407,3753163068&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        designerName: '小黎-测试'
    }
]
