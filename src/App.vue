<template>
    <router-view />
</template>

<script lang="ts" setup>
const a = 's'

console.log(a)
</script>

<style scoped>
.logo {
    padding: 1.5em;
    height: 6em;
    will-change: filter;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
