/**
 * @file common.ts 公共方法
 * @description 全局公共方法、工具函数
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-1 21:38
 */

export const getCreatedUrl = (file: any) => {
    let url = '' as string

    if (window.URL.createObjectURL !== undefined ) {
        url = window.URL.createObjectURL(file)
    } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file)
    }

    return url
}
