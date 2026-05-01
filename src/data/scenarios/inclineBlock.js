/**
 * 场景：粗糙斜面上的静止物块
 */
export const inclineBlockScenario = {
  id: 'incline-block-static',
  title: '粗糙斜面上的静止物块',
  description: '一个物块静止在倾角为 θ 的粗糙斜面上，分析其受力情况。',
  
  // 物理参数
  physicsParams: {
    mass: 2.0, // kg
    angle: 30, // degrees (θ)
    mu_s: 0.6, // 静摩擦因数 (μs)
    g: 9.8    // 重力加速度 (m/s²)
  },

  // 研究对象
  targetObject: {
    id: 'block',
    name: '物块',
    type: 'rectangle',
    dimensions: { width: 60, height: 40 }
  },

  // 正确的受力列表
  correctForces: [
    {
      id: 'gravity',
      name: '重力',
      symbol: 'G',
      origin: '地球',
      target: '物块',
      direction: '竖直向下',
      reason: '由于地球的吸引而产生，任何在地球表面的物体都受重力。'
    },
    {
      id: 'normal-force',
      name: '斜面的支持力',
      symbol: 'F_N',
      origin: '斜面',
      target: '物块',
      direction: '垂直斜面向上',
      reason: '物块挤压斜面，斜面发生微小弹性形变，对物块产生垂直于接触面并指向物块的力。'
    },
    {
      id: 'static-friction',
      name: '静摩擦力',
      symbol: 'f_s',
      origin: '斜面',
      target: '物块',
      direction: '沿斜面向上',
      reason: '物块在斜面上有沿斜面向下滑动的趋势，斜面产生阻碍这种相对运动趋势的力。'
    }
  ],

  // 常见错误列表
  commonMistakes: [
    {
      id: 'downward-sliding-force',
      name: '下滑力',
      feedback: '错误！不存在“下滑力”。所谓的下滑力实际上是重力沿斜面向下的分力，受力分析时只能画出真实的施力物体产生的力。'
    },
    {
      id: 'friction-wrong-direction',
      name: '摩擦力方向画反',
      feedback: '错误！静摩擦力的方向总是与物体相对运动趋势的方向相反。物块有下滑趋势，静摩擦力应沿斜面向上。'
    },
    {
      id: 'missing-friction',
      name: '漏画摩擦力',
      feedback: '错误！如果斜面粗糙且物块静止，必须有沿斜面向上的力来平衡重力沿斜面向下的分力，否则物块无法保持静止。'
    },
    {
      id: 'normal-force-vertical',
      name: '支持力竖直向上',
      feedback: '错误！弹力（支持力）的方向必须垂直于接触面。'
    }
  ],

  // 分步引导步骤
  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '请点击场景中的物体，确定本次受力分析的研究对象。',
      action: 'click',
      target: 'block',
      reason: '选择正确。进行受力分析的第一步必须是明确研究对象。'
    },
    {
      id: 'judge-gravity',
      title: '第二步：分析场力（重力）',
      content: '首先考虑场力。凡是在地球附近的物体都会受到重力，重力方向如何？',
      options: [
        { text: '竖直向下', correct: true },
        { text: '垂直斜面向下', correct: false, mistakeId: 'normal-force-vertical' },
        { text: '沿斜面向下', correct: false, mistakeId: 'downward-sliding-force' }
      ],
      forceId: 'gravity'
    },
    {
      id: 'judge-contact',
      title: '第三步：分析接触力',
      content: '环绕研究对象一周，看它与周围哪些物体接触？',
      options: [
        { text: '仅与斜面接触', correct: true, reason: '正确。在目前的问题背景下，我们通常不计空气阻力或浮力。' },
        { text: '与斜面和空气接触', correct: false },
        { text: '无物体接触', correct: false }
      ]
    },
    {
      id: 'judge-normal-force',
      title: '第四步：判断弹力（支持力）',
      content: '接触面是否存在挤压？如果有，支持力的方向应该是？',
      options: [
        { text: '竖直向上', correct: false, mistakeId: 'normal-force-vertical' },
        { text: '垂直斜面向上', correct: true },
        { text: '沿斜面向上', correct: false }
      ],
      forceId: 'normal-force'
    },
    {
      id: 'judge-friction-exists',
      title: '第五步：判断摩擦力是否存在',
      content: '斜面是粗糙的，且物块有下滑趋势但保持静止。它是否受摩擦力？',
      options: [
        { text: '受静摩擦力', correct: true, reason: '正确。物体有相对运动趋势且接触面粗糙。' },
        { text: '不受摩擦力', correct: false, mistakeId: 'missing-friction' }
      ]
    },
    {
      id: 'judge-friction-direction',
      title: '第六步：判断摩擦力方向',
      content: '既然存在静摩擦力，它的方向应该是？',
      options: [
        { text: '沿斜面向下', correct: false, mistakeId: 'friction-wrong-direction' },
        { text: '沿斜面向上', correct: true },
        { text: '垂直斜面向上', correct: false }
      ],
      forceId: 'static-friction'
    },
    {
      id: 'judge-sliding-force',
      title: '第七步：检查是否遗漏或多画',
      content: '分析基本结束。物块有向下的运动趋势，是否还需要画出一个向下的“下滑力”？',
      options: [
        { text: '是', correct: false, mistakeId: 'downward-sliding-force' },
        { text: '否', correct: true, reason: '非常棒！下滑力是重力的分力，分析受力时不能重复画出。' }
      ]
    }
  ]
};
