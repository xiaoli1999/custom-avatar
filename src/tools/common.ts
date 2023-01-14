/**
 * @file common.ts 公共方法
 * @description 全局公共方法、工具函数
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-1 21:38
 */

/**
 * @function judgePC 判断是当前浏览器信息是否为pc
 * @return { Boolean } 返回是否是pc
 */
export const judgePC = () => {
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
 * @function getStaticUrl 获取本子资源url
 * @param { String } location 本地资源绝对地址
 * @return { string } url 返回本地资源链接
 */
export const getStaticUrl = (location: string) => {
    if (!location) return ''

    return new URL(location, import.meta.url).href
}

/**
 * @function getCreatedUrl 创建本地链接
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
 * @function downloadImg 下载图片
 * @param { String } url 图片链接
 * @param { String } name 图片名称
 */
export const downloadImg = (url: string, name: string) => {
    const a = document.createElement('a')
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
    a.download = `黎·春节头像-${ name }`
    a.href = url
    a.dispatchEvent(event)
    a.remove()
}
