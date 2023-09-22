<template>
    <div class="bg"></div>
    <header>定制兔年春节头像</header>

    <div style="width: 100%;">
        <el-button v-for="(item, index) in picList" :key="index" :type="styleIndex === index ? 'primary' : 'info'" @click="styleIndex = index">{{ item.name }}</el-button>
    </div>

    <div class="avatar">
        <img v-if="avatarInfo.url" :src="avatarInfo.url" alt="用户头像">
        <span v-else>+</span>
        <input id="uploadImg" type="file" accept="image/*" @change="uploadFile" />
    </div>
    <span class="avatar-tip">请上传宽高1:1的头像</span>


    <div class="effect">
        <div v-for="(item, index) in picList[styleIndex].frameList" :key="index" :class="`effect-item ${ frameIndex === index ? 'active' : '' }`" @click="selectFrame(index)">
            <img :src="item" alt="">
        </div>
    </div>


    <div class="effect">
        <div v-for="(item, index) in picList[styleIndex].markList" :key="index" @click="selectMark(index)">
            <img :src="item" alt="">
        </div>
    </div>

    <div class="opacity">
        <el-slider v-model="opacity" :min="0.1" :max="1" :step="0.01" size="small" :disabled="!layerList[0].url" @change="opacityChange" />
    </div>

    <el-button type="primary" plain @click="save(false)">预览</el-button>
    <el-button type="success" plain @click="save(true)">保存</el-button>

    <div class="opacity">
        <el-slider v-model="opacity" :min="0.1" :max="1" :step="0.01" size="small" :disabled="!layerList[0].url" @change="opacityChange" />
    </div>

    <div class="stats">
        <p>本站访问人数:<span id="busuanzi_value_site_uv"></span></p>
        <p>本站访问总量:<span id="busuanzi_value_site_pv"></span></p>
        <a class="github" href="https://github.com/xiaoli1999/custom-avatar" target="_blank">
            <img src="./assets/img/github.png" alt="github">
            <span>github</span>
        </a>
    </div>
    <div class="state">部分素材来源于网络，非商业用途，如有侵权请联系删除。</div>
    <footer>© 2023 All rights reserved. Powered by 黎</footer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { judgePC, getCreatedUrl, getImgInfo, downloadImg, base64ToFile, getAuthorization, getUploadAuthorization } from '@/tools/common'
import progress from './tools/progress'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { picList } from '@/tools/picList'

/* 初始化进度条 */
progress.start()

/* 基础数据 */
const isPc = ref<boolean>(judgePC())
const userInfo = {
    url: 'https://v0.api.upyun.com',
    bucket: (import.meta as any).env.VITE_UPYUN_BUCKET,
    name: (import.meta as any).env.VITE_UPYUN_NAME,
    password: (import.meta as any).env.VITE_UPYUN_PASSWORD,
    path: 'img/custom-avatar'
}
const fileName = `li-${ 1e14 - Date.now() }.png`

/* 业务 */
const styleIndex = ref(0)
const frameIndex = ref<number | null>(null)
const showRound = ref<boolean>(true)

const loading = ref<boolean>(false)

const rabbitLi = ref()

const avatarInfo = ref<{ url: string, w: number, h: number, name: string }>({ url: '', w: 0, h: 0, name: '' })
const uploadFile = async (e: any) => {
    if (!e.target.files || !e.target.files.length) return ElMessage.warning('上传失败！')

    const file = e.target.files[0]
    if (!file.type.includes('image')) return ElMessage.warning('请上传正确的图片格式！')

    const url = getCreatedUrl(file) ?? ''
    const imgInfo: any = await getImgInfo(url)
    const name = file.name.split('.').splice(0, file.name.split('.').length - 1).join('.')
    avatarInfo.value = { url, w: imgInfo.width, h: imgInfo.height, name };

    (document.getElementById('uploadImg') as HTMLInputElement).value = ''
}

interface LayerType {
    uuid: string,
    type: string,
    url: string,
    w: number,
    h: number,
    x: number,
    y: number,
    scale: number,
    angle: number,
    opacity: number
    [propName: string]: any
}
const layerList = ref<LayerType[]>([
    {
        uuid: 'effect',
        type: 'img',
        url: '',
        w: 0,
        h: 0,
        x: 0,
        y: 0,
        scale: 0,
        angle: 0,
        opacity: 1
    }
])

const selectFrame = (index: number) => {
    if (!avatarInfo.value.url) return ElMessage.warning('请先上传原头像！')
    frameIndex.value = index

    loading.value = true
    layerList.value[0].url = picList[styleIndex.value].frameList[index]
}

const selectMark = (index: number) => {
    if (!avatarInfo.value.url) return ElMessage.warning('请先上传原头像！')
    frameIndex.value = index

    loading.value = true
    layerList.value[0].url = picList[styleIndex.value].frameList[index]
}

const opacity = ref<number>(1)
const opacityChange = (num: number) => layerList.value[0].opacity = num

const drawComplete = () => {
    loading.value = false
}

const previewShow = ref<boolean>(false)
const previewUrl = ref<string>('')
const save = async (isSave) => {
    if (!avatarInfo.value.url || !layerList.value[0].url) return ElMessage.warning('请上传原头像并选择效果图！')

    previewShow.value = false
    const url = await rabbitLi.value.save()
    if (isSave) return downloadImg(url, avatarInfo.value.name)

    previewShow.value= true
    previewUrl.value= url

    const uploadData = new FormData()

    const file = base64ToFile(url, fileName, 'png')
    uploadData.append('file', file)

    const { policy, authorization } = getUploadAuthorization(userInfo) as any
    uploadData.append('policy', policy)
    uploadData.append('authorization', authorization)

    console.log(url)

    axios({ method: 'POST', url: `${ userInfo.url }/${ atob(userInfo.bucket) }`, data: uploadData }).catch(() => ({}))
}

const avatarList = ref([])
const getAvatarList = async () => {
    const url = `${ userInfo.url }/${ atob(userInfo.bucket) }/${ userInfo.path }`
    const { date, authorization } = getAuthorization(userInfo)
    const headers = { authorization, 'x-date': date, Accept: 'application/json' }
    const { files } = await axios({ method: 'GET', url, headers }).catch(() => ({})) as any

    avatarList.value = files || []
}

onMounted(async () => {
    progress.close()
    await getAvatarList()
})
</script>

<style lang="less" scoped>
/* 兼容移动端 */
@media only screen and (max-width: 768px) {
    /* 移动端 */
}
</style>
