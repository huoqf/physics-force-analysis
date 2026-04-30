<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ControlPanel from './components/ControlPanel.vue'
import { initEngine, updateParams, destroyEngine, switchModel } from './physics/engine.js'

const simulationContainer = ref(null)
const overlayCanvas = ref(null)

const params = ref({
  category: 'basic',
  subModel: 'incline', 
  
  massA: 10,
  massB: 10,
  targetObject: 'ALL', // 'A', 'B', 'ALL'
  
  angle: 30,
  mu: 0.2, 
  muAB: 0.2, 
  
  pushForce: 0, 
  
  conveyorV: 2, 
  conveyorA: 0, 
  v0_A: 0, 
  
  electricField: 0,
  magneticField: 0,
  charge: 1
})

onMounted(() => {
  initEngine(simulationContainer.value, overlayCanvas.value, params.value)
})

onUnmounted(() => {
  destroyEngine()
})

const handleParamsChange = (newParams, triggerReload = false) => {
  params.value = { ...newParams }
  if (triggerReload) {
    switchModel(params.value)
  } else {
    updateParams(params.value)
  }
}
</script>

<template>
  <div class="app-container">
    <div class="simulation-area" ref="simulationContainer">
      <canvas class="overlay-canvas" ref="overlayCanvas"></canvas>
    </div>
    <ControlPanel 
      :params="params" 
      @update:params="handleParamsChange"
    />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

.simulation-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
}

.overlay-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none; 
  z-index: 10;
}
</style>
