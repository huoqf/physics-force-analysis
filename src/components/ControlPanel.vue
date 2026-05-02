<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  params: Object
})

const emit = defineEmits(['update:params'])

const setCategory = (cat, defaultSub) => {
  emit('update:params', { ...props.params, category: cat, subModel: defaultSub }, true)
}

const setSubModel = (sub) => {
  emit('update:params', { ...props.params, subModel: sub }, true)
}

const updateParam = (key, value, triggerReload = false) => {
  emit('update:params', { ...props.params, [key]: Number(value) }, triggerReload)
}

const updateStringParam = (key, value, triggerReload = false) => {
  emit('update:params', { ...props.params, [key]: value }, triggerReload)
}
</script>

<template>
  <div class="control-panel">
    <h2 class="title">物理受力分析</h2>
    
    <div class="section">
      <h3>1. 模型大类</h3>
      <div class="model-buttons row">
        <button :class="{ active: params.category === 'basic' }" @click="setCategory('basic', 'incline')">基础斜面</button>
        <button :class="{ active: params.category === 'connected' }" @click="setCategory('connected', 'rope')">多体连接</button>
        <button :class="{ active: params.category === 'conveyor' }" @click="setCategory('conveyor', 'horizontal')">传送带</button>
        <button :class="{ active: params.category === 'em' }" @click="setCategory('em', 'particle')">电磁场</button>
      </div>
    </div>
  <!-- 在基础斜面模型分类后添加 -->
<div class="section" v-if="params.category === 'basic'">
  <h3>研究对象</h3>
  <div class="model-buttons row">
    <button :class="{ active: params.targetObject === 'block' }" 
            @click="updateStringParam('targetObject', 'block')">滑块</button>
    <button :class="{ active: params.targetObject === 'incline' }" 
            @click="updateStringParam('targetObject', 'incline')">斜面</button>
  </div>
</div>

    <!-- 连接体子分类 -->
    <div class="section" v-if="params.category === 'connected'">
      <h3>2. 连接方式</h3>
      <div class="model-buttons row">
        <button :class="{ active: params.subModel === 'rope' }" @click="setSubModel('rope')">跨滑轮绳</button>
        <button :class="{ active: params.subModel === 'rod' }" @click="setSubModel('rod')">固定推拉杆</button>
        <button :class="{ active: params.subModel === 'stacked' }" @click="setSubModel('stacked')">板块/叠放体</button>
        <button :class="{ active: params.subModel === 'sideBySide' }" @click="setSubModel('sideBySide')">并排接触体</button>
      </div>
    </div>

    <!-- 传送带子分类 -->
    <div class="section" v-if="params.category === 'conveyor'">
      <h3>2. 传送带类型</h3>
      <div class="model-buttons row">
        <button :class="{ active: params.subModel === 'horizontal' }" @click="setSubModel('horizontal')">水平传送带</button>
        <button :class="{ active: params.subModel === 'inclined' }" @click="setSubModel('inclined')">倾斜传送带</button>
      </div>
    </div>

    <!-- 研究对象选择 -->
    <div class="section" v-if="params.category === 'connected'">
      <h3>研究对象 (隔离/整体法)</h3>
      <div class="model-buttons row">
        <button :class="{ active: params.targetObject === 'A' }" @click="updateStringParam('targetObject', 'A')">物块 A</button>
        <button :class="{ active: params.targetObject === 'B' }" @click="updateStringParam('targetObject', 'B')">物块 B</button>
        <button :class="{ active: params.targetObject === 'ALL' }" @click="updateStringParam('targetObject', 'ALL')">A+B 整体</button>
      </div>
    </div>

    <div class="section parameters">
      <h3>参数调节</h3>
      
      <!-- 通用参数 -->
      <div class="param-group">
        <label>质量 A (kg): {{ params.massA }}</label>
        <input type="range" min="1" max="50" step="1" :value="params.massA" @input="updateParam('massA', $event.target.value, true)" />
      </div>
      <div class="param-group" v-if="params.category === 'connected'">
        <label>质量 B (kg): {{ params.massB }}</label>
        <input type="range" min="1" max="50" step="1" :value="params.massB" @input="updateParam('massB', $event.target.value, true)" />
      </div>

      <!-- 倾角参数 -->
      <div class="param-group" v-if="params.subModel === 'incline' || params.subModel === 'inclined' || params.subModel === 'rope'">
        <label>倾角 &theta; (&deg;): {{ params.angle }}</label>
        <input type="range" min="0" max="80" step="1" :value="params.angle" @input="updateParam('angle', $event.target.value, true)" />
      </div>

      <!-- 摩擦因数参数 -->
      <div class="param-group" v-if="['incline', 'horizontal', 'inclined', 'stacked', 'sideBySide', 'rod'].includes(params.subModel)">
        <label>地/带面摩擦因数 &mu;: {{ params.mu }}</label>
        <input type="range" min="0" max="1" step="0.01" :value="params.mu" @input="updateParam('mu', $event.target.value)" />
      </div>
      <div class="param-group" v-if="params.subModel === 'stacked'">
        <label>A/B面摩擦因数 &mu;AB: {{ params.muAB }}</label>
        <input type="range" min="0" max="1" step="0.01" :value="params.muAB" @input="updateParam('muAB', $event.target.value)" />
      </div>
      
      <!-- 推力 -->
      <div class="param-group" v-if="['sideBySide', 'rod'].includes(params.subModel)">
        <label>左侧推力 F: {{ params.pushForce }}</label>
        <input type="range" min="0" max="100" step="1" :value="params.pushForce" @input="updateParam('pushForce', $event.target.value)" />
      </div>

      <!-- 传送带参数 -->
      <template v-if="params.category === 'conveyor'">
        <div class="param-group">
          <label>物块初速度 v0 (右+): {{ params.v0_A }}</label>
          <input type="range" min="-10" max="10" step="1" :value="params.v0_A" @input="updateParam('v0_A', $event.target.value, true)" />
        </div>
        <div class="param-group">
          <label>传送带速度 v (右+): {{ params.conveyorV }}</label>
          <input type="range" min="-10" max="10" step="1" :value="params.conveyorV" @input="updateParam('conveyorV', $event.target.value)" />
        </div>
        <div class="param-group">
          <label>传送带加速度 a: {{ params.conveyorA }}</label>
          <input type="range" min="-5" max="5" step="0.1" :value="params.conveyorA" @input="updateParam('conveyorA', $event.target.value)" />
        </div>
      </template>

      <!-- 电磁场参数 -->
      <template v-if="params.category === 'em'">
        <div class="param-group">
          <label>电荷量 q: {{ params.charge }}</label>
          <input type="range" min="-5" max="5" step="1" :value="params.charge" @input="updateParam('charge', $event.target.value)" />
        </div>
        <div class="param-group">
          <label>电场强度 E: {{ params.electricField }}</label>
          <input type="range" min="-10" max="10" step="1" :value="params.electricField" @input="updateParam('electricField', $event.target.value)" />
        </div>
        <div class="param-group">
          <label>磁感应强度 B: {{ params.magneticField }}</label>
          <input type="range" min="-10" max="10" step="1" :value="params.magneticField" @input="updateParam('magneticField', $event.target.value)" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.control-panel {
  width: 360px;
  background-color: var(--panel-bg);
  border-left: 1px solid var(--border-color);
  padding: 20px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.5);
  z-index: 20;
}

.title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0px;
}

.section h3 {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #e2e8f0;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 4px;
}

.model-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.model-buttons.row {
  flex-direction: row;
  flex-wrap: wrap;
}

button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-light);
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  flex: 1 1 calc(50% - 4px);
  text-align: center;
}

button:hover {
  background: rgba(255, 255, 255, 0.1);
}

button.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}

.param-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

input[type="range"] {
  width: 100%;
  accent-color: var(--accent-color);
}
</style>
