<template>
    <div class="bg">
        <img class="bg-l-1" src="./assets/img/bg-l-1.png" alt="">
        <img class="bg-l-2" src="./assets/img/bg-l-2.png" alt="">
        <img class="bg-l-3" src="./assets/img/bg-l-3.png" alt="">
        <img class="bg-r-1" src="./assets/img/bg-r-1.png" alt="">
        <img class="bg-r-2" src="./assets/img/bg-r-2.png" alt="">
        <img class="bg-r-3" src="./assets/img/bg-r-3.png" alt="">
    </div>

    <header>
        <div class="header-content">
            <div>
                <img src="https://cdn.xiaoli.vip/project/logo.jpg" alt="">
                采黎 • 定制头像
            </div>
            <!--todo 滚动播放-->
            <div></div>
        </div>
    </header>
    <div class="fasten"></div>
    <main>
        <div class="fasten"></div>
        <div class="avatar-warp">
            <img class="left" src="./assets/img/more-left.png" alt="" @click="changeFrame(false)">
            <div class="avatar" :class="showRound ? 'circle' : ''">
                <Draw ref="DrawRef" :bg="originAvatarUrl" />
            </div>
            <img class="more-right" src="./assets/img/more-right.png" alt="" @click="changeFrame(true)">
        </div>
        <div class="avatar-panel">
            <el-button type="warning" plain @click="showRound  = !showRound">更换形状</el-button>
            <el-button type="success" @click="uploadImgRef.click()">上传头像</el-button>
        </div>
        <div class="avatar-style">
            <div v-for="(item, index) in picList" :key="index" :class="styleIndex === index ? 'active' : ''"  @click="styleIndex = index">{{ item.name }}</div>
        </div>
        <div class="avatar-option">
            <p>头像框</p>
            <div class="effect-list">
                <div v-for="(item, index) in picList[styleIndex].frameList" :key="index" :class="`effect-item ${ item === frameUrl ? 'active' : '' }`" @click="selectFrame(index)">
                    <img :src="item" alt="">
                </div>
            </div>
        </div>
        <div class="avatar-option">
            <p>贴纸</p>
            <div class="effect-list">
                <div v-for="(item, index) in picList[styleIndex].frameList" :key="index" @click="selectMark(index)">
                    <img :src="item" alt="">
                </div>
            </div>
        </div>
        <div class="avatar-option">
            <p>透明度</p>
            <div class="opacity">
                <el-slider v-model="opacity" :min="0.1" :max="1" :step="0.01" size="small" @change="opacityChange" />
            </div>
        </div>

        <div class="avatar-save">
            <el-button type="success" plain @click="save(true)">生成头像</el-button>
            <el-button type="primary" plain @click="save(false)">分享给朋友</el-button>
        </div>
    </main>



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

    <input ref="uploadImgRef" id="uploadImg" type="file" accept="image/*" @change="uploadFile" style="position: absolute;top: -9999px;left: -9999px;" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getCreatedUrl, downloadImg, base64ToFile, getAuthorization, getUploadAuthorization } from '@/tools/common'
import progress from './tools/progress'
import Draw from './components/Draw/index.vue'
import { picList } from '@/tools/picList'
import { ElMessage } from 'element-plus'
import axios from 'axios'

/* 初始化进度条 */
progress.start()

/* 基础数据 */
const userInfo = {
    url: 'https://v0.api.upyun.com',
    bucket: (import.meta as any).env.VITE_UPYUN_BUCKET,
    name: (import.meta as any).env.VITE_UPYUN_NAME,
    password: (import.meta as any).env.VITE_UPYUN_PASSWORD,
    path: 'img/custom-avatar'
}
const fileName = `li-${ 1e14 - Date.now() }.png`

/* 业务 */
const styleIndex = ref(2)
const originAvatarUrl = ref<string>('')
const selectFrameIndex = ref<number | null>(null)
const frameUrl = ref<string>('')
const showRound = ref<boolean>(false)
console.log(picList)

const DrawRef = ref()
const  uploadImgRef = ref()

const avatarInfo = ref<{ url: string, w: number, h: number, name: string }>({ url: '', w: 0, h: 0, name: '' })
const uploadFile = async (e: any) => {
    if (!e.target.files || !e.target.files.length) return ElMessage.warning('上传失败！')

    const file = e.target.files[0]
    if (!file.type.includes('image')) return ElMessage.warning('请上传正确的图片格式！')

    originAvatarUrl.value = getCreatedUrl(file) ?? '';

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

const changeFrame = (isNext) => {
    if (!originAvatarUrl.value) return ElMessage.warning('请先上传头像！')

    const frameList =  picList[styleIndex.value].frameList
    if (isNext) {
        (selectFrameIndex.value === frameList.length - 1) ? selectFrameIndex.value = 0 : (selectFrameIndex.value as number)++
    } else {
        (selectFrameIndex.value === 0) ? selectFrameIndex.value = frameList.length - 1 : (selectFrameIndex.value as number)--
    }
    selectFrame(selectFrameIndex.value as number)
}

const selectFrame = (index: number) => {
    if (!originAvatarUrl.value) return ElMessage.warning('请先上传头像！')

    opacity.value = 1
    selectFrameIndex.value = index
    frameUrl.value = picList[styleIndex.value].frameList[index]
    DrawRef.value.addFrame(frameUrl.value)

}

const selectMark = (index: number) => {
    if (!originAvatarUrl.value) return ElMessage.warning('请先上传头像！')

    const markUrl = picList[styleIndex.value].frameList[index]
    DrawRef.value.addMark(markUrl)
}

const opacity = ref<number>(1)
const opacityChange = (num: number) => DrawRef.value.setFrameOpacity(num)

const previewShow = ref<boolean>(false)
const previewUrl = ref<string>('')
const save = async (isSave) => {
    if (!avatarInfo.value.url || !layerList.value[0].url) return ElMessage.warning('请上传原头像并选择效果图！')

    previewShow.value = false
    const url = await DrawRef.value.save()
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

<style lang="less">
.bg {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: -1;
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
    height: 100vh;

    > img {
        position: absolute;
        opacity: 0.6;
        transform: scale(1.5);
    }

    .bg-l-1 {
        top: -18%;
        left: -8%;
        width: 420px;
        animation: bg-l-1 8s linear infinite;
    }

    @keyframes bg-l-1 {
        50% {
            transform: translate(20%, -10%);
            opacity: 1;
        }
    }

    .bg-l-2 {
        top: 5%;
        left: -15%;
        width: 345px;
        opacity: 0.2;
        animation: bg-l-2 10s linear infinite;
    }

    @keyframes bg-l-2 {
        50% {
            transform: translate(40%, 28%) rotate(40deg);
            opacity: 0.4;
        }
    }

    .bg-l-3 {
        bottom: -30%;
        left: -20%;
        width: 588px;
        animation: bg-l-3 10s linear infinite;
    }

    @keyframes bg-l-3 {
        50% {
            transform: translate(10%, -30%) rotate(60deg);
            opacity: 1;
        }
    }

    .bg-r-1 {
        top: -24%;
        right: -15%;
        width: 588px;
        animation: bg-r-1 8s linear infinite;
    }

    @keyframes bg-r-1 {
        50% {
            transform: translate(-10%, 20%) rotate(60deg);
            opacity: 1;
        }
    }

    .bg-r-2 {
        top: 10%;
        right: -20%;
        width: 588px;
        animation: bg-r-2 8s linear infinite;
    }

    @keyframes bg-r-2 {
        50% {
            transform: translate(-15%, -20%) rotate(60deg);
            opacity: 1;
        }
    }

    .bg-r-3 {
        right: -10%;
        bottom: -15%;
        width: 346px;
        animation: bg-r-3 8s linear infinite;
    }

    @keyframes bg-r-3 {
        50% {
            transform: translate(-20%, -30%) rotate(60deg);
            opacity: 1;
        }
    }
}

header {
    position: sticky;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    margin: 0 auto;
    width: 100%;
    background: #ffffff80;
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);
    border-bottom: 1px solid #f2f4f8;

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        margin: 0 auto;
        max-width: 1200px;
        height: 50px;

        > div {
            display: flex;
            align-items: center;
            font-size: 18px;
            letter-spacing: 1px;
            //font-weight: 600;

            > img {
                margin-right: 16px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
        }
    }
}

.fasten {
    height: 130px;
}

main {
    margin: 36px auto;
    max-width: 1000px;
    background: #ffffff4d;
    border: 1px solid #fff;
    border-radius: 20px;
    box-shadow: 1px 1px 4px 1px #eee;
    backdrop-filter: blur(6px);

    .avatar-warp {
        position: absolute;
        top: -130px;
        right: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 260px;
        margin-inline: auto;

        .avatar {
            position: relative;
            overflow: hidden;
            width: 260px;
            height: 260px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 2px 2px 12px 2px rgb(26 94 109 / 30%), 16px 16px 24px 4px rgb(151 219 233 / 40%);
            transition: all 0.24s;
            margin-inline: 48px;

            &.circle {
                border-radius: 50%;
            }
        }

        > img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            box-shadow: 1px 1px 6px 1px #1a5e6d2d;
            cursor: pointer;
            transition: all 0.24s;

            &:hover {
                box-shadow: 1px 1px 6px 1px #1a5e6d4d;
                transform: scale(1.1);
            }
        }
    }

    .avatar-panel {
        display: flex;
        justify-content: center;
        margin: 20px auto 0;
    }

    .avatar-style {
        display: flex;
        justify-content: center;
        margin: 10px auto;

        > div {
            position: relative;
            padding: 10px 0;
            margin: 0 16px;
            font-size: 20px;
            color: #333;
            transition: all 0.24s;
            letter-spacing: 1px;
            cursor: pointer;

            &:hover {
                color: #ff8f1f;
            }

            &.active {
                color: #ff8f1f;
                font-weight: 600;
            }

            &.active::after {
                position: absolute;
                right: 0;
                bottom: -2px;
                left: 0;
                display: block;
                margin: 0 auto;
                width: 90%;
                height: 3px;
                background: #ff8f1f;
                border-radius: 2px;
                content: "";
            }
        }
    }

    .avatar-option {
        display: flex;
        align-items: center;
        padding: 0 20px;
        margin-bottom: 10px;

        > p {
            margin-right: 20px;
            width: 80px;
            font-size: 14px;
            text-align: right;
            flex-shrink: 0;
            font-weight: 600;
        }

        .effect-list {
            flex: 1;
            display: flex;
            align-items: center;
            overflow-x: auto;
            padding: 8px 0;

            > div {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                margin-right: 12px;
                width: 68px;
                height: 68px;
                background: #ffffff80;
                border-radius: 6px;
                box-shadow: 1px 1px 2px #0000001f;
                transition: all 0.24s;
                flex-shrink: 0;
                cursor: pointer;

                &:hover,
                &.active {
                    transform: translateY(-6px);
                    box-shadow: 1px 1px 8px 1px #0000001f;

                    > img {
                        width: 80%;
                        height: 80%;
                    }
                }

                > img {
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                    border-radius: 6px;
                    transition: all 0.24s;
                }
            }

            /* 隐藏浏览器默认滚动条 */
            &::-webkit-scrollbar {
                height: 6px;
            }

            /* 自定义滑块样式 */
            &::-webkit-scrollbar-thumb {
                background-color: #ff8f1f20;
                border-radius: 6px;
            }

            &::-webkit-scrollbar-thumb:hover,
            &::-webkit-scrollbar-thumb:active {
                background-color: #ff8f1faa;
            }
        }

        .opacity {
            flex: 1;

            .el-slider__bar {
                background: #ff8f1f60;
            }

            .el-slider__button {
                border-color: #ff8f1f60;
            }
        }
    }

    .avatar-save {
        display: flex;
        justify-content: center;
        padding-bottom: 20px;
    }
}

.stats {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 16px auto;

    > p,
    > a {
        display: flex;
        align-items: center;
        padding: 0 8px;
        margin: 0 8px 0 0;
        height: 24px;
        font-size: 12px;
        background: #dfddc680;
        border-radius: 4px;

        > span {
            padding-left: 4px;
        }

        > img {
            margin-right: 4px;
            width: 14px;
            height: 14px;
        }
    }
}

footer,
.state {
    padding-bottom: 8px;
    font-size: 13px;
    text-align: center;
}

/* 兼容移动端 */
@media only screen and (max-width: 768px) {
    /* 移动端 */
}
</style>
