<template>
    <div>定制兔年头像</div>
    <el-button type="primary">测试element ui</el-button>
    <input type="file" accept=".jpg,.png" @change="uploadFile" />
    <img :src="imgUrl" alt="">
    <div>
        <img src="./assets/a.png" alt="">
    </div>
    <div style="width: 400px;height: 400px;border: 1px dashed #dedede;border-radius: 50%;">
        <canvas id="test" style="width: 400px;height: 400px;"></canvas>
    </div>

</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import progress from './tools/progress'
import './styles/normalize.less'
import { getCreatedUrl } from '@/tools/common'
import { fabric } from 'fabric'

progress.start()

let Canvas

const imgUrl = ref<string>('')
const uploadFile = async (e: any) => {
    imgUrl.value = getCreatedUrl(e.target.files[0])
    fabric.Image.fromURL(imgUrl.value, (img) => {
        console.log(img)
        Canvas.add(img).renderAll()
    }, { crossOrigin: 'Anonymous' })
}


onMounted(() => {
    progress.close()
    Canvas = new fabric.Canvas('test', { width: 400, height: 400 })
})
</script>

<!--<style lang="less" scoped>-->

<!--</style>-->
