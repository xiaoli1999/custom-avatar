<template>
    <div class="bg">
        <img class="bg-l-1" src="./assets/img/bg-l-1.png" alt="">
        <img class="bg-l-2" src="./assets/img/bg-l-2.png" alt="">
        <img class="bg-l-3" src="./assets/img/bg-l-3.png" alt="">
        <img class="bg-r-1" src="./assets/img/bg-r-1.png" alt="">
        <img class="bg-r-2" src="./assets/img/bg-r-2.png" alt="">
        <img class="bg-r-3" src="./assets/img/bg-r-3.png" alt="">
    </div>

    <header class="header">
        <div class="header-content">
            <div class="logo">
                <img src="https://cdn.xiaoli.vip/project/logo.jpg" alt="">
                定制头像
            </div>
            <!--滚动播放-->
            <transition name="notice" mode="out-in">
                <div v-if="avatarList && avatarList.length" class="notice" :key="avatarList[noticeIndex].last_modified">
                    <p>
                        <span style="color: #409eff;">游客{{ (avatarList[noticeIndex].last_modified + '').slice(-5) }} </span>
                        <span style="padding-left: 2px;">{{ calcOverTime(avatarList[noticeIndex].last_modified) }}前</span>
                        <span style="padding-right: 2px;">制作了</span>
                        <span style="color: #f56c6c;">{{ styleEnums[avatarList[noticeIndex].id] }}头像 </span>
                        <span style="padding-left: 4px;"></span>
                    </p>
                    <img :src="avatarList[noticeIndex].url" alt="">
                </div>
            </transition>
        </div>
    </header>
    <div class="fasten"></div>
    <main>
        <div class="fasten"></div>
        <div class="avatar-warp">
            <img class="left" src="./assets/img/more-left.png" alt="" @click="changeFrame(false)">
            <div class="avatar" :class="showRound ? 'circle' : ''">
                <Draw ref="DrawRef" :bg="originAvatarUrl" />
                <div v-if="!originAvatarUrl" class="upload-avatar" @click="uploadImgRef.click()">
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M810.369481 489.052359c-0.014326 0-0.029676 0-0.042979 0l-281.56577 0.635473 0.590448-282.148032c0.021489-10.376325-8.372691-18.804275-18.747993-18.826787-0.014326 0-0.025583 0-0.039909 0-10.356882 0-18.764366 8.385994-18.785855 18.747993l-0.591471 282.311761-281.725406 0.636496c-10.376325 0.023536-18.767436 8.453533-18.744923 18.829857 0.023536 10.361999 8.429996 18.744923 18.785855 18.744923 0.014326 0 0.029676 0 0.042979 0l281.561677-0.635473-0.590448 282.152125c-0.021489 10.375302 8.372691 18.804275 18.747993 18.825764 0.014326 0 0.025583 0 0.039909 0 10.355859 0 18.764366-8.385994 18.785855-18.747993l0.590448-282.314831 281.728476-0.636496c10.376325-0.023536 18.768459-8.453533 18.744923-18.829857C829.131801 497.435283 820.726364 489.052359 810.369481 489.052359z"></path>
                    </svg>
                    <p>上传头像</p>
                </div>
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
                    <img :src="item + '!avatar'" alt="">
                </div>
            </div>
        </div>
        <div class="avatar-option">
            <p>贴纸</p>
            <div class="effect-list">
                <div v-for="(item, index) in picList[styleIndex].markList" :key="index" @click="selectMark(index)">
                    <img :src="item" alt="">
                </div>
                <p v-if="!picList[styleIndex].markList.length">敬请期待哦~</p>
            </div>
        </div>
        <div class="avatar-option">
            <p>透明度</p>
            <div class="opacity">
                <el-slider v-model="opacity" :min="0.1" :max="1" :step="0.01" size="small" @change="opacityChange" />
            </div>
        </div>

        <div class="avatar-save">
            <el-button type="success" plain @click="createAvatar(true)">保存头像</el-button>
            <el-button type="primary" plain @click="createAvatar(false)">分享给朋友</el-button>
        </div>
    </main>

    <div class="wall">
        <h2>头像墙({{ avatarList.length }})</h2>
        <div class="wall-list">
            <el-image v-for="(url, index) in avatarPageUrlList" :key="url" :src="url" :preview-src-list="avatarPageUrlList" :initial-index="index" :style="{ gridColumn: `span ${ avatarList[index].span}`, gridRow: `span ${ avatarList[index].span }` }" />
        </div>
        <div v-if="pageNo * pageSize < avatarList.length" class="wall-more">
            <el-button type="info" link @click="loadMore">查看更多</el-button>
        </div>
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

    <input ref="uploadImgRef" id="uploadImg" type="file" accept="image/*" @change="uploadFile" style="position: absolute;top: -9999px;left: -9999px;" />

    <!-- 生成海报 -->
    <div id="poster" class="poster">
        <img class="poster-img" src="./assets/img/poster.png" alt="">
        <img class="poster-avatar" :src="avatarUrl" alt="">
        <div class="poster-desc">
            <div>
                <p>{{ picList[styleIndex].desc }}</p>
                <p>识别二维码，定制{{ picList[styleIndex].name }}头像！</p>
            </div>
            <img src="./assets/img/code.png" alt="">
        </div>
    </div>

    <el-dialog class="dialog" v-model="saveShow" title="保存头像" width="340px" align-center center style="border-radius: 8px;">
        <div class="dialog-content">
            <img :src="avatarUrl" alt="">
            <div>
                <el-button type="success" @click="save(true)">保存(移动端长按图片保存)</el-button>
            </div>
        </div>
    </el-dialog>

    <el-dialog class="dialog" v-model="shareShow" title="分享海报" width="340px" align-center center style="border-radius: 8px;">
        <div class="dialog-content">
            <img :src="shareUrl" alt="">
            <div>
                <el-button type="primary" @click="save(false)">分享(移动端长按图片转发给朋友)</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import {
    getCreatedUrl,
    downloadImg,
    base64ToFile,
    getAuthorization,
    getUploadAuthorization,
    calcOverTime
} from '@/tools/common'
import progress from './tools/progress'
import Draw from './components/Draw/index.vue'
import {picList, styleEnums} from '@/tools/picList'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import html2canvas from 'html2canvas'

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

const styleIndex = ref(1)
const originAvatarUrl = ref<string>('')
const selectFrameIndex = ref<number | null>(null)
const frameUrl = ref<string>('')
const showRound = ref<boolean>(false)
const avatarTotal = ref(0)
const DrawRef = ref()
const uploadImgRef = ref()
const loading = ref(false)

const uploadFile = async (e: any) => {
    if (!e.target.files || !e.target.files.length) return ElMessage.warning('上传失败！')

    const file = e.target.files[0]
    if (!file.type.includes('image')) return ElMessage.warning('请上传正确的图片格式！')

    const url = getCreatedUrl(file) ?? ''
    /* 用户初次上传头像默认选中第一个头像框 */
    if (!originAvatarUrl.value) {
        originAvatarUrl.value = url
        selectFrame(0)
    } else {
        originAvatarUrl.value = url
    }

    (document.getElementById('uploadImg') as HTMLInputElement).value = ''
}

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

let frameTimer: any = null
const selectFrame = (index: number) => {
    if (frameTimer) clearTimeout(frameTimer)

    frameTimer = setTimeout(() => {
        console.log(1111)
        if (!originAvatarUrl.value) return ElMessage.warning('请先上传头像！')

        opacity.value = 1
        selectFrameIndex.value = index
        frameUrl.value = picList[styleIndex.value].frameList[index]
        DrawRef.value.addFrame(frameUrl.value)
    }, 200)
}

let markTimer: any = null
const selectMark = (index: number) => {
    if (markTimer) clearTimeout(markTimer)

    markTimer = setTimeout(() => {
        console.log(2222)
        if (!originAvatarUrl.value) return ElMessage.warning('请先上传头像！')

        const markUrl = picList[styleIndex.value].markList[index]
        DrawRef.value.addMark(markUrl)
    }, 400)

}

const opacity = ref<number>(1)
const opacityChange = (num: number) => DrawRef.value.setFrameOpacity(num)

const avatarList = ref<any[]>([])
const avatarPageUrlList = ref<string[]>([])
const getAvatarList = async (isSet = true) => {
    const url = `${ userInfo.url }/${ atob(userInfo.bucket) }/${ userInfo.path }`
    const { date, authorization } = getAuthorization(userInfo)
    const headers = { authorization, 'x-date': date, Accept: 'application/json' }
    const { data } = await axios({ method: 'GET', url, headers }).catch(() => ({})) as any

    const files = ((data || {}).files) || []

    /* 动态计算当前头像总数 */
    if (files && files.length) {
        const name = files[0].name.split('.png')[0]
        const arr = name.split('-')
        avatarTotal.value = Number(arr[arr.length - 1] || 0)
    }

    if (isSet) setAvatarList(files)
}

const setAvatarList = (files: any[]) => {
    avatarList.value = files.map(i => ({
        ...i,
        id: i.name.split('-')[2],
        url: `https://cdn.xiaoli.vip/img/custom-avatar/${ i.name }!avatar`,
        span: createGridSpan()
    }))

    loadMore()
}

const createGridSpan = () => {
    const arr = [1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1]
    return arr[Math.floor(Math.random() * arr.length)]
}

let noticeTimer: any = null
const noticeIndex = ref(0)
const startNotice = () => {
    clearInterval(noticeTimer)
    noticeTimer = setInterval(() => {
        if (noticeIndex.value === avatarTotal.value - 1) {
            noticeIndex.value = 0
        } else {
            noticeIndex.value ++
        }
    }, 3000)
}

const pageNo = ref(0)
const pageSize = ref(16)
const loadMore = () => {
    const arr = avatarList.value.slice(pageNo.value * pageSize.value, ((pageNo.value + 1) * pageSize.value)).map(i => i.url)
    avatarPageUrlList.value = [...avatarPageUrlList.value, ...arr]
    pageNo.value++
}

onMounted(async () => {
    progress.close()
    await getAvatarList()
    startNotice()
})

onBeforeUnmount(() => clearInterval(noticeTimer))

const avatarUrl = ref('')
const shareUrl = ref('')
const saveShow = ref(false)
const shareShow = ref<boolean>(false)
const fileNameObj = {}

const createAvatar = async (isSave) => {
    if (!originAvatarUrl.value) return ElMessage({ duration: 3600, message: '请上传头像!', type: 'warning' })

    loading.value = true
    isSave ? saveShow.value = true : shareShow.value = true
    avatarUrl.value = await DrawRef.value.save()

    if  (isSave) {
        saveShow.value = true
        loading.value = false
    } else {
        await nextTick(() => {
            /* 生成海报 */
            const posterDom = document.getElementById('poster') as HTMLElement
            html2canvas(posterDom, { useCORS: true }).then((canvas) => {
                shareUrl.value = canvas.toDataURL('image/png')
                shareShow.value = true
                loading.value = false
            })
        })
    }



    if (!fileNameObj[styleIndex.value]) {
        await getAvatarList(false)
        fileNameObj[styleIndex.value] = `li-${ 1e14 - Date.now() }-${ picList[styleIndex.value].id }-${ avatarTotal.value + 1 }.png`
    }

    const fileName = fileNameObj[styleIndex.value]

    /* 上传头像 */
    const uploadData = new FormData()

    const file = base64ToFile(avatarUrl.value, fileName, 'png')
    uploadData.append('file', file)

    const { policy, authorization } = getUploadAuthorization(userInfo) as any
    uploadData.append('policy', policy)
    uploadData.append('authorization', authorization)

    axios({ method: 'POST', url: `${ userInfo.url }/${ atob(userInfo.bucket) }`, data: uploadData }).catch(() => ({}))
}

const save = async (isSave = true) => {
    try {
        /* 手动保存 */
        const name = `黎-${ picList[styleIndex.value].name }${isSave ? '' : '分享'}-${Date.now()}`
        downloadImg(isSave ? avatarUrl.value : shareUrl.value, name)
        ElMessage.success(isSave ? '保存成功' : '保存成功，快去分享给亲友吧~')
    } catch (e) {
        /* 捕获错误 */
    }
}
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

.header {
    position: sticky;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    overflow: hidden;
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

        .logo {
            display: flex;
            align-items: center;
            font-size: 16px;
            letter-spacing: 0.5px;
            font-weight: 600;

            > img {
                margin-right: 12px;
                width: 36px;
                height: 36px;
                border-radius: 50%;
            }
        }

        .notice {
            display: flex;
            align-items: center;
            overflow: hidden;
            font-size: 12px;
            color: #333;

            > img {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                flex-shrink: 0;
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

            .upload-avatar {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 9999;
                margin: auto;
                width: fit-content;
                height: fit-content;
                text-align: center;
                color: #c0c4cc;
                transition: all 0.24s;
                cursor: pointer;

                > svg {
                    width: 42px;
                    height: 42px;

                    > path {
                        fill: #c0c4cc;
                    }
                }

                > p {
                    padding-top: 4px;
                    font-size: 18px;
                    letter-spacing: 1px;
                }

                &:hover {
                    color: #409effcc;

                    > svg {
                        > path {
                            fill: #409effcc;
                        }
                    }
                }
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
                    box-shadow: 2px 2px 8px 1px #0000001f;
                }

                > img {
                    width: 100%;
                    object-fit: cover;
                }
            }

            p {
                line-height: 68px;
                font-size: 14px;
                color: #606262;
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
            padding-bottom: 8px;

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

.wall {
    margin: 36px auto;
    max-width: 1000px;

    > h2 {
        padding-bottom: 36px;
        font-size: 22px;
        text-align: center;
    }

    .wall-list {
        display: grid;
        gap: 8px;
        //grid-template-rows: repeat(8, 12.5%);
        grid-template-columns: repeat(8, minmax(0, 1fr));
        grid-auto-flow: dense;

        > div {
            border-radius: 8px;
        }
    }

    .wall-more {
        padding-top: 16px;
        text-align: center;
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
        background: #ebf0f8;
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

.poster {
    position: absolute;
    top: -500%;
    left: -500%;
    width: 500px;
    height: 750px;

    .poster-img {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 500px;
        height: 750px;
    }

    .poster-avatar {
        position: absolute;
        top: 200px;
        right: 0;
        left: 0;
        z-index: 10;
        width: 230px;
        height: 230px;
        border-radius: 10px;
        margin-inline: auto;
    }

    .poster-desc {
        position: absolute;
        bottom: 40px;
        left: 0;
        z-index: 10;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 120px;
        font-size: 20px;
        color: #363636;
        font-weight: 600;
        letter-spacing: 1px;

        > div {
            margin-left: 40px;

            > p {
                line-height: 40px;
            }

            > p:first-child {
                color: #e45f4d;
            }
        }

        > img {
            margin-right: 40px;
            width: 100px;
            height: 100px;
            border-radius: 8px;
        }
    }
}

.dialog-content {
    > img {
        margin: 12px auto 20px;
        width: 300px;
        border-radius: 8px;
        box-shadow: 2px 2px 8px 1px #0000004f;
    }

    > div {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 16px;
        font-size: 14px;
        color: crimson;

        > span {
            padding-left: 8px;
        }
    }
}

/* 兼容移动端 */
@media only screen and (max-width: 768px) {
    .bg {
        > img {
            opacity: 0.5;
            transform: scale(0.6);
        }

        .bg-l-1 {
            top: -14%;
            left: -20%;
        }

        .bg-l-2 {
            top: -4%;
            left: -40%;
        }

        .bg-l-3 {
            bottom: -10%;
            left: -60%;
        }

        .bg-r-1 {
            top: -24%;
            right: -70%;
        }

        .bg-r-2 {
            top: 5%;
            right: -80%;
        }

        .bg-r-3 {
            right: -30%;
            bottom: 10%;
        }
    }

    .header {
        .header-content {
            padding: 0 12px;
            margin: 0 auto;
            height: 46px;

            .logo {
                font-size: 14px;
                letter-spacing: 0;

                > img {
                    margin-right: 8px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                }
            }

            .notice {
                > img {
                    width: 20px;
                    height: 20px;
                }
            }
        }
    }

    .fasten {
        height: 120px;
    }

    main {
        margin: 24px auto 0;
        background: transparent;
        border: none;
        border-radius: 12px;
        box-shadow: none;
        backdrop-filter: blur(0);

        .avatar-warp {
            top: -120px;
            height: 240px;

            .avatar {
                width: 240px;
                height: 240px;
                margin-inline: 12px;
                border-radius: 16px;
                box-shadow: 2px 2px 12px 2px rgb(26 94 109 / 30%), 12px 12px 18px 2px rgb(151 219 233 / 40%);
            }

            > img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
        }

        .avatar-style {
            margin: 14px auto;

            > div {
                padding: 6px 0;
                margin: 0 8px;
                font-size: 16px;
                letter-spacing: 0.5px;
            }
        }

        .avatar-option {
            display: flex;
            align-items: center;
            padding: 0 16px;

            > p {
                margin-right: 12px;
                width: 46px;
                font-size: 14px;
                font-weight: 400;
            }

            .effect-list {
                padding: 8px 0;

                > div {
                    margin-right: 8px;
                    width: 48px;
                    height: 48px;
                }

                p {
                    line-height: 48px;
                }

                /* 隐藏浏览器默认滚动条 */
                &::-webkit-scrollbar {
                    height: 4px;
                }

                /* 自定义滑块样式 */
                &::-webkit-scrollbar-thumb {
                    background-color: #ff8f1f80;
                    border-radius: 4px;
                }
            }

            .opacity {
                padding-right: 12px;
            }
        }

        .avatar-save {
            padding-bottom: 0;
        }
    }

    .wall {
        margin: 0 auto 12px;
        max-width: 1000px;

        > h2 {
            padding: 20px 0;
            font-size: 18px;
            text-align: center;
        }

        .wall-list {
            gap: 4px;
            padding: 0 12px;

            > div {
                border-radius: 4px;
            }
        }

        .wall-more {
            padding-top: 16px;
            text-align: center;
        }
    }

    .stats {
        margin: 10px auto;

        > p,
        > a {
            padding: 0 6px;
            margin: 0 6px 0 0;
            height: 22px;
            font-size: 12px;

            > span {
                padding-left: 4px;
            }

            > img {
                margin-right: 1px;
            }
        }
    }

    footer,
    .state {
        padding-bottom: 6px;
        font-size: 12px;
        text-align: center;
    }
}

/* pc端不使用瀑布流 */
@media only screen and (min-width: 769px) {
    .wall {
        .wall-list {
            > div {
                grid-row: span 1 !important;
                grid-column: span 1 !important;
            }
        }
    }
}
</style>
