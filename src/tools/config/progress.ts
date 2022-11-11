import progress from 'nprogress'
import 'nprogress/nprogress.css'

progress.configure({
    easing: 'ease', // 动画方式
    speed: 1200, // 递增进度条的速度
    showSpinner: false, // 进度环显示隐藏（右上角）
    trickleSpeed: 240, // 自动递增间隔
    minimum: 0.18, // 更改启动时使用的最小百分比
    parent: 'body' //指定进度条的父容器
})

export const start = () => progress.start()

export const close = () => progress.done()

export default { start, close }
