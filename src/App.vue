<script setup>
import LearningView from './views/LearningView.vue';
</script>

<template>
  <div class="app-root">
    <LearningView />
  </div>
</template>

<style>
/* 全局重置样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

#app {
  height: 100%;
  width: 100%;
}

.app-root {
  width: 100%;
  min-height: 100vh;
}
</style>
