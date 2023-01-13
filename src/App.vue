<template>
    <div class="bg"></div>
    <header>定制兔年头像</header>
    <el-row :gutter="isPc ? 20 : 8">
        <el-col :xs="24" :sm="14" :md="10">
            <div class="custom" :style="{ width: isPc ? '400px' : '200px', height: isPc ? '400px' : '200px' }">
                <RabbitLi ref="rabbitLi" :bg-info="avatarInfo" :layer-list="layerList" @drawComplete="drawComplete" />
            </div>
            左侧区域
        </el-col>
        <el-col :xs="24" :sm="10" :md="12">
            <el-form class="form" :loading="loading" label-width="90px" label-position="right" :size="isPc ? 'default' : 'small'">
                <el-form-item label="上传原头像" prop="type">
                    <div class="avatar">
                        <img v-if="avatarInfo.url" :src="avatarInfo.url" alt="用户头像">
                        <span v-else>+</span>
                        <input id="uploadImg" type="file" accept=".jpg,.png" @change="uploadFile" />
                    </div>
                    <span class="avatar-tip">图片格式: png、jpg，大小请勿超过2m</span>
                </el-form-item>
                <el-form-item label="选择效果图" prop="type">
                    <div class="effect">
                        <div v-for="(item, index) in effectList" :key="index" class="effect-item" @click="selectEffect(index)">
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
    <img :src="previewUrl" alt="" style="width: 180px;height: 180px;">
    <el-button type="primary">测试element ui</el-button>


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


const avatarInfo = ref<{ url: string, w: number, h: number }>({ url: '', w: 0, h: 0 })
const uploadFile = async (e: any) => {
    if (!e.target.files || !e.target.files.length) return ElMessage.warning('上传失败')

    const url = getCreatedUrl(e.target.files[0]) ?? ''
    const imgInfo: any = await getImgInfo(url)
    avatarInfo.value = { url, w: imgInfo.width, h: imgInfo.height };

    (document.getElementById('uploadImg') as HTMLInputElement).value = ''
}

interface LayerType {
    uuid: string,
    type: string,
    url: string,
    x: number,
    y: number,
    scale: number,
    angle: number
    [propName: string]: any
}
const layerList = ref<LayerType[]>([])

const effectIndex = ref<number | null>(null)

const selectEffect = (index: number) => {
    if (!avatarInfo.value.url) return ElMessage.warning('请先上传原头像')

    loading.value = true
    layerList.value = [
        {
            uuid: 'effect',
            type: 'img',
            url: effectList[index].imgUrl,
            x: 0,
            y: 0,
            scale: 0,
            angle: 0
        }
    ]
}

const drawComplete = () => {
    console.log('已绘制完成')
    loading.value = false
}

const previewShow = ref<boolean>(false)
const previewUrl = ref<string>('')

const save = async (isSave) => {
    const url = await rabbitLi.value.save()

    if (isSave) return downloadImg(url)

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
    background: #efefef;
    border-radius: 4px;
    box-shadow: 0 0 12px rgb(0 0 0 / 12%);

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

        .effect-item {
            padding: 0 8px;
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
                border: 1px dashed #409eff;
                box-shadow: 0 0 4px 1px #79bbff80;

                > div {
                    color: #409eff;
                }
            }
        }
    }
}

/* 兼容移动端 */
//@media only screen and (max-width: 768px) {
//
//}
</style>
