/**
 * 场景：可动斜面（光滑水平面）—— 分析物块
 * 高中物理经典"动斜面"模型
 * 斜面放在光滑水平地面上，物块放在斜面上，整体一起加速运动
 */
export const inclineMovableBlockScenario = {
  id: 'incline-movable-block',
  title: '可动斜面上的物块（分析物块）',
  description: '斜面置于光滑水平地面上，物块放于光滑斜面上，整体向左加速。分析物块受力情况。',
  
  physicsParams: {
    mass: 2.0,
    angle: 30,
    mu_s: 0.0, // 斜面光滑
    g: 9.8
  },

  motion: {
    direction: 'down-incline',
    label: 'a'
  },

  targetObject: {
    id: 'block',
    name: '物块',
    type: 'rectangle',
    dimensions: { width: 60, height: 40 }
  },

  correctForces: [
    {
      id: 'gravity',
      name: '重力',
      symbol: 'G',
      origin: '地球',
      target: '物块',
      direction: '竖直向下',
      reason: '由于地球的吸引而产生。'
    },
    {
      id: 'normal-force',
      name: '斜面的支持力',
      symbol: 'F_N',
      origin: '斜面',
      target: '物块',
      direction: '垂直斜面向上',
      reason: '物块挤压斜面，斜面对物块产生垂直于接触面向上的弹力。'
    }
  ],

  commonMistakes: [
    {
      id: 'friction-on-smooth',
      name: '画出摩擦力',
      feedback: '错误！题目已经说明斜面是光滑的，物块与斜面之间没有摩擦力。'
    },
    {
      id: 'down-incline-force',
      name: '画出下滑力',
      feedback: '错误！"下滑力"实际上是重力沿斜面的分力，不能与重力同时画出。物块加速是因为这两个力的合力不为零，并非存在第三个力。'
    }
  ],

  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '请点击场景中的物块，开始受力分析。',
      action: 'click',
      target: 'block',
      reason: '正确。我们分析的研究对象是物块。'
    },
    {
      id: 'judge-gravity',
      title: '第二步：分析场力（重力）',
      content: '重力方向是？',
      options: [
        { text: '竖直向下', correct: true },
        { text: '垂直斜面向下', correct: false },
        { text: '沿斜面向下', correct: false }
      ],
      forceId: 'gravity'
    },
    {
      id: 'judge-normal-force',
      title: '第三步：分析接触弹力',
      content: '物块与斜面接触有挤压，支持力方向是？',
      options: [
        { text: '竖直向上', correct: false },
        { text: '垂直斜面向上', correct: true }
      ],
      forceId: 'normal-force'
    },
    {
      id: 'judge-friction',
      title: '第四步：判断摩擦力',
      content: '斜面是光滑的（μ = 0），物块受摩擦力吗？',
      options: [
        { text: '受沿斜面向上的静摩擦力', correct: false, mistakeId: 'friction-on-smooth' },
        { text: '不受摩擦力', correct: true, reason: '正确！光滑斜面意味着无摩擦。' }
      ]
    },
    {
      id: 'judge-net-force',
      title: '第五步：分析合力方向',
      content: '物块只受重力（竖直向下）和支持力（垂直斜面向上）两个力，合力方向是？',
      options: [
        { text: '竖直向下', correct: false },
        { text: '水平向左（加速方向）', correct: true, reason: '完美！重力和支持力的合力恰好是水平向左的，这就是物块随斜面向左加速的原因。这是经典的"动斜面"分析结论。' },
        { text: '沿斜面向下', correct: false, mistakeId: 'down-incline-force' }
      ]
    }
  ]
};
