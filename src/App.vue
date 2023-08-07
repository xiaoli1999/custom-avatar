<template>
    <div class="bg"></div>
    <header>定制兔年春节头像<span @click="versionShow = true"><i>v1.4.0</i></span></header>
    <el-dialog class="notice" v-model="versionShow" title="版本更新（v1.4.0）" :width="isPc ? '600px' : '340px'" align-center center style="border-radius: 8px;">
        <div class="desc">
            <div class="desc-title">v1.4.0</div>
            <p>解决保存图片模糊问题</p>
        </div>
        <div class="desc">
            <div class="desc-title">v1.3.3</div>
            <p>调整PC版版本迭代、效果图区域，优化页面展示。</p>
        </div>
        <div class="desc">
            <div class="desc-title">v1.3.2</div>
            <p>压缩静态资源，优化网站加载速度。</p>
        </div>
        <div class="desc">
            <div class="desc-title">v1.3.1</div>
            <p>优化新年寄语-教程描述及展示。</p>
        </div>
        <div class="desc">
            <div class="desc-title">v1.3.0</div>
            <p>一大批新年效果图来袭~（设计师温言）🔥🔥🔥</p>
        </div>
        <div class="desc">
            <div class="desc-title">v1.2.2</div>
            <p>新增版本迭代信息弹窗</p>
        </div>
        <div class="desc">
            <div class="desc-title">v1.2.1</div>
            <p>优化透明度功能滑块区域（太靠右侧易误触），优化页面交互。</p>
        </div>
        <div class="desc">
            <div class="desc-title">v1.2.0</div>
            <p>重构页面布局，新增设置效果图透明度功能，优化页面展示。</p>
        </div>
        <div class="desc">
            <div class="desc-title">v1.0.0</div>
            <p>初版</p>
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
                            <img :src="item.url" alt="">
                            <div>{{ item.name }}</div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="透明度" prop="type">
                    <div class="opacity">
                        <el-slider v-model="opacity" :min="0.1" :max="1" :step="0.01" size="small" :disabled="!layerList[0].url" @change="opacityChange" />
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
    <div class="state">部分素材来源于网络，非商业用途，如有侵权请联系删除。</div>
    <footer>© 2023 All rights reserved. Powered by 黎</footer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { judgePC, getCreatedUrl, getImgInfo, downloadImg } from '@/tools/common'
import { effectList } from './tools/effectList'
import progress from './tools/progress'
import RabbitLi from './components/RabbitLi/index.vue'
import { ElMessage } from 'element-plus'


/* 初始化进度条 */
progress.start()

const isPc = ref<boolean>(judgePC())
const loading = ref<boolean>(false)
const versionShow = ref<boolean>(false)


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
const effectIndex = ref<number | null>(null)
const selectEffect = (index: number) => {
    if (!avatarInfo.value.url) return ElMessage.warning('请先上传原头像！')
    effectIndex.value = index

    loading.value = true
    layerList.value[0].url = effectList[index].url
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
}

onMounted(() => {
    progress.close()
    versionShow.value = true
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

    > span {
        position: relative;
        margin-left: 8px;
        font-size: 20px;
        letter-spacing: 0;
        cursor: pointer;
    }
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
        display: flex;
        align-items: center;
        padding-bottom: 12px;
        font-size: 26px;
        font-family: "楷体", serif;
        letter-spacing: 1px;
        color: #000;
        font-weight: 600;

        > span {
            padding-left: 8px;
            font-size: 16px;
            color: #f56c6c;
        }
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
        justify-content: center;
        padding: 12px 0;
        color: #fff;
    }

    > p {
        padding-bottom: 12px;
        color: @defaultColor;
    }
}

.notice {
    .desc {
        margin: 0 auto 12px;

        .desc-title {
            font-size: 20px;
            letter-spacing: 0;
        }
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
                    width: 76px;
                    height: 76px;
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

        .opacity {
            padding: 0 32px 0 12px;
            width: 100%;
            box-sizing: border-box;
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

footer,
.state {
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

        > span {
            margin-left: 8px;
            font-size: 14px;
        }
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

            > span {
                padding-left: 4px;
                font-size: 12px;
                color: #f56c6c;
            }
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

    .notice {
        .desc {
            .desc-title {
                font-size: 16px;
                letter-spacing: 0;
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

    footer,
    .state {
        line-height: 20px;
        font-size: 12px;
    }
}
</style>
