<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ForceCanvas from '../components/ForceCanvas.vue';
import StepGuide from '../components/StepGuide.vue';
import { inclineBlockScenario } from '../data/scenarios/inclineBlock.js';
import { inclinePlaneScenario } from '../data/scenarios/inclinePlane.js';
import { inclineBlockFrictionlessScenario } from '../data/scenarios/inclineBlockFrictionless.js';
import { inclineBlockFrictionScenario } from '../data/scenarios/inclineBlockFriction.js';
import { inclineBlockPushedScenario } from '../data/scenarios/inclineBlockPushed.js';
import { inclineBlockUniformScenario } from '../data/scenarios/inclineBlockUniform.js';
import { inclineMovableBlockScenario } from '../data/scenarios/inclineMovableBlock.js';
import { inclineMovablePlaneScenario } from '../data/scenarios/inclineMovablePlane.js';
import { inclineBlockHorizontalForceScenario } from '../data/scenarios/inclineBlockHorizontalForce.js';
import { inclineBlockCriticalDownScenario } from '../data/scenarios/inclineBlockCriticalDown.js';
import { inclineBlockFRangeScenario } from '../data/scenarios/inclineBlockFRange.js';

const scenariosMap = {
  'incline-block-static': inclineBlockScenario,
  'incline-block-frictionless': inclineBlockFrictionlessScenario,
  'incline-block-friction-down': inclineBlockFrictionScenario,
  'incline-block-pushed': inclineBlockPushedScenario,
  'incline-block-uniform': inclineBlockUniformScenario,
  'incline-plane-static': inclinePlaneScenario,
  'incline-movable-block': inclineMovableBlockScenario,
  'incline-movable-plane': inclineMovablePlaneScenario,
  'incline-block-horizontal-force': inclineBlockHorizontalForceScenario,
  'incline-block-critical-down': inclineBlockCriticalDownScenario,
  'incline-block-f-range': inclineBlockFRangeScenario,
};

// 当前加载的场景数据
const currentScenarioId = ref('incline-block-static');
const scenario = computed(() => scenariosMap[currentScenarioId.value]);

// 组件引用
const stepGuideRef = ref(null);

// 已确认显示的受力 ID 列表
const confirmedForces = ref([]);

const selectScenario = (id) => {
  currentScenarioId.value = id;
  confirmedForces.value = [];
};

/**
 * 处理画板上点击物体的事件
 */
const handleObjectClicked = (targetId) => {
  if (stepGuideRef.value && stepGuideRef.value.currentStepIndex === 0) {
    if (targetId === 'block' && currentScenarioId.value === 'incline-plane-static') {
      selectScenario('incline-block-static');
    } else if (targetId === 'incline' && currentScenarioId.value !== 'incline-plane-static') {
      selectScenario('incline-plane-static');
    }
  }

  if (stepGuideRef.value) {
    stepGuideRef.value.handleExternalAction('click', targetId);
  }
};

/**
 * 处理受力确认事件
 * 当用户在 StepGuide 中通过判断正确时触发
 */
const handleForceConfirmed = (forceId) => {
  if (!confirmedForces.value.includes(forceId)) {
    confirmedForces.value.push(forceId);
  }
};

/**
 * 处理场景完成
 */
const handleScenarioCompleted = () => {
  alert('祝贺你！你已经成功完成了该场景的受力分析。');
};

/**
 * 重置分析过程
 */
const resetAnalysis = () => {
  confirmedForces.value = [];
  // 这里可以进一步通过 key 或 ref 重置 StepGuide 组件的状态
  window.location.reload(); 
};

// 全屏功能
const isFullScreen = ref(false);

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

const handleFullscreenChange = () => {
  isFullScreen.value = !!document.fullscreenElement;
};

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>

<template>
  <div class="learning-view">
    <header class="view-header">
      <div class="header-content">
        <h1 class="view-title">高中物理受力分析训练器</h1>
        <div class="header-actions">
          <button class="action-btn" @click="toggleFullScreen">
            <svg v-if="!isFullScreen" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: text-bottom;"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
            <svg v-else viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: text-bottom;"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
            {{ isFullScreen ? '退出全屏' : '全屏显示' }}
          </button>
          <button class="reset-btn" @click="resetAnalysis">重置实验</button>
        </div>
      </div>
    </header>

    <main class="view-main">
      <!-- 左侧导航：场景选择 -->
      <aside class="sidebar-section">
        <div class="sidebar-card">
          <h3>斜面模型分类</h3>
          <ul class="scenario-list">
            <li class="group-label">基础模型</li>
            <li :class="{ active: currentScenarioId === 'incline-block-static' }" @click="selectScenario('incline-block-static')">静止物块</li>
            <li :class="{ active: currentScenarioId === 'incline-block-frictionless' }" @click="selectScenario('incline-block-frictionless')">无摩擦下滑</li>
            <li :class="{ active: currentScenarioId === 'incline-block-friction-down' }" @click="selectScenario('incline-block-friction-down')">有摩擦下滑</li>
            <li :class="{ active: currentScenarioId === 'incline-block-pushed' }" @click="selectScenario('incline-block-pushed')">受推力上滑</li>
            <li :class="{ active: currentScenarioId === 'incline-block-uniform' }" @click="selectScenario('incline-block-uniform')">匀速下滑</li>
            <li :class="{ active: currentScenarioId === 'incline-plane-static' }" @click="selectScenario('incline-plane-static')">分析斜面</li>
            <li class="group-label">可动斜面</li>
            <li :class="{ active: currentScenarioId === 'incline-movable-block' }" @click="selectScenario('incline-movable-block')">分析物块</li>
            <li :class="{ active: currentScenarioId === 'incline-movable-plane' }" @click="selectScenario('incline-movable-plane')">分析斜面</li>
            <li class="group-label">特殊受力</li>
            <li :class="{ active: currentScenarioId === 'incline-block-horizontal-force' }" @click="selectScenario('incline-block-horizontal-force')">水平力静止</li>
            <li :class="{ active: currentScenarioId === 'incline-block-critical-down' }" @click="selectScenario('incline-block-critical-down')">临界下滑</li>
            <li :class="{ active: currentScenarioId === 'incline-block-f-range' }" @click="selectScenario('incline-block-f-range')">F 范围分析</li>
          </ul>
        </div>
      </aside>

      <!-- 中间：物理画布 -->
      <section class="canvas-section">
        <div class="section-card">
          <div class="section-header">
            <span class="status-dot"></span>
            <h3>物理场景预览</h3>
          </div>
          <ForceCanvas 
            :scenario="scenario" 
            :confirmedForces="confirmedForces" 
            @object-clicked="handleObjectClicked"
          />
          <div class="canvas-footer">
            <p>已识别受力: {{ confirmedForces.length }} / {{ scenario.correctForces.length }}</p>
          </div>
        </div>
      </section>

      <!-- 右侧：教学引导 -->
      <section class="guide-section">
        <StepGuide 
          :key="currentScenarioId"
          ref="stepGuideRef"
          :scenario="scenario" 
          @force-confirmed="handleForceConfirmed"
          @scenario-completed="handleScenarioCompleted"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.learning-view {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', 'Outfit', system-ui, sans-serif;
}

.view-header {
  background: white;
  padding: 16px 40px;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-title {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  background: linear-gradient(135deg, #4f46e5, #9333ea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.reset-btn, .action-btn {
  background: #f1f5f9;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.reset-btn:hover, .action-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.view-main {
  flex: 1;
  display: flex;
  gap: 24px;
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.sidebar-section {
  flex: 0 0 200px;
}

.sidebar-card {
  background: white;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
}

.sidebar-card h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
}

.scenario-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scenario-list li {
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  background: #f8fafc;
}

.scenario-list li:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.scenario-list li.active {
  background: #4f46e5;
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.scenario-list li.group-label {
  padding: 6px 8px 2px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
  background: transparent;
  cursor: default;
  border-top: 1px solid #e2e8f0;
  margin-top: 4px;
}

.scenario-list li.group-label:hover {
  background: transparent;
  color: #94a3b8;
}

.canvas-section {
  flex: 1.5;
}

.guide-section {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.section-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  color: #475569;
}

.canvas-footer {
  margin-top: 20px;
  width: 100%;
  padding-top: 16px;
  border-top: 1px dashed #e2e8f0;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

/* 响应式适配 */
@media (max-width: 1024px) {
  .view-main {
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .canvas-section, .guide-section {
    width: 100%;
  }
  
  .guide-section {
    justify-content: center;
  }
}
</style>
