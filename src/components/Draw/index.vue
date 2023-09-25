<template>
    <div class="draw" :style="{ transform: `translate(-50%, -50%) scale(0.4)` }">
        <canvas :id="CanvasId" />
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { fabric } from 'fabric'
import { canvasSize } from './config/canvas'
import { control, hiddenControl } from './config/control'
import { initCanvas } from './modules/init'
import { drawBackground } from './modules/background'
import {findCanvasItem, createUuid, addOrReplaceLayer} from './modules/common'
import { drawImg } from './modules/common'

const props = defineProps({
    bg: {
        type: String,
        require: true,
        default: ''
    },
    frame: {
        type: String,
        require: true,
        default: ''
    }
})

/**
 * @const { String } inkId 画布的唯一id
 */
const CanvasId = ref<string>('li-' + createUuid())

/**
 * @let { Object } Canvas 画布实例
 */
let Canvas: any
/**
 * @const { Boolean } Loading 加载动画
 */
const Loading = ref<boolean>(false)

/* 设置中心点 */
fabric.Object.prototype.originX = 'center'
fabric.Object.prototype.originY = 'center'

/* 初始化控件 */
const initFabricControl = () => {
    fabric.Object.prototype.set(control)
    // 设置缩放摇杆偏移
    fabric.Object.prototype.controls.mtr.offsetY = control.mtrOffsetY
    // 隐藏不需要的控件
    hiddenControl.map((name: string) => (fabric.Object.prototype.controls[name].visible = false))

    /* 添加删除控件 */
    const delImgElement = document.createElement('img')
    delImgElement.src = new URL('./icons/delete.png', import.meta.url).href

    const size = 40

    const deleteControlHandel = (e, transform:any) => {
        const target = transform.target
        const canvas = target.canvas
        canvas.remove(target).renderAll()
    }

    const renderDeleteIcon = (ctx:any, left:any, top:any, styleOverride:any, fabricObject:any) => {
        ctx.save()
        ctx.translate(left, top)
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
        ctx.drawImage(delImgElement, -size / 2, -size / 2, size, size)
        ctx.restore()
    }

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        cornerSize: size,
        offsetY: -size,
        offsetX: size,
        cursorStyle: 'pointer',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mouseUpHandler: deleteControlHandel,
        render: renderDeleteIcon
    })
}

/* 元素缩放时 */
const canvasMouseScaling = (e: any) => {
    if (e.target.flipX || e.target.flipY) {
        e.target.flipX = false
        e.target.flipY = false
    }
}

/* 初始化画布 */
const init = () => {
    /* 初始化控件 */
    initFabricControl()

    /* 初始化画布 */
    Canvas = initCanvas(CanvasId.value, canvasSize, false)

    // 元素缩放事件
    Canvas.on('object:scaling', canvasMouseScaling)
}

/* 更改原图 */
watch(() => props.bg, async (val) => (await drawBackground(Canvas, val)))

onMounted(async () => init())

const frameName = 'frame'

/**
 * @function addFrame 添加头像框图层
 * @param { String } url 头像框链接
 */
const addFrame = async (url = '') => {
    if (!url) return

    const frameLayer: any = await drawImg(`${ url }!frame`)
    frameLayer.set({
        left: Canvas.width / 2,
        top: Canvas.height / 2
    })

    /* 隐藏删除按钮 */
    frameLayer.setControlVisible('deleteControl', false)

    frameLayer.scaleToWidth(Canvas.width, true)

    frameLayer.name = frameName
    addOrReplaceLayer(Canvas, frameLayer)
}

/**
 * @function setFrameOpacity 设置头像框图层
 * @param { Number } opacity 透明度
 */
const setFrameOpacity = (opacity = 1) => {
    const frameLayer: any = findCanvasItem(Canvas, frameName)[1] || ''

    if (!frameLayer) return

    frameLayer.set({ opacity })
    Canvas.renderAll()
}

/**
 * @function addMark 添加贴纸
 * @param { String } url 贴纸链接
 */
const addMark = async (url) => {
    if (!url) return

    const markLayer: any = await drawImg(url)
    markLayer.set({
        left: Canvas.width / 2,
        top: Canvas.height / 2
    })

    markLayer.width > markLayer.height ? markLayer.scaleToHeight(200, true) : markLayer.scaleToWidth(200, true)

    markLayer.name = `mark-${ createUuid() }`
    addOrReplaceLayer(Canvas, markLayer)
}

/**
 * @function save 保存作品图及效果图
 * @return { String } result base64 保存/预览时返回
 */
const save = async (): Promise<string> => {
    return Canvas.toDataURL({
        format: 'png',
        left: 0,
        top: 0,
        width: Canvas.width,
        height: Canvas.height
    })
}


/* 暴露给父组件可使用的方法 */
defineExpose({ addFrame, addMark, setFrameOpacity, save })
</script>

<style lang="less" scoped>
.draw {
    position: absolute;
    top: 50% !important;
    left: 50% !important;
}
</style>
