<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  scenario: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['force-confirmed', 'scenario-completed', 'step-changed']);

const currentStepIndex = ref(0);
const feedback = ref(null);

const currentStep = computed(() => props.scenario.steps[currentStepIndex.value]);
const isLastStep = computed(() => currentStepIndex.value === props.scenario.steps.length - 1);

/**
 * 处理选项点击
 */
const handleOptionClick = (option) => {
  if (option.correct) {
    // 成功逻辑
    let displayMessage = option.reason || '';
    
    // 如果该步骤关联了具体的受力，则尝试获取力的详细解释
    if (currentStep.value.forceId) {
      const forceDetails = props.scenario.correctForces.find(f => f.id === currentStep.value.forceId);
      if (forceDetails) {
        displayMessage = forceDetails.reason;
        // 通知父组件在画布上渲染该力
        emit('force-confirmed', currentStep.value.forceId);
      }
    }
    
    feedback.value = {
      type: 'success',
      message: displayMessage || '判断正确！'
    };
  } else {
    // 错误逻辑：从 commonMistakes 中匹配反馈
    const mistake = props.scenario.commonMistakes.find(m => m.id === option.mistakeId);
    feedback.value = {
      type: 'error',
      message: mistake ? mistake.feedback : '回答有误，请重新思考。'
    };
  }
};

/**
 * 进入下一步
 */
const nextStep = () => {
  if (isLastStep.value) {
    emit('scenario-completed');
  } else {
    currentStepIndex.value++;
    feedback.value = null;
    emit('step-changed', currentStepIndex.value);
  }
};

/**
 * 清除错误反馈，允许重试
 */
const clearFeedback = () => {
  feedback.value = null;
};

/**
 * 处理外部传入的交互动作（例如点击物体）
 */
const handleExternalAction = (actionType, targetId) => {
  if (currentStep.value.action === actionType && currentStep.value.target === targetId) {
    feedback.value = {
      type: 'success',
      message: currentStep.value.reason || '操作正确！'
    };
  }
};

defineExpose({
  handleExternalAction
});
</script>

<template>
  <div class="step-guide">
    <div v-if="currentStep" class="guide-card">
      <!-- 进度条 -->
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${((currentStepIndex + 1) / scenario.steps.length) * 100}%` }"
        ></div>
      </div>

      <div class="step-header">
        <span class="step-badge">步骤 {{ currentStepIndex + 1 }} / {{ scenario.steps.length }}</span>
        <h2 class="step-title">{{ currentStep.title }}</h2>
      </div>

      <div class="step-body">
        <p class="step-content">{{ currentStep.content }}</p>

        <!-- 选项区域 -->
        <div v-if="currentStep.options && !feedback" class="options-container">
          <button
            v-for="(option, index) in currentStep.options"
            :key="index"
            class="option-btn"
            @click="handleOptionClick(option)"
          >
            {{ option.text }}
          </button>
        </div>

        <!-- 反馈区域 -->
        <Transition name="fade-up">
          <div v-if="feedback" class="feedback-box" :class="feedback.type">
            <div class="feedback-icon">
              <span v-if="feedback.type === 'success'">Check</span>
              <span v-else>Info</span>
            </div>
            <div class="feedback-text">
              <p>{{ feedback.message }}</p>
            </div>
            
            <div class="feedback-actions">
              <button 
                v-if="feedback.type === 'success'" 
                class="action-btn next"
                @click="nextStep"
              >
                {{ isLastStep ? '完成分析' : '下一步' }}
              </button>
              <button 
                v-else 
                class="action-btn retry"
                @click="clearFeedback"
              >
                返回重试
              </button>
            </div>
          </div>
        </Transition>

        <!-- 非选项步骤的提示 (如：请点击物体) -->
        <div v-if="!currentStep.options && !feedback" class="action-hint">
          <div class="pulse-icon"></div>
          等待交互操作...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-guide {
  width: 100%;
  max-width: 450px;
  font-family: 'Inter', 'Outfit', system-ui, sans-serif;
}

.guide-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  position: relative;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: rgba(0, 0, 0, 0.05);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5, #9333ea);
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-badge {
  font-size: 12px;
  font-weight: 600;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(99, 102, 241, 0.1);
  padding: 4px 10px;
  border-radius: 100px;
}

.step-title {
  margin: 12px 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.step-content {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 24px;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 14px 20px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 500;
  color: #334155;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-btn:hover {
  border-color: #6366f1;
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.feedback-box {
  padding: 20px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feedback-box.success {
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.feedback-box.error {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.feedback-text p {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: #1e293b;
}

.success .feedback-text p { color: #15803d; }
.error .feedback-text p { color: #b91c1c; }

.action-btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.action-btn.next {
  background: #22c55e;
  color: white;
}

.action-btn.next:hover { background: #16a34a; }

.action-btn.retry {
  background: #ef4444;
  color: white;
}

.action-btn.retry:hover { background: #dc2626; }

.action-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #94a3b8;
  font-style: italic;
  padding: 20px;
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
}

.pulse-icon {
  width: 8px;
  height: 8px;
  background: #6366f1;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}

.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.3s ease;
}
.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
