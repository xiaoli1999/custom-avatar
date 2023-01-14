<template>
    <div class="bg"></div>
    <header>定制兔年春节头像</header>
    <el-row :gutter="isPc ? 20 : 8">
        <el-col :xs="24" :sm="14" :md="10">
            <div :class="`custom ${ showType }`" :style="{ width: isPc ? '400px' : '320px', height: isPc ? '400px' : '320px' }">
                <RabbitLi ref="rabbitLi" :bg-info="avatarInfo" :layer-list="layerList" @drawComplete="drawComplete" />
            </div>
        </el-col>
        <el-col :xs="24" :sm="10" :md="12">
            <el-form class="form" :loading="loading" label-width="90px" label-position="right" :size="isPc ? 'default' : 'small'">
                <el-form-item label="画布形状" prop="type">
                    <el-radio-group v-model="showType">
                        <el-radio label="" border>方形</el-radio>
                        <el-radio label="circle" border>圆形</el-radio>
                    </el-radio-group>
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

</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {judgePC, getCreatedUrl, getImgInfo, downloadImg} from '@/tools/common'
import { effectList } from './tools/effectList'
import progress from './tools/progress'
import RabbitLi from './components/RabbitLi/index.vue'
import { ElMessage } from 'element-plus'


/* todo 初始化进度条 */
progress.start()

const isPc = ref<boolean>(judgePC())
const loading = ref<boolean>(false)

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

onMounted(() => progress.close())
</script>

<style lang="less" scoped>
.transition {
    transition: all 0.4s linear;
}

.bg {
    position: fixed;
    top: 0;
    left: 0;
    //background: url("./assets/img/bg.jpg") center no-repeat;
    //background-size: cover;
    //filter: blur(2px);
    z-index: -1;
    width: 100%;
    height: 100vh;
    //opacity: .6;
}

header {
    line-height: 60px;
    font-size: 24px;
    text-align: center;
}

.custom {
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    background: #efefefaa;
    border-radius: 8px;
    box-shadow: 0 0 8px 1px rgb(0 0 0 / 14%);
    .transition;

    &.circle {
        border-radius: 50%;
    }
}

.form {
    .avatar {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        width: 60px;
        height: 60px;
        font-size: 24px;
        color: #eee;
        border: 1px dashed #eee;
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
            color: #409eff;
            border-color: #409eff;
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
        color: #9e9e9e;
    }

    .effect {
        display: flex;
        align-items: center;
        overflow-x: hidden;
        overflow-y: auto;
        width: 100%;
        height: auto;
        max-height: 240px;
        flex-wrap: wrap;
        padding: 4px;

        .effect-item {
            padding: 4px 8px 0;
            margin: 0 8px 8px 0;
            border: 1px dashed #eee;
            border-radius: 4px;
            .transition;

            > img {
                width: 80px;
                height: 80px;
                cursor: pointer;
            }

            > div {
                padding: 4px;
                font-size: 14px;
                text-align: center;
                color: #79bbff;
                cursor: pointer;
                .transition;
            }

            &:hover,
            &.active {
                border: 1px solid #409eff;
                box-shadow: 0 0 4px 1px #409eff80;

                > div {
                    color: #409eff;
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

            :deep(.el-image)  {
                width: 64px;
                height: 64px;
                display: block;
                margin: 0 auto 8px;
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

/* 兼容移动端 */
//@media only screen and (max-width: 768px) {
//
//}
</style>
