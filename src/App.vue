<template>
    <div class="bg"></div>
    <header>定制兔年头像</header>
    <el-button type="primary">测试element ui</el-button>
    <input type="file" accept=".jpg,.png" @change="uploadFile" />
    <img :src="imgUrl" alt="">
    <div style="position: relative;width: 200px;height: 200px;">
        <img src="./assets/img/avatar.jpg" alt="" style="width: 100%;">
        <img src="./assets/img/li/left.png" alt="" style="position: absolute;width: 100%;height: 100%;z-index: 2;left: 0;top: 0;">
    </div>
    <div style="position: relative;width: 200px;height: 200px;">
        <img v-for="(item, index) in effectList" :key="index" :src="item.imgUrl" alt="" style="width: 100%;">
    </div>
    <div style="width: 400px;height: 400px;border: 1px dashed #dedede;border-radius: 50%;">
        <canvas id="test" style="width: 400px;height: 400px;"></canvas>
    </div>

</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import progress from './tools/progress'

import { getCreatedUrl } from '@/tools/common'
import { fabric } from 'fabric'
import { effectList } from './tools/effectList'

console.log(effectList)

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

<style lang="less" scoped>
.bg {
    position: fixed;
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    //background: url("./assets/img/bg.jpg") center no-repeat;
    //background-size: cover;
    //filter: blur(2px);
    z-index: -1;
    //opacity: .6;
}

/* 兼容移动端 */
//@media only screen and (max-width: 768px) {
//
//}
</style>
