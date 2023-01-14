/**
 * @file full.js 设置日期
 * @description 全屏动画js
 * @author xiao li
 * @copyright 黎<https://www.xiaoli.vip>
 * @createDate 2023-01-08 16:20
 */

const emoteList = ['🐰', '🐇', '🧨', '🎉', '🐇', '🏮', '🐰', '💰', '⛄', '🐇', '❄', '🧧']

let innerW, innerH

const setInnerSize = () => {
    innerW = window.innerWidth
    innerH = window.innerHeight
}

/**
 * @function JudgePC 判断是当前浏览器信息是否为pc
 * @return { Boolean } 返回是否是pc
 */
const JudgePC = () => {
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

let isPc = JudgePC()

/**
 * @function 生成随机表情元素
 * @returns {{emoteEl: HTMLDivElement, emoteParams: {left: number, top: number, opacity: number, fs: number, transitionDuration: number}}}
 */
const createEmoteElement = () => {
    const fsRange = isPc ? [16, 14] : [14, 6]
    const fs = fsRange[0] + Math.round(Math.random() * fsRange[1])
    const left = Math.round(Math.random() * ((innerW - (fs / 2)) - (fs / 2)))
    const top = -fs - 10
    const opacity = ((Math.random() * 16 + 84) / 100).toFixed(2) - 0
    const transitionDuration = 2000 + Math.round(Math.random() * 2000)

    const emoteEl = $('<div></div>').css({
        position: 'absolute',
        color: '#fff',
        top: `${ top }px`,
        left: `${ left }px`,
        fontSize: `${fs }px`,
        opacity: opacity,
        zIndex: 9999,
        textShadow: `0 0 ${ 10 + fs / 2 }px #ffffffcc`,
        transition: `transform ${ transitionDuration }ms linear`
    }).html(emoteList[Math.round(Math.random() * (emoteList.length - 1))])

    return { emoteEl, emoteParams: { fs, left, top, opacity, transitionDuration } }
}

const setEmoteAnimate = () => {
    const { emoteEl, emoteParams } = createEmoteElement()
    $('body').append(emoteEl)

    const leftRange = isPc ? [-80, 80] : [-40, 40]
    const endLeft = emoteParams.left + leftRange[Math.round(Math.random())]
    const endTop = innerH - emoteEl.height() + Math.round(Math.random() * 10)
    const moveDuration = innerH * (isPc ? 10 : 18) + Math.round(Math.random() * 4000)
    const endScale = 1.2 + ((Math.round(Math.random() * 4) / 10).toFixed(2) - 0)
    const hideDuration = 1200 + Math.round(Math.random() * 2000)

    emoteEl.animate({ left: `${ endLeft }px`, top: `${ endTop }px` }, moveDuration, 'linear', () => {
        emoteEl.css({ transform: `scale(${ endScale })` })
        .animate({ opacity: 0 }, hideDuration, 'linear', () => (emoteEl.remove()))
    })
}

let num = 0
const start = () => setInterval(() => {
    if (num % 10 === 0) {
        setInnerSize()
        isPc = JudgePC()
    }
    num += 1
    setEmoteAnimate()
}, isPc ? 320 : 560)

$(document).ready(() => start())

console.log('%c 🐇年春节全屏动画效果🌈 | 黎 | https://github.com/xiaoli1999/fullScreen-animation ', 'color: #f4f4f4;background: #444; padding:5px 0;border-radius:2px;')
