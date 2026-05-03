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

  if (props.scenario.type === 'horizontal-connected') {
    const centerY = CANVAS_HEIGHT / 2 + 50;
    const blockB_X = CANVAS_WIDTH / 2 + 80;
    const blockB_Y = centerY;
    if (clickX >= blockB_X - BLOCK_WIDTH / 2 && clickX <= blockB_X + BLOCK_WIDTH / 2 &&
        clickY >= blockB_Y - BLOCK_HEIGHT && clickY <= blockB_Y) {
      emit('object-clicked', 'blockB');
    }
    return;
  }

  if (props.scenario.type === 'vertical-connected') {
    const blockB_X = CANVAS_WIDTH / 2;
    const blockB_Y = CANVAS_HEIGHT / 2 + 80;
    if (clickX >= blockB_X - BLOCK_WIDTH / 2 && clickX <= blockB_X + BLOCK_WIDTH / 2 &&
        clickY >= blockB_Y - BLOCK_HEIGHT && clickY <= blockB_Y) {
      emit('object-clicked', 'blockB');
    }
    return;
  }

  if (props.scenario.type === 'desk-hanging-connected') {
    const blockB_X = CANVAS_WIDTH / 2 + 100;
    const blockB_Y = CANVAS_HEIGHT / 2 + 120;
    if (clickX >= blockB_X - BLOCK_HEIGHT / 2 && clickX <= blockB_X + BLOCK_HEIGHT / 2 &&
        clickY >= blockB_Y - BLOCK_WIDTH && clickY <= blockB_Y) {
      emit('object-clicked', 'blockB');
    }
    return;
  }

  if (props.scenario.type === 'atwood-machine') {
    const blockB_X = CANVAS_WIDTH / 2 + 40;
    const blockB_Y = CANVAS_HEIGHT / 2 + 120;
    if (clickX >= blockB_X - BLOCK_HEIGHT / 2 && clickX <= blockB_X + BLOCK_HEIGHT / 2 &&
        clickY >= blockB_Y - BLOCK_WIDTH && clickY <= blockB_Y) {
      emit('object-clicked', 'blockB');
    }
    return;
  }

  if (props.scenario.type === 'incline-connected') {
    const angleDeg = props.scenario.physicsParams.angle || 30;
    const angleRad = (angleDeg * Math.PI) / 180;
    const planeWidth = 500;
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2 + 80;
    const planeX1 = centerX - planeWidth / 2;
    const planeY1 = centerY;
    const blockDist = planeWidth * 0.5;
    const blockX = planeX1 + blockDist;
    const blockY = planeY1 - Math.tan(angleRad) * blockDist;

    const dx = clickX - blockX;
    const dy = clickY - blockY;
    const localX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
    const localY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);

    if (localX >= -BLOCK_WIDTH / 2 && localX <= BLOCK_WIDTH / 2 &&
        localY >= -BLOCK_HEIGHT && localY <= 0) {
      emit('object-clicked', 'blockA');
    }
    return;
  }

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
  
  if (props.scenario.type === 'horizontal-connected') {
    drawHorizontalConnectedScene(ctx);
    return;
  } else if (props.scenario.type === 'vertical-connected') {
    drawVerticalConnectedScene(ctx);
    return;
  } else if (props.scenario.type === 'desk-hanging-connected') {
    drawDeskHangingScene(ctx);
    return;
  } else if (props.scenario.type === 'atwood-machine') {
    drawAtwoodMachineScene(ctx);
    return;
  } else if (props.scenario.type === 'incline-connected') {
    drawInclineConnectedScene(ctx);
    return;
  }

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
 * 绘制水平面上两物体由轻绳连接的场景
 */
const drawHorizontalConnectedScene = (ctx) => {
  const centerY = CANVAS_HEIGHT / 2 + 50;
  
  // 1. 绘制水平面
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(CANVAS_WIDTH, centerY);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 阴影表示地面
  ctx.fillStyle = 'rgba(226, 232, 240, 0.5)';
  ctx.fillRect(0, centerY, CANVAS_WIDTH, 50);

  // 位置计算
  const blockA_X = CANVAS_WIDTH / 2 - 80;
  const blockB_X = CANVAS_WIDTH / 2 + 80;
  
  // 2. 绘制物块A (不受力分析目标，但作为场景的一部分)
  ctx.fillStyle = '#94a3b8'; // 灰色表示非当前分析对象
  ctx.fillRect(blockA_X - BLOCK_WIDTH / 2, centerY - BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.strokeRect(blockA_X - BLOCK_WIDTH / 2, centerY - BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 20px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', blockA_X, centerY - BLOCK_HEIGHT / 2 + 7);

  // 3. 绘制轻绳
  ctx.beginPath();
  ctx.moveTo(blockA_X + BLOCK_WIDTH / 2, centerY - BLOCK_HEIGHT / 2);
  ctx.lineTo(blockB_X - BLOCK_WIDTH / 2, centerY - BLOCK_HEIGHT / 2);
  ctx.strokeStyle = '#cbd5e1'; // 浅灰色绳子
  ctx.lineWidth = 4;
  ctx.stroke();
  // 绳子上的点缀
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = '#94a3b8';
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. 绘制物块B (当前分析对象)
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(blockB_X - BLOCK_WIDTH / 2, centerY - BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.strokeStyle = '#4338ca';
  ctx.lineWidth = 2;
  ctx.strokeRect(blockB_X - BLOCK_WIDTH / 2, centerY - BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.fillStyle = 'white';
  ctx.fillText('B', blockB_X, centerY - BLOCK_HEIGHT / 2 + 7);

  // 5. 绘制受力箭头
  const originX = blockB_X;
  const originY = centerY - BLOCK_HEIGHT / 2;

  props.scenario.correctForces.forEach(force => {
    if (props.confirmedForces.includes(force.id) || force.given) {
      drawForceArrow(ctx, originX, originY, force, 0);
    }
  });

  // 6. 绘制运动状态
  if (props.scenario.motion) {
    ctx.save();
    ctx.translate(blockB_X, centerY);
    const color = '#0ea5e9';
    ctx.beginPath();
    ctx.moveTo(0, -BLOCK_HEIGHT - 20);
    ctx.lineTo(60, -BLOCK_HEIGHT - 20);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    // 箭头头部
    ctx.beginPath();
    ctx.moveTo(60, -BLOCK_HEIGHT - 20);
    ctx.lineTo(50, -BLOCK_HEIGHT - 25);
    ctx.lineTo(50, -BLOCK_HEIGHT - 15);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.font = 'bold italic 18px serif';
    ctx.fillText(props.scenario.motion.label || 'a', 30, -BLOCK_HEIGHT - 30);
    ctx.restore();
  }
};

/**
 * 绘制竖直方向两物体连接场景
 */
const drawVerticalConnectedScene = (ctx) => {
  const blockA_Y = CANVAS_HEIGHT / 2 - 20;
  const blockB_Y = CANVAS_HEIGHT / 2 + 80;
  const centerX = CANVAS_WIDTH / 2;

  // 上方绳子
  ctx.beginPath();
  ctx.moveTo(centerX, 50);
  ctx.lineTo(centerX, blockA_Y - BLOCK_HEIGHT);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.stroke();
  
  // 物块A
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(centerX - BLOCK_WIDTH / 2, blockA_Y - BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX - BLOCK_WIDTH / 2, blockA_Y - BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 20px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', centerX, blockA_Y - BLOCK_HEIGHT / 2 + 7);

  // 中间绳子
  ctx.beginPath();
  ctx.moveTo(centerX, blockA_Y);
  ctx.lineTo(centerX, blockB_Y - BLOCK_HEIGHT);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.stroke();

  // 物块B (目标对象)
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(centerX - BLOCK_WIDTH / 2, blockB_Y - BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.strokeStyle = '#4338ca';
  ctx.lineWidth = 2;
  ctx.strokeRect(centerX - BLOCK_WIDTH / 2, blockB_Y - BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.fillStyle = 'white';
  ctx.fillText('B', centerX, blockB_Y - BLOCK_HEIGHT / 2 + 7);

  // 绘制受力箭头
  props.scenario.correctForces.forEach(force => {
    if (props.confirmedForces.includes(force.id) || force.given) {
      drawForceArrow(ctx, centerX, blockB_Y - BLOCK_HEIGHT / 2, force, 0);
    }
  });

  // 运动状态
  if (props.scenario.motion) {
    ctx.save();
    ctx.translate(centerX, blockB_Y);
    const color = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(BLOCK_WIDTH/2 + 20, -BLOCK_HEIGHT/2 + 30);
    ctx.lineTo(BLOCK_WIDTH/2 + 20, -BLOCK_HEIGHT/2 - 30);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    // 箭头头部
    ctx.beginPath();
    ctx.moveTo(BLOCK_WIDTH/2 + 20, -BLOCK_HEIGHT/2 - 30);
    ctx.lineTo(BLOCK_WIDTH/2 + 15, -BLOCK_HEIGHT/2 - 20);
    ctx.lineTo(BLOCK_WIDTH/2 + 25, -BLOCK_HEIGHT/2 - 20);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.font = 'bold italic 18px serif';
    ctx.fillText(props.scenario.motion.label || 'a', BLOCK_WIDTH/2 + 35, -BLOCK_HEIGHT/2);
    ctx.restore();
  }
};

/**
 * 绘制桌面与悬挂连接场景
 */
const drawDeskHangingScene = (ctx) => {
  const deskY = CANVAS_HEIGHT / 2 + 20;
  const deskRightX = CANVAS_WIDTH / 2 + 80;
  const blockA_X = CANVAS_WIDTH / 2 - 50;
  const blockB_X = deskRightX + 20;
  const blockB_Y = deskY + 100;
  
  // 桌子
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, deskY, deskRightX, CANVAS_HEIGHT - deskY);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, deskY);
  ctx.lineTo(deskRightX, deskY);
  ctx.stroke();

  // 滑轮 (固定在桌角)
  const pulleyRadius = 20;
  const pulleyX = deskRightX;
  // 调整高度，使绳子从物块中心水平引出时正好切于滑轮顶端
  const ropeY = deskY - BLOCK_HEIGHT / 2;
  const pulleyY = ropeY + pulleyRadius;
  
  // 绘制滑轮架
  ctx.beginPath();
  ctx.moveTo(deskRightX - 5, deskY);
  ctx.lineTo(deskRightX, pulleyY);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(pulleyX, pulleyY, pulleyRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(pulleyX, pulleyY, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#64748b';
  ctx.fill();

  // 绳子
  ctx.beginPath();
  // 从 A 的右侧中心开始
  ctx.moveTo(blockA_X + BLOCK_WIDTH / 2, ropeY);
  // 水平到滑轮切点
  ctx.lineTo(pulleyX, ropeY);
  // 绕过滑轮 (从 -PI/2 到 0)
  ctx.arc(pulleyX, pulleyY, pulleyRadius, -Math.PI/2, 0, false);
  // 向下到 B
  ctx.lineTo(pulleyX + pulleyRadius, blockB_Y - BLOCK_WIDTH);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.stroke();

  // 物块A
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(blockA_X - BLOCK_WIDTH / 2, deskY - BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.strokeRect(blockA_X - BLOCK_WIDTH / 2, deskY - BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 20px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', blockA_X, deskY - BLOCK_HEIGHT / 2 + 7);

  // 物块B (悬挂的是竖直长方形)
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(blockB_X - BLOCK_HEIGHT / 2, blockB_Y - BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_WIDTH);
  ctx.strokeStyle = '#4338ca';
  ctx.strokeRect(blockB_X - BLOCK_HEIGHT / 2, blockB_Y - BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_WIDTH);
  ctx.fillStyle = 'white';
  ctx.fillText('B', blockB_X, blockB_Y - BLOCK_WIDTH / 2 + 7);

  // 受力箭头
  props.scenario.correctForces.forEach(force => {
    if (props.confirmedForces.includes(force.id) || force.given) {
      drawForceArrow(ctx, blockB_X, blockB_Y - BLOCK_WIDTH / 2, force, 0);
    }
  });

  // 运动状态
  if (props.scenario.motion) {
    ctx.save();
    ctx.translate(blockB_X, blockB_Y);
    const color = '#0ea5e9';
    ctx.beginPath();
    ctx.moveTo(BLOCK_HEIGHT/2 + 20, -BLOCK_WIDTH/2 - 30);
    ctx.lineTo(BLOCK_HEIGHT/2 + 20, -BLOCK_WIDTH/2 + 30);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    // 箭头头部
    ctx.beginPath();
    ctx.moveTo(BLOCK_HEIGHT/2 + 20, -BLOCK_WIDTH/2 + 30);
    ctx.lineTo(BLOCK_HEIGHT/2 + 15, -BLOCK_WIDTH/2 + 20);
    ctx.lineTo(BLOCK_HEIGHT/2 + 25, -BLOCK_WIDTH/2 + 20);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.font = 'bold italic 18px serif';
    ctx.fillText(props.scenario.motion.label || 'a', BLOCK_HEIGHT/2 + 35, -BLOCK_WIDTH/2);
    ctx.restore();
  }
};

/**
 * 绘制阿特伍德机场景
 */
const drawAtwoodMachineScene = (ctx) => {
  const pulleyX = CANVAS_WIDTH / 2;
  const pulleyY = CANVAS_HEIGHT / 2 - 80;
  const pulleyRadius = 40;
  
  const blockA_X = pulleyX - pulleyRadius;
  const blockB_X = pulleyX + pulleyRadius;
  const blockA_Y = CANVAS_HEIGHT / 2 + 20; // 较轻，较高
  const blockB_Y = CANVAS_HEIGHT / 2 + 120; // 较重，较低

  // 天花板固定架
  ctx.beginPath();
  ctx.moveTo(pulleyX, 0);
  ctx.lineTo(pulleyX, pulleyY);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 6;
  ctx.stroke();

  // 滑轮
  ctx.beginPath();
  ctx.arc(pulleyX, pulleyY, pulleyRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(pulleyX, pulleyY, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#64748b';
  ctx.fill();

  // 绳子
  ctx.beginPath();
  ctx.moveTo(blockA_X, blockA_Y - BLOCK_WIDTH);
  ctx.lineTo(blockA_X, pulleyY);
  ctx.arc(pulleyX, pulleyY, pulleyRadius, Math.PI, 0, false);
  ctx.lineTo(blockB_X, blockB_Y - BLOCK_WIDTH);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.stroke();

  // 物块A
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(blockA_X - BLOCK_HEIGHT / 2, blockA_Y - BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_WIDTH);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.strokeRect(blockA_X - BLOCK_HEIGHT / 2, blockA_Y - BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_WIDTH);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 20px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', blockA_X, blockA_Y - BLOCK_WIDTH / 2 + 7);

  // 物块B (目标对象)
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(blockB_X - BLOCK_HEIGHT / 2, blockB_Y - BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_WIDTH);
  ctx.strokeStyle = '#4338ca';
  ctx.strokeRect(blockB_X - BLOCK_HEIGHT / 2, blockB_Y - BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_WIDTH);
  ctx.fillStyle = 'white';
  ctx.fillText('B', blockB_X, blockB_Y - BLOCK_WIDTH / 2 + 7);

  // 受力箭头
  props.scenario.correctForces.forEach(force => {
    if (props.confirmedForces.includes(force.id) || force.given) {
      drawForceArrow(ctx, blockB_X, blockB_Y - BLOCK_WIDTH / 2, force, 0);
    }
  });

  // 运动状态
  if (props.scenario.motion) {
    ctx.save();
    ctx.translate(blockB_X, blockB_Y);
    const color = '#0ea5e9';
    ctx.beginPath();
    ctx.moveTo(BLOCK_HEIGHT/2 + 20, -BLOCK_WIDTH/2 - 30);
    ctx.lineTo(BLOCK_HEIGHT/2 + 20, -BLOCK_WIDTH/2 + 30);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    // 箭头头部
    ctx.beginPath();
    ctx.moveTo(BLOCK_HEIGHT/2 + 20, -BLOCK_WIDTH/2 + 30);
    ctx.lineTo(BLOCK_HEIGHT/2 + 15, -BLOCK_WIDTH/2 + 20);
    ctx.lineTo(BLOCK_HEIGHT/2 + 25, -BLOCK_WIDTH/2 + 20);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.font = 'bold italic 18px serif';
    ctx.fillText(props.scenario.motion.label || 'a', BLOCK_HEIGHT/2 + 35, -BLOCK_WIDTH/2);
    ctx.restore();
  }
};

/**
 * 绘制斜面与悬挂连接场景
 */
const drawInclineConnectedScene = (ctx) => {
  // 复用斜面绘制逻辑
  const angleDeg = props.scenario.physicsParams.angle || 30;
  const angleRad = (angleDeg * Math.PI) / 180;
  const planeWidth = 500;
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2 + 80;
  const planeX1 = centerX - planeWidth / 2;
  const planeX2 = centerX + planeWidth / 2;
  const planeY1 = centerY;
  const planeY2 = centerY - Math.tan(angleRad) * planeWidth;

  // 绘制斜面
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

  // 滑轮 (位于斜面顶端，稍微偏移以对齐绳索)
  const pulleyRadius = 18;
  const pulleyX = planeX2 + pulleyRadius * Math.sin(angleRad);
  const pulleyY = planeY2 - pulleyRadius * Math.cos(angleRad);
  
  // 绘制滑轮架 (连接斜面顶端和滑轮圆心)
  ctx.beginPath();
  ctx.moveTo(planeX2, planeY2);
  ctx.lineTo(pulleyX, pulleyY);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(pulleyX, pulleyY, pulleyRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(pulleyX, pulleyY, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#64748b';
  ctx.fill();

  // 物块A 在斜面上
  const blockDist = planeWidth * 0.4;
  const blockX = planeX1 + blockDist;
  const blockY = planeY1 - Math.tan(angleRad) * blockDist;

  // 绳子
  const blockB_X = pulleyX + pulleyRadius;
  const blockB_Y = pulleyY + 140; // 稍微长一点
  
  // A 的中心 (绳子引出点)
  const ropeStartX = blockX - (BLOCK_HEIGHT / 2) * Math.sin(angleRad);
  const ropeStartY = blockY - (BLOCK_HEIGHT / 2) * Math.cos(angleRad);

  ctx.beginPath();
  ctx.moveTo(ropeStartX, ropeStartY);
  // 计算切点：滑轮圆心加上垂直于斜面的半径向量
  const tangentX = pulleyX - pulleyRadius * Math.sin(angleRad);
  const tangentY = pulleyY - pulleyRadius * Math.cos(angleRad);
  ctx.lineTo(tangentX, tangentY);
  // 绕过滑轮：从 (angleRad - PI/2) 到 0
  ctx.arc(pulleyX, pulleyY, pulleyRadius, -angleRad - Math.PI/2, 0, false);
  ctx.lineTo(blockB_X, blockB_Y - BLOCK_WIDTH);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.stroke();

  // 绘制物块A (目标对象)
  ctx.save();
  ctx.translate(blockX, blockY);
  ctx.rotate(-angleRad);
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(-BLOCK_WIDTH / 2, -BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.strokeStyle = '#4338ca';
  ctx.lineWidth = 2;
  ctx.strokeRect(-BLOCK_WIDTH / 2, -BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 20px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', 0, -BLOCK_HEIGHT / 2 + 7);
  ctx.restore();

  // 绘制物块B (悬挂)
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(blockB_X - BLOCK_HEIGHT / 2, blockB_Y - BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_WIDTH);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.strokeRect(blockB_X - BLOCK_HEIGHT / 2, blockB_Y - BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_WIDTH);
  ctx.fillStyle = 'white';
  ctx.fillText('B', blockB_X, blockB_Y - BLOCK_WIDTH / 2 + 7);

  // 受力箭头
  const originX = blockX - (BLOCK_HEIGHT / 2) * Math.sin(angleRad);
  const originY = blockY - (BLOCK_HEIGHT / 2) * Math.cos(angleRad);

  props.scenario.correctForces.forEach(force => {
    if (props.confirmedForces.includes(force.id) || force.given) {
      drawForceArrow(ctx, originX, originY, force, angleRad);
    }
  });

  // 运动状态
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

  if (force.id === 'gravity' || force.id === 'incline-gravity' || force.id === 'gravity-B') {
    dx = 0;
    dy = ARROW_LENGTH;
    color = '#ef4444';
  } else if (force.id === 'normal-force' || force.id === 'normal-force-B') {
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
  } else if (force.id === 'horizontal-force' || force.id === 'external-force-F') {
    // 水平向右
    dx = ARROW_LENGTH * 1.1;
    dy = 0;
    color = '#f97316'; // 橙色，区分于其他力
  } else if (force.id === 'tension-left' || force.id === 'kinetic-friction-B') {
    // 水平向左
    dx = -ARROW_LENGTH * 1.1;
    dy = 0;
    color = force.id === 'kinetic-friction-B' ? '#22c55e' : '#8b5cf6';
  } else if (force.id === 'tension-up') {
    dx = 0;
    dy = -ARROW_LENGTH;
    color = '#8b5cf6'; // 紫色拉力
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
