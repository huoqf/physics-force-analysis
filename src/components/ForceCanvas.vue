<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';

const props = defineProps({
  scenario: {
    type: Object,
    required: true
  },
  confirmedForces: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['object-clicked']);

const canvasRef = ref(null);
let ctx = null;
let animationFrameId = null;

// 物理参数常量
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;  // 从 400 增加到 500
const BLOCK_WIDTH = 80;
const BLOCK_HEIGHT = 50;
const ARROW_LENGTH = 100;

/**
 * 处理画布点击事件，判断是否点中了物体
 */
const handleCanvasClick = (event) => {
  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const scaleX = canvasRef.value.width / rect.width;
  const scaleY = canvasRef.value.height / rect.height;
  
  const clickX = (event.clientX - rect.left) * scaleX;
  const clickY = (event.clientY - rect.top) * scaleY;

  const angleDeg = props.scenario.physicsParams.angle || 30;
  const angleRad = (angleDeg * Math.PI) / 180;
  
  const planeWidth = 500;
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2 + 80;// 从 +50 改为 +80，使斜面更居中
  const planeX1 = centerX - planeWidth / 2;
  const planeY1 = centerY;
  
  const blockDist = planeWidth * 0.5;
  const blockX = planeX1 + blockDist;
  const blockY = planeY1 - Math.tan(angleRad) * blockDist;

  // 将点击坐标逆变换到物块的本地坐标系
  const dx = clickX - blockX;
  const dy = clickY - blockY;
  
  const localX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
  const localY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);
  
  // 新增：斜面点击检测 (判断点击是否在斜面三角形内)
  const planeX2 = centerX + planeWidth / 2;
  const planeY2 = centerY - Math.tan(angleRad) * planeWidth;
  
  // 使用重心坐标法判断点是否在三角形内
  const sign = (p1, p2, p3) => {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  };
  
  const isInTriangle = (pt, v1, v2, v3) => {
    const d1 = sign(pt, v1, v2);
    const d2 = sign(pt, v2, v3);
    const d3 = sign(pt, v3, v1);
    const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    return !(hasNeg && hasPos);
  };
  
  const clickPt = { x: clickX, y: clickY };
  const v1 = { x: planeX1, y: planeY1 };
  const v2 = { x: planeX2, y: planeY1 };
  const v3 = { x: planeX2, y: planeY2 };
  
  if (isInTriangle(clickPt, v1, v2, v3)) {
    emit('object-clicked', 'incline');
  }

  // 判断点击坐标是否在物块的边界内
  if (localX >= -BLOCK_WIDTH / 2 && localX <= BLOCK_WIDTH / 2 &&
      localY >= -BLOCK_HEIGHT && localY <= 0) {
    emit('object-clicked', 'block');
  }
};

/**
 * 初始化 Canvas
 */
onMounted(() => {
  ctx = canvasRef.value.getContext('2d');
  draw();
});

/**
 * 监听数据变化并重绘
 */
watch(() => [props.scenario, props.confirmedForces], () => {
  draw();
}, { deep: true });

/**
 * 绘制主函数
 */
const draw = () => {
  if (!ctx) return;

  // 清除画布
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // 获取参数
  const angleDeg = props.scenario.physicsParams.angle || 30;
  const angleRad = (angleDeg * Math.PI) / 180;
  
  // 中心点
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2 + 50;

  // 1. 绘制斜面 (底部宽 500)
  const planeWidth = 500;
  const planeX1 = centerX - planeWidth / 2;
  const planeX2 = centerX + planeWidth / 2;
  const planeY1 = centerY;
  const planeY2 = centerY - Math.tan(angleRad) * planeWidth;

  // 绘制斜面底座 (填充三角形)
  ctx.beginPath();
  ctx.moveTo(planeX1, planeY1);
  ctx.lineTo(planeX2, planeY1);
  ctx.lineTo(planeX2, planeY2);
  ctx.closePath();
  
  const gradient = ctx.createLinearGradient(planeX1, planeY1, planeX2, planeY2);
  gradient.addColorStop(0, '#f1f5f9');
  gradient.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 2. 绘制物块
  // 计算物块中心在斜面上的位置
  const blockDist = planeWidth * 0.5; // 放在斜面中间
  const blockX = planeX1 + blockDist;
  const blockY = planeY1 - Math.tan(angleRad) * blockDist;

  ctx.save();
  ctx.translate(blockX, blockY);
  ctx.rotate(-angleRad); // 沿斜面旋转

  // 绘制物块阴影
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;

  // 根据运动状态选择颜色
  let blockColor = '#6366f1'; // 默认静止 (Indigo)
  let strokeColor = '#4338ca';
  
  if (props.scenario.motion) {
    if (props.scenario.motion.direction === 'down-incline') {
      blockColor = '#0ea5e9'; // 下滑 (Sky Blue)
      strokeColor = '#0369a1';
    } else if (props.scenario.motion.direction === 'up-incline') {
      blockColor = '#f59e0b'; // 上滑 (Amber)
      strokeColor = '#b45309';
    }
  }

  // 物块主体
  ctx.fillStyle = blockColor;
  ctx.fillRect(-BLOCK_WIDTH / 2, -BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  
  // 物块轮廓
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(-BLOCK_WIDTH / 2, -BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  
  ctx.restore();

  // 3. 绘制受力箭头
  let originX, originY;
  if (props.scenario.targetObject && props.scenario.targetObject.id === 'incline') {
    originX = centerX;
    originY = centerY - (Math.tan(angleRad) * planeWidth) / 4; 
  } else {
    originX = blockX - (BLOCK_HEIGHT / 2) * Math.sin(angleRad);
    originY = blockY - (BLOCK_HEIGHT / 2) * Math.cos(angleRad);
  }

  props.scenario.correctForces.forEach(force => {
    if (props.confirmedForces.includes(force.id) || force.given) {
      drawForceArrow(ctx, originX, originY, force, angleRad);
    }
  });

  // 4. 绘制运动状态指示 (如速度矢量 v)
  if (props.scenario.motion) {
    drawMotionIndicator(ctx, blockX, blockY, props.scenario.motion, angleRad);
  }
};

/**
 * 绘制运动状态指示器 (速度矢量等)
 */
const drawMotionIndicator = (ctx, x, y, motion, angleRad) => {
  ctx.save();
  ctx.translate(x, y);
  
  let dx = 0, dy = 0;
  const length = 80; // 增长箭头
  
  if (motion.direction === 'down-incline') {
    dx = -Math.cos(angleRad) * length;
    dy = Math.sin(angleRad) * length;
  } else if (motion.direction === 'up-incline') {
    dx = Math.cos(angleRad) * length;
    dy = -Math.sin(angleRad) * length;
  }
  
  // 颜色与物块一致
  const color = motion.direction === 'down-incline' ? '#0ea5e9' : '#f59e0b';

  // 绘制速度矢量箭头 (实线，更粗)
  ctx.beginPath();
  ctx.moveTo(0, -BLOCK_HEIGHT / 2);
  ctx.lineTo(dx, dy - BLOCK_HEIGHT / 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // 箭头头部
  const headlen = 12;
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(dx, dy - BLOCK_HEIGHT / 2);
  ctx.lineTo(dx - headlen * Math.cos(angle - Math.PI / 6), dy - BLOCK_HEIGHT / 2 - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(dx - headlen * Math.cos(angle + Math.PI / 6), dy - BLOCK_HEIGHT / 2 - headlen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  
  // 标注 'v'，加上背景小圆框提升辨识度
  ctx.fillStyle = color;
  ctx.font = 'bold italic 18px serif';
  ctx.fillText(motion.label || 'v', dx + 10, dy - BLOCK_HEIGHT / 2 + 5);
  
  ctx.restore();
};

/**
 * 绘制受力箭头的辅助函数
 */
const drawForceArrow = (ctx, x, y, force, angleRad) => {
  let dx = 0, dy = 0;
  let color = '#ef4444'; // 默认红色

  if (force.id === 'gravity' || force.id === 'incline-gravity') {
    dx = 0;
    dy = ARROW_LENGTH;
    color = '#ef4444';
  } else if (force.id === 'normal-force') {
    // 垂直斜面向上
    dx = -Math.sin(angleRad) * ARROW_LENGTH;
    dy = -Math.cos(angleRad) * ARROW_LENGTH;
    color = '#3b82f6';
  } else if (force.id === 'static-friction' || force.id === 'kinetic-friction-up' || force.id === 'max-static-friction') {
    // 沿斜面向上
    dx = Math.cos(angleRad) * ARROW_LENGTH;
    dy = -Math.sin(angleRad) * ARROW_LENGTH;
    // 最大静摩擦力用加深的绿色
    color = force.id === 'max-static-friction' ? '#15803d' : '#22c55e';
  } else if (force.id === 'kinetic-friction-down' || force.id === 'static-friction-down') {
    // 沿斜面向下
    dx = -Math.cos(angleRad) * ARROW_LENGTH;
    dy = Math.sin(angleRad) * ARROW_LENGTH;
    color = '#22c55e';
  } else if (force.id === 'push-force') {
    // 沿斜面向上，紫色
    dx = Math.cos(angleRad) * ARROW_LENGTH * 1.2;
    dy = -Math.sin(angleRad) * ARROW_LENGTH * 1.2;
    color = '#a855f7';
  } else if (force.id === 'horizontal-force') {
    // 水平向右
    dx = ARROW_LENGTH * 1.1;
    dy = 0;
    color = '#f97316'; // 橙色，区分于其他力
  } else if (force.id === 'ground-normal') {
    dx = 0;
    dy = -ARROW_LENGTH;
    color = '#3b82f6';
  } else if (force.id === 'block-pressure') {
    dx = Math.sin(angleRad) * ARROW_LENGTH * 0.8;
    dy = Math.cos(angleRad) * ARROW_LENGTH * 0.8;
    color = '#f59e0b';
  } else if (force.id === 'block-friction') {
    dx = -Math.cos(angleRad) * ARROW_LENGTH * 0.8;
    dy = Math.sin(angleRad) * ARROW_LENGTH * 0.8;
    color = '#22c55e';
  }

  // 绘制线条
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();

  // 绘制箭头头部
  const headlen = 10;
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(x + dx, y + dy);
  ctx.lineTo(x + dx - headlen * Math.cos(angle - Math.PI / 6), y + dy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x + dx - headlen * Math.cos(angle + Math.PI / 6), y + dy - headlen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // 绘制标签 (Symbol)
  ctx.font = 'bold 18px "Inter", sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(force.symbol, x + dx * 1.2, y + dy * 1.2 + 5);
};
</script>

<template>
  <div class="canvas-container">
    <canvas 
      ref="canvasRef" 
      :width="CANVAS_WIDTH" 
      :height="CANVAS_HEIGHT"
      class="physics-canvas"
      @click="handleCanvasClick"
    ></canvas>
    
    <!-- 装饰背景 -->
    <div class="grid-overlay"></div>
  </div>
</template>

<style scoped>
.canvas-container {
  position: relative;
  width: 600px;
  height: 500px;/* 同步增加高度 */
  background: #ffffff;
  border-radius: 24px;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.02), 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.physics-canvas {
  position: relative;
  z-index: 2;
  cursor: crosshair;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(#f1f5f9 1px, transparent 1px),
    linear-gradient(90deg, #f1f5f9 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 1;
  pointer-events: none;
  opacity: 0.5;
}
</style>
