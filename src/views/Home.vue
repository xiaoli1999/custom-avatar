<template>
    <div>首页</div>
    <Test />
    <router-link to="/about">去关于我们</router-link>
    count数量 {{ count }} getters获取count {{ TestStore.getTestCount }}
    <button @click="add">点击增加数量</button> <button @click="adds">点击增加数量(action)</button> <button @click="reset">点击重置数量</button>
</template>

<script lang="ts" setup>
import {StateTree, storeToRefs} from 'pinia'
import { testStore } from '@/store/test'

const TestStore: StateTree = testStore()
console.log(TestStore)
const { count } = storeToRefs(TestStore)

const add = () =>  (TestStore.count++)
const adds = () =>  (TestStore.setCountAdd())
const reset = () =>  (TestStore.$reset())


</script>

<style scoped>
.home {
    width: 100%;
    height: auto;
}
</style>
