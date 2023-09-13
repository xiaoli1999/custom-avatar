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

/**
 * @function getAuthorization 获取授权
 * @param { Object } userInfo 用户信息
 * @param { String } userInfo.bucket 文服务名称
 * @param { String } userInfo.name 用户名称
 * @param { String } userInfo.password 用户密码
 * @param { String } userInfo.path 查找目录途径
 * @return { String } date 大写时间
 * @return { String } authorization 签名
 */
export const getAuthorization = (userInfo: any = {}) => {
    const info = JSON.parse(JSON.stringify(userInfo))
    info.bucket = atob(info.bucket)
    info.name = atob(info.name)
    info.password = atob(info.password)

    const { HexMD5, b64hamcsha1 }  = (window || {}) as any

    const date = (new Date).toUTCString()

    /* 计算 Authorization */
    const passwordMd5 = HexMD5.MD5(info.password).toString(HexMD5.enc.Hex)

    /* [Method-请求方法, URI-请求路径, date] */
    const arr = ['GET', `/${ info.bucket }/${ info.path }`, date]

    const authorization = `UPYUN ${ info.name }:${ b64hamcsha1(passwordMd5, arr.join('&')) }`

    return { date, authorization }
}

/**
 * @function getUploadAuthorization 获取授权
 * @param { Object } userInfo 用户信息
 * @param { String } userInfo.bucket 文服务名称
 * @param { String } userInfo.name 用户名称
 * @param { String } userInfo.password 用户密码
 * @param { String } userInfo.path 上传途径
 * @return { String } policy 策略
 * @return { String } authorization 签名
 */
export const getUploadAuthorization = (userInfo: any = {}) => {
    const info = JSON.parse(JSON.stringify(userInfo))
    info.bucket = atob(info.bucket)
    info.name = atob(info.name)
    info.password = atob(info.password)

    const policyObj = {
        bucket: info.bucket,
        'save-key': `${ info.path }/{filename}{.suffix}`,
        expiration: new Date().getTime() + 600 /* 过期时间，在当前时间+10分钟 */
    }
    const policy =  btoa(JSON.stringify(policyObj))

    const { HexMD5, b64hamcsha1 }  = (window || {}) as any

    /* 计算 Authorization */
    const passwordMd5 = HexMD5.MD5(info.password).toString(HexMD5.enc.Hex)

    /* [Method-请求方法, URI-请求路径, policy] */
    const arr = ['POST', `/${ info.bucket }`, policy]

    const authorization = `UPYUN ${ info.name }:${ b64hamcsha1(passwordMd5, arr.join('&')) }`

    return { policy, authorization }
}

/**
 * @function base64ToFile
 * @description base64转file对象
 * @return { File } file对象
 */
export const base64ToFile = (base64String, name, type) => {
    const byteCharacters = atob(base64String.split(',')[1])
    const byteArrays: any[] = []

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512)
        const byteNumbers = new Array(slice.length)

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays, { type })

    return new File([blob], name, { type }) as File
}

/**
 * @function getUrlBase64 图片转base64
 * @param { String } url 图片链接
 * @param { String } type 转图片的格式
 * @return { String } base64
 */
export const fileUrlToBase64 = (url:string, type: string): object => {
    return new Promise((resolve: any) => {
        let canvas: any = document.createElement('canvas')
        const ctx: any = canvas.getContext('2d')
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0, img.width, img.height)
            const dataURL = canvas.toDataURL('image/' + type)
            canvas = null
            const data = {
                url: dataURL,
                w: img.width,
                h: img.height
            }
            resolve(data)
        }
        img.src = url
    })
}
