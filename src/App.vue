<template>
    <div>定制兔年头像</div>
    <el-button type="primary">测试element ui</el-button>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import progress from './tools/config/progress'
import './styles/normalize.less'

progress.start()

onMounted(() => progress.close())
</script>

<!--<style lang="less" scoped>-->

<!--</style>-->
