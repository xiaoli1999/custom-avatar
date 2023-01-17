<template>
    <div class="bg"></div>
    <header>定制兔年春节头像</header>
    <div class="notice-btn" @click="noticeShow = true">新年寄语</div>
    <el-dialog class="notice" v-model="noticeShow" title="新年寄语" :width="isPc ? '580px' : '320px'" align-center center style="border-radius: 8px;">
        <div class="desc">
            <div class="desc-title">简述</div>
            <p>辞暮尔尔，烟火年年！你好，我是黎（小黎）。在这寒冬之际，满城尽烟花，小黎为大家带来<b>『定制兔年春节头像』</b>小工具，希望各位喜欢。
                愿诸位抱着平安，拥着健康，揣着幸福，搂着温馨，携着快乐，牵着财运，拽着吉祥，迈入新年！
            </p>
        </div>
        <div class="desc">
            <div class="desc-title">教程</div>
            <p>
                1. 选择头像形状（微信为方形、qq、抖音等平台为圆形）。<br />
                2. 上传头像，尽量为宽高比1:1的头像（不支持动图）。<br />
                3. 选择喜欢的效果图（目前效果图可适配大部分头像）。<br />
                4. 完成上述步骤后，对效果图大小或位置不满意；可在左侧白框区域拖动、缩放效果图。<br />
                5. 点击预览可展示方形、圆形的成品头像（支持预览大图）。<br />
                6. 点击保存图片。
            </p>
        </div>
        <div class="desc">
            <div class="desc-title">开源</div>
            <p>目前代码已开源，<i><a href="https://github.com/xiaoli1999/custom-rabbitImage" target="_blank">github链接~</a></i>
                如果你喜欢这个项目或使用过它，请点个star⭐，谢谢🙏🙏🙏！ <br />
                目前效果图属于个人购买，数量有限；希望有志同道合的设计师为爱发电，提供一些效果图。我会在效果图下展示设计师的名称及个人网站等链接，
                并在春节会收到小黎的春节红包🧧。<br />
                若有喜欢的效果图或想要提供一些效果图，小黎不胜感激🙏。这个项目有您的参与变的更有意义🤝！<br />
                联系方式~ <b>QQ: 22708206</b>，<i><a href="https://github.com/xiaoli1999/custom-rabbitImage/issues">github issues链接~</a></i>。
            </p>
        </div>
    </el-dialog>
    <el-row class="main" :gutter="isPc ? 20 : 0">
        <el-col :xs="24" :sm="14" :md="10">
            <div :class="`custom ${ showType }`" :style="{ width: isPc ? '400px' : '320px', height: isPc ? '400px' : '320px' }">
                <RabbitLi ref="rabbitLi" :bg-info="avatarInfo" :layer-list="layerList" @drawComplete="drawComplete" />
            </div>
        </el-col>
        <el-col :xs="24" :sm="10" :md="14">
            <el-form class="form" :loading="loading" label-width="90px" label-position="right" :size="isPc ? 'default' : 'small'">
                <el-form-item label="头像形状" prop="type">
                    <div :class="`type-btn ${ showType ? '' : 'active' }`" @click="showType = ''">方形</div>
                    <div :class="`type-btn ${ showType ? 'active' : '' }`" @click="showType = 'circle'">圆形</div>
                </el-form-item>
                <el-form-item label="上传原头像" prop="type">
                    <div class="avatar">
                        <img v-if="avatarInfo.url" :src="avatarInfo.url" alt="用户头像">
                        <span v-else>+</span>
                        <input id="uploadImg" type="file" accept=".png,.apng,.jpeg,.jpg,.gif,.webp,.avif" @change="uploadFile" />
                    </div>
                    <span class="avatar-tip">请上传宽高1:1的头像</span>
                </el-form-item>
                <el-form-item label="选择效果图" prop="type">
                    <div class="effect">
                        <div v-for="(item, index) in effectList" :key="index" :class="`effect-item ${ effectIndex === index ? 'active' : '' }`" @click="selectEffect(index)">
                            <img :src="item.imgUrl" alt="">
                            <div>{{ item.designerName }}</div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="" prop="type">
                    <el-button type="primary" plain @click="save(false)">预览</el-button>
                    <el-button type="success" plain @click="save(true)">保存</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <el-dialog class="preview" v-model="previewShow" title="预览" width="320px"  align-center center style="border-radius: 8px;">
        <div class="preview-list">
            <div class="preview-list-item">
                <el-image :src="previewUrl" fit="cover" :preview-src-list="[previewUrl]"  hide-on-click-modal/>
                <el-tag effect="plain">微信</el-tag>
            </div>
            <div class="preview-list-item">
                <el-image :src="previewUrl" fit="cover" :preview-src-list="[previewUrl]"  hide-on-click-modal/>
                <el-tag effect="plain">qq、抖音等</el-tag>
            </div>
        </div>
    </el-dialog>
    <div class="desc donate" style="text-align: center;">
        <div class="desc-title">捐赠</div>
        <p>
            若您愿聊表心意，小黎不胜感激🙏！（捐赠时请填写备注，会统计捐赠者并公布）
            <span>
                <img src="./assets/img/pay/wx.jpg" alt="微信">
                <img src="./assets/img/pay/zfb.jpg" alt="支付宝">
            </span>
        </p>
    </div>
    <div class="stats">
        <p>本站访问人数:<span id="busuanzi_value_site_uv"></span></p>
        <p>本站访问总量:<span id="busuanzi_value_site_pv"></span></p>
        <a class="github" href="https://github.com/xiaoli1999/custom-rabbitImage" target="_blank">
            <img src="./assets/img/github.png" alt="github">
            <span>github</span>
        </a>
    </div>
    <footer>© 2023 All rights reserved. Powered by 黎</footer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { judgePC, getCreatedUrl, getImgInfo, downloadImg } from '@/tools/common'
import { effectList } from './tools/effectList'
import progress from './tools/progress'
import RabbitLi from './components/RabbitLi/index.vue'
import { ElMessage } from 'element-plus'


/* todo 初始化进度条 */
progress.start()

const isPc = ref<boolean>(judgePC())
const loading = ref<boolean>(false)
const noticeShow = ref<boolean>(false)


const rabbitLi = ref()

const showType = ref<string>('')

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
    angle: number
    [propName: string]: any
}
const layerList = ref<LayerType[]>([])
const effectIndex = ref<number | null>(null)
const selectEffect = (index: number) => {
    if (!avatarInfo.value.url) return ElMessage.warning('请先上传原头像！')
    effectIndex.value = index

    loading.value = true
    layerList.value = [
        {
            uuid: 'effect',
            type: 'img',
            url: effectList[index].imgUrl,
            w: 0,
            h: 0,
            x: 0,
            y: 0,
            scale: 0,
            angle: 0
        }
    ]
}

const drawComplete = () => {
    loading.value = false
}

const previewShow = ref<boolean>(false)
const previewUrl = ref<string>('')
const save = async (isSave) => {
    if (!avatarInfo.value.url || !layerList.value.length) return ElMessage.warning('请上传原头像并选择效果图！')

    previewShow.value = false
    const url = await rabbitLi.value.save()
    if (isSave) return downloadImg(url, avatarInfo.value.name)

    previewShow.value= true
    previewUrl.value= url
}

onMounted(() => {
    progress.close()
    noticeShow.value = true
})
</script>

<style lang="less" scoped>
@defaultColor: #ebebeb;
@activeColor: #fff;

.title-size {
    font-family: "楷体", serif;
    letter-spacing: 1px;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px #fff;
}

.transition {
    transition: all 0.4s linear;
}

.bg {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100vh;
    background: url("./assets/img/bg.png") center no-repeat;
    background-size: cover;

    .transition;
}

header {
    line-height: 80px;
    font-size: 28px;
    text-align: center;

    .title-size;
}

.notice-btn {
    margin: 0 auto 32px;
    width: 90px;
    font-size: 14px;
    text-align: center;
    color: #363636;
    background: #ffffff80;
    border-radius: 4px;
    box-shadow: inset 0 0 8px 1px #f4f4f468;
    line-height: 32px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;

    .transition;

    &:hover {
        color: #000;
        box-shadow: inset 0 0 8px 1px #f4f4f4cc;
    }
}

.desc {
    padding: 0 12px;
    margin: 0 auto 20px;

    .desc-title {
        padding-bottom: 12px;
        font-size: 26px;
        font-family: "楷体", serif;
        letter-spacing: 1px;
        color: #000;
        font-weight: 600;
    }

    > p {
        line-height: 1.25;
        font-size: 14px;
        color: #323232;

        .transition;

        a:hover {
            font-weight: bold;
            color: #000;
        }

        > span {
            display: flex;
            justify-content: space-between;
            margin: 12px auto;
            width: 240px;

            > img {
                overflow: hidden;
                width: 100px;
                border-radius: 4px;
                object-fit: contain;
            }
        }
    }
}

.donate {
    .desc-title {
        padding: 12px 0;
        color: #fff;
    }

    > p {
        padding-bottom: 12px;
        color: @defaultColor;
    }
}

.main {
    margin-bottom: 20px;

    .custom {
        position: relative;
        overflow: hidden;
        margin: 0 auto;
        border-radius: 8px;
        box-shadow: inset 0 0 16px 1px #fffc;

        .transition;

        &.circle {
            border-radius: 50%;
        }
    }

    .form {
        padding: 12px 0;

        :deep(.el-form-item__label) {
            color: #d5d5d5;
        }

        .type-btn {
            padding: 6px 12px;
            margin-right: 20px;
            font-size: 16px;
            color: @defaultColor;
            border: 1px solid @defaultColor;
            border-radius: 4px;
            cursor: pointer;

            .transition;

            &:hover,
            &.active {
                color: @activeColor;
                border-color: @activeColor;
                box-shadow: inset 0 0 6px 1px #fffc;
            }
        }

        .avatar {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            width: 60px;
            height: 60px;
            font-size: 24px;
            color: @defaultColor;
            border: 1px dashed @defaultColor;
            border-radius: 50%;
            cursor: pointer;
            .transition;

            > img {
                display: block;
                width: 100%;
                height: 100%;
                cursor: pointer;
            }

            &:hover {
                color: @activeColor;
                border-color: @activeColor;
            }

            > input {
                position: absolute;
                width: 100%;
                height: 100%;
                cursor: pointer;
                opacity: 0;
            }
        }

        .avatar-tip {
            padding: 4px 0 4px 16px;
            font-size: 14px;
            color: @defaultColor;
        }

        .effect {
            display: flex;
            align-items: center;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 4px;
            width: 100%;
            height: auto;
            max-height: 240px;
            flex-wrap: wrap;

            .effect-item {
                padding: 8px 8px 0;
                margin: 0 8px 8px 0;
                border: 1px dashed @defaultColor;
                border-radius: 4px;

                .transition;

                > img {
                    overflow: hidden;
                    width: 80px;
                    height: 80px;
                    background: #f4f4f480;
                    border-radius: 2px;
                    cursor: pointer;
                }

                > div {
                    padding: 4px;
                    font-size: 14px;
                    text-align: center;
                    color: @defaultColor;
                    cursor: pointer;
                    .transition;
                }

                &:hover,
                &.active {
                    border: 1px solid @activeColor;
                    //box-shadow: 0 0 4px 1px #409eff80;
                    box-shadow: inset 0 0 6px 1px #fffc;

                    > div {
                        color: @activeColor;
                    }
                }
            }
        }
    }
}

.preview {
    .preview-list {
        display: flex;
        justify-content: space-around;
        align-items: center;

        .preview-list-item {
            text-align: center;

            :deep(.el-image) {
                display: block;
                margin: 0 auto 8px;
                width: 64px;
                height: 64px;
                border-radius: 4px;
            }
        }

        .preview-list-item:last-child {
            :deep(.el-image) {
                border-radius: 50%;
            }
        }
    }
}

.stats {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px auto;

    > p,
    > a {
        padding: 4px 8px;
        margin: 0 4px;
        font-size: 14px;
        color: #363439;
        background: #ffffff9a;
        border-radius: 2px;
        box-shadow: inset 0 0 8px 1px #f4f4f480;
        font-weight: 600;

        > span {
            padding-left: 4px;
        }

        > img {
            margin-right: 2px;
            width: 18px;
            height: 18px;
        }
    }

    > a {
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
            box-shadow: inset 0 0 8px 1px #fff, 1px 1px 6px 0.5px #00000060;
        }
    }
}

footer {
    line-height: 24px;
    font-size: 14px;
    text-align: center;
}

/* 兼容移动端 */
@media only screen and (max-width: 768px) {
    .bg {
        background: url("./assets/img/bg-mobile.png") center no-repeat;
        background-size: cover;
    }

    header {
        line-height: 36px;
        font-size: 18px;
    }

    .notice-btn {
        margin: 2px auto 12px;
        width: 68px;
        font-size: 12px;
        line-height: 24px;

        .transition;
    }

    .desc {
        padding: 0 8px;
        margin: 0 auto 8px;

        //color: #f4f4f4;

        .desc-title {
            padding-bottom: 8px;
            font-size: 18px;
        }

        > p {
            font-size: 12px;

            a:hover {
                font-weight: bold;
                color: #409eff;
            }

            > span {
                margin: 8px auto;
                width: 200px;

                > img {
                    width: 90px;
                }
            }
        }
    }

    .donate {
        .desc-title {
            padding: 8px 0;
            color: #fff;
        }

        > p {
            padding-bottom: 12px;
            color: @defaultColor;
        }
    }

    .main {
        margin-bottom: 8px;

        .form {
            padding: 8px 0;

            .effect {
                .effect-item {
                    padding: 4px 6px 0;
                    margin: 0 6px 6px 0;

                    > img {
                        width: 64px;
                        height: 64px;
                    }

                    > div {
                        padding: 4px;
                        font-size: 12px;
                    }
                }
            }
        }
    }

    .stats {
        margin: 8px auto;

        > p,
        > a {
            padding: 4px 8px;
            margin: 0 4px 0 0;
            font-size: 12px;
            border-radius: 2px;
            box-shadow: inset 0 0 8px 1px #f4f4f480;

            > img {
                width: 14px;
                height: 14px;
            }
        }
    }

    footer {
        line-height: 20px;
        font-size: 12px;
    }
}
</style>
