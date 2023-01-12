/**
 * @file common.ts 公共方法
 * @description 全局公共方法、工具函数
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-1 21:38
 */

/**
 * @function JudgePC 判断是当前浏览器信息是否为pc
 * @return { Boolean } 返回是否是pc
 */
export const JudgePC = () => {
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
 * @function getCreatedUrl 判断是当前浏览器信息是否为pc
 * @param { Object } file input的file对象
 * @return { string } url 返回本地图片链接
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
