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
import { connectedLightRopeScenario } from '../data/scenarios/connectedLightRope.js';
import { connectedHorizontalFrictionScenario } from '../data/scenarios/connectedHorizontalFriction.js';
import { connectedVerticalScenario } from '../data/scenarios/connectedVertical.js';
import { connectedDeskHangingScenario } from '../data/scenarios/connectedDeskHanging.js';
import { connectedAtwoodScenario } from '../data/scenarios/connectedAtwood.js';
import { connectedInclineHangingScenario } from '../data/scenarios/connectedInclineHanging.js';

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
  'connected-light-rope-horizontal': connectedLightRopeScenario,
  'connected-horizontal-friction': connectedHorizontalFrictionScenario,
  'connected-vertical': connectedVerticalScenario,
  'connected-desk-hanging': connectedDeskHangingScenario,
  'connected-atwood': connectedAtwoodScenario,
  'connected-incline-hanging': connectedInclineHangingScenario,
};

// 场景分组配置
const scenarioGroups = [
  {
    id: 'basic-incline',
    title: '基础斜面模型',
    items: [
      { id: 'incline-block-static', label: '静止物块' },
      { id: 'incline-block-frictionless', label: '无摩擦下滑' },
      { id: 'incline-block-friction-down', label: '有摩擦下滑' },
      { id: 'incline-block-pushed', label: '受推力上滑' },
      { id: 'incline-block-uniform', label: '匀速下滑' },
      { id: 'incline-plane-static', label: '分析斜面' },
    ]
  },
  {
    id: 'advanced-incline',
    title: '复杂斜面分析',
    items: [
      { id: 'incline-movable-block', label: '可动斜面(物块)' },
      { id: 'incline-movable-plane', label: '可动斜面(斜面)' },
      { id: 'incline-block-horizontal-force', label: '水平力静止' },
      { id: 'incline-block-critical-down', label: '临界下滑' },
      { id: 'incline-block-f-range', label: 'F 范围分析' },
    ]
  },
  {
    id: 'connected-body',
    title: '连接体模型',
    items: [
      { id: 'connected-light-rope-horizontal', label: '水平无摩擦' },
      { id: 'connected-horizontal-friction', label: '水平有摩擦' },
      { id: 'connected-vertical', label: '竖直悬挂' },
      { id: 'connected-desk-hanging', label: '桌面与悬挂' },
      { id: 'connected-atwood', label: '阿特伍德机' },
      { id: 'connected-incline-hanging', label: '斜面与悬挂' },
    ]
  }
];

// 控制分组展开/收起的状态
const expandedGroups = ref(['basic-incline', 'advanced-incline', 'connected-body']);

const toggleGroup = (groupId) => {
  const index = expandedGroups.value.indexOf(groupId);
  if (index > -1) {
    expandedGroups.value.splice(index, 1);
  } else {
    expandedGroups.value.push(groupId);
  }
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
          <div class="sidebar-title-container">
            <h3>模型场景选择</h3>
          </div>
          <div class="groups-container">
            <div v-for="group in scenarioGroups" :key="group.id" class="scenario-group">
              <div class="group-header" @click="toggleGroup(group.id)">
                <span class="group-title">{{ group.title }}</span>
                <span class="chevron" :class="{ rotated: expandedGroups.includes(group.id) }">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M9 18l6-6-6-6"></path></svg>
                </span>
              </div>
              <Transition name="expand">
                <ul v-if="expandedGroups.includes(group.id)" class="scenario-list">
                  <li 
                    v-for="item in group.items" 
                    :key="item.id"
                    :class="{ active: currentScenarioId === item.id }" 
                    @click="selectScenario(item.id)"
                  >
                    {{ item.label }}
                  </li>
                </ul>
              </Transition>
            </div>
          </div>
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
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 120px);
}

.sidebar-title-container h3 {
  margin: 8px 0 16px 8px;
  font-size: 16px;
  color: #1e293b;
  font-weight: 700;
}

.groups-container {
  overflow-y: auto;
  padding-right: 4px;
}

/* 滚动条美化 */
.groups-container::-webkit-scrollbar {
  width: 5px;
}
.groups-container::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.scenario-group {
  margin-bottom: 8px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.group-header:hover {
  background: #f1f5f9;
}

.group-title {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.chevron {
  transition: transform 0.3s ease;
  color: #94a3b8;
}

.chevron.rotated {
  transform: rotate(90deg);
}

.scenario-list {
  list-style: none;
  padding: 4px 0 0 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scenario-list li {
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  margin-left: 8px;
  border: 1px solid transparent;
}

.scenario-list li:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.scenario-list li.active {
  background: #4f46e5;
  color: white;
  border-color: #4338ca;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
}

/* 展开动画 */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-out;
  max-height: 500px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
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
