<template>
    <div class="draw" :style="{ transform: `translate(-50%, -50%)` }">
        <canvas :id="CanvasId"></canvas>
        <canvas :id="'Production-' + CanvasId" style="position: fixed; top: -9999px;left: 0;z-index: -1;display: none;"></canvas>
        <div v-show="Loading" class="draw-loading">
            <img src="./icons/loading.gif" alt="">
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, PropType, onMounted, watch } from 'vue'
import { fabric } from 'fabric'
import { canvasSize } from './config/canvas'
import { control, hiddenControl } from './config/control'
import { fixedLayerNameArr } from './config/name'
import { BgInfoType, LayerType } from './types'
import { initCanvas } from './modules/init'
import { drawBackground } from './modules/background'
import { drawLayer } from './modules/layer'
import { findCanvasItem, createUuid } from './modules/common'

const props = defineProps({
    bgInfo: {
        type: Object as PropType<BgInfoType>,
        require: true,
        default: () => ({ url: '', w: 0, h: 0 })
    },
    layerList: {
        type: Array as PropType<LayerType[]>,
        require: true,
        default: () => ([])
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
 * @let { Object } ProductionCanvas 生产画布实例
 */
let ProductionCanvas: any
/**
 * @const { Boolean } Loading 加载动画
 */
const Loading = ref<boolean>(false)
/**
 * @let { Array } LayerList 图层数据
 */
let LayerList = reactive<any[]>(JSON.parse(JSON.stringify(props.layerList)))
/**
 * @let { String } Uuid 当前选中的uuid
 */
const Uuid = ref<string>('')

/* 字父通信 */
const emit = defineEmits(['drawComplete', 'updateLayer'])

/* 初始化控件 */
const initFabricControl = () => {
    fabric.Object.prototype.set(control)
    // 设置缩放摇杆偏移
    fabric.Object.prototype.controls.mtr.offsetY = control.mtrOffsetY
    // 隐藏不需要的控件
    hiddenControl.map((name: string) => (fabric.Object.prototype.controls[name].visible = false))
}

/* 鼠标按下 */
const canvasMouseDown = (e: any) => {
    if (!e.target) return (Uuid.value = '')
    Uuid.value = fixedLayerNameArr.includes(e.target.name) ? '' : e.target.name
}

// 鼠标抬起
const canvasMouseUp = (e: any) => {
    const { target, transform } = e
    if (!target || !transform) return
    const type: string = transform.action
    const location: any = target.getCenterPoint()
    const layerIndex = LayerList.findIndex(i => i.uuid === Uuid.value)
    if (layerIndex === -1) return (Uuid.value = '')

    if (type === 'drag') {
        const { x, y } = location
        LayerList[layerIndex].x = x
        LayerList[layerIndex].y = y
    } else if (type === 'scale') {
        if (target.flipX || target.flipY) {
            target.flipX = false
            target.flipY = false
        }
        LayerList[layerIndex].scale = (target.scaleX || target.scaleY)
    } else if (type === 'rotate') {
        LayerList[layerIndex].angle = target.angle
    } else { /* empty */ }
}

// 元素缩放时
const canvasMouseScaling = (e: any) => {
    if (e.target.flipX || e.target.flipY) {
        e.target.flipX = false
        e.target.flipY = false
    }
}

/**
 * @function drawAll 绘制所有图层
 * @param { Object } canvas 画布实例
 * @param { Array } layerList 图层数组
 */
const drawAll = async (canvas: any, layerList: LayerType[]) => {
    for (const item of layerList) {
        await drawLayer(canvas, item)
    }
}

// 绘制完成emit
const drawComplete = () => emit('drawComplete')
/**
 * @function save 保存作品图及效果图
 * @return { String } result base64 保存/预览时返回
 */
const save = async (): Promise<string> => {
    Loading.value = true
    if (ProductionCanvas) ProductionCanvas.clear()

    ProductionCanvas = initCanvas(`Production-${ CanvasId.value }`, canvasSize, false)
    await drawBackground(ProductionCanvas, props.bgInfo)
    await drawAll(ProductionCanvas, LayerList)

    Loading.value = false
    drawComplete()

    return ProductionCanvas.toDataURL({
        format: 'png',
        left: 0,
        top: 0,
        width: ProductionCanvas.width,
        height: ProductionCanvas.height
    })
}

// 被动更改背景
watch(() => props.bgInfo, async (val) => (await drawBackground(Canvas, val)))

// 被动更改skuInfo 及 layerList
watch(() => props.layerList, async (layerList, oldLayerList) => {
    if (JSON.stringify(layerList) === JSON.stringify(oldLayerList)) return

    Loading.value = true
    LayerList = JSON.parse(JSON.stringify(layerList))

    if (Canvas && Canvas.getObjects().length) {
        Canvas.getObjects().filter((i: any) => !fixedLayerNameArr.includes(i.name)).map((layer: any) => {
            const [index, item] = findCanvasItem(Canvas, layer.name)
            if (index !== -1) Canvas.remove(item).renderAll()
        })
    }

    await drawAll(Canvas, LayerList)
    drawComplete()
    Loading.value = false
})

onMounted(async () => {
    Loading.value = true
    /* 初始化控件 */
    initFabricControl()

    /* 初始化画布 */
    Canvas = initCanvas(CanvasId.value, canvasSize, false)

    Loading.value = false
    drawComplete()

    /* 绑定交互事件 */
    // 鼠标按下事件
    Canvas.on('mouse:down', canvasMouseDown)
    // 鼠标抬起事件
    Canvas.on('mouse:up', canvasMouseUp)
    // 元素缩放事件
    Canvas.on('object:scaling', canvasMouseScaling)
})

// 暴露给父组件可使用的方法
defineExpose({ drawAll, save })
</script>

<style lang="less" scoped>
.draw {
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    //z-index: 10;
    //box-shadow: 0 4px 16px 1px #dfddc6;
    //border-radius: 8px;

    .draw-loading {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 11;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: #fbfbfb;

        > img {
            display: block;
            width: 68%;
            object-fit: contain;
        }
    }

    /* 修复最新 fabric 生成canvas对象时外层包裹父级类 canvas-container */
    :deep(.canvas-container:nth-child(2)) {
        display: none;
    }
}
</style>
