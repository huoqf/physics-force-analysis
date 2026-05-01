<script setup>
import { ref } from 'vue';
import ForceCanvas from '../components/ForceCanvas.vue';
import StepGuide from '../components/StepGuide.vue';
import { inclineBlockScenario } from '../data/scenarios/inclineBlock.js';

// 当前加载的场景数据
const scenario = ref(inclineBlockScenario);

// 组件引用
const stepGuideRef = ref(null);

// 已确认显示的受力 ID 列表
const confirmedForces = ref([]);

/**
 * 处理画板上点击物体的事件
 */
const handleObjectClicked = (targetId) => {
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
</script>

<template>
  <div class="learning-view">
    <header class="view-header">
      <div class="header-content">
        <h1 class="view-title">高中物理受力分析训练器</h1>
        <div class="header-actions">
          <button class="reset-btn" @click="resetAnalysis">重置实验</button>
        </div>
      </div>
    </header>

    <main class="view-main">
      <!-- 左侧：物理画布 -->
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

.reset-btn {
  background: #f1f5f9;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.view-main {
  flex: 1;
  display: flex;
  gap: 32px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
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
