/**
 * 场景：静止物块压在粗糙斜面上（分析斜面）
 */
export const inclinePlaneScenario = {
  id: 'incline-plane-static',
  title: '粗糙斜面上的静止物块（分析斜面）',
  description: '一个物块静止在倾角为 θ 的粗糙斜面上，分析斜面的受力情况。',
  
  // 物理参数
  physicsParams: {
    mass: 2.0, // kg
    angle: 30, // degrees (θ)
    mu_s: 0.6, // 静摩擦因数 (μs)
    g: 9.8    // 重力加速度 (m/s²)
  },

  // 研究对象
  targetObject: {
    id: 'incline',
    name: '斜面',
    type: 'polygon'
  },

  // 正确的受力列表
  correctForces: [
    {
      id: 'incline-gravity',
      name: '斜面重力',
      symbol: 'G',
      origin: '地球',
      target: '斜面',
      direction: '竖直向下',
      reason: '由于地球的吸引而产生，任何在地球表面的物体都受重力。'
    },
    {
      id: 'ground-normal',
      name: '地面的支持力',
      symbol: 'F_N地',
      origin: '地面',
      target: '斜面',
      direction: '竖直向上',
      reason: '斜面挤压地面，地面发生微小弹性形变，对斜面产生垂直于地面的向上的力。'
    },
    {
      id: 'block-pressure',
      name: '物块的压力',
      symbol: 'F_N物',
      origin: '物块',
      target: '斜面',
      direction: '垂直斜面向下',
      reason: '物块挤压斜面，这是斜面对物块支持力的反作用力。'
    },
    {
      id: 'block-friction',
      name: '物块的静摩擦力',
      symbol: 'f_s物',
      origin: '物块',
      target: '斜面',
      direction: '沿斜面向下',
      reason: '物块有下滑趋势，斜面对物块有沿斜面向上的静摩擦力，根据牛顿第三定律，物块对斜面有沿斜面向下的静摩擦力。'
    }
  ],

  // 常见错误列表
  commonMistakes: [
    {
      id: 'ground-friction',
      name: '地面的摩擦力',
      feedback: '错误！我们可以用整体法来判断：将物块和斜面看作一个整体，整体在水平方向上不受任何外力，因此地面对斜面没有摩擦力。'
    },
    {
      id: 'friction-wrong-direction',
      name: '物块对斜面摩擦力方向画反',
      feedback: '错误！斜面对物块的摩擦力是沿斜面向上的，根据牛顿第三定律，物块对斜面的摩擦力应该沿斜面向下。'
    },
    {
      id: 'missing-pressure',
      name: '漏画压力',
      feedback: '错误！物块静止在斜面上，必然对斜面产生垂直于斜面向下的挤压弹力（压力）。'
    }
  ],

  // 分步引导步骤
  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '请点击场景中的物体，确定本次受力分析的研究对象（请点击斜面）。',
      action: 'click',
      target: 'incline',
      reason: '选择正确。我们现在的研究对象是斜面。'
    },
    {
      id: 'judge-gravity',
      title: '第二步：分析场力（重力）',
      content: '首先考虑场力。凡是在地球附近的物体都会受到重力，斜面的重力方向如何？',
      options: [
        { text: '竖直向下', correct: true },
        { text: '垂直斜面向下', correct: false },
        { text: '沿斜面向下', correct: false }
      ],
      forceId: 'incline-gravity'
    },
    {
      id: 'judge-contact',
      title: '第三步：分析接触力',
      content: '环绕斜面一周，看它与周围哪些物体接触？',
      options: [
        { text: '仅与地面接触', correct: false },
        { text: '与物块和地面接触', correct: true, reason: '正确。斜面与上方的物块以及下方的地面都有接触。' },
        { text: '仅与物块接触', correct: false }
      ]
    },
    {
      id: 'judge-ground-normal',
      title: '第四步：判断地面的弹力（支持力）',
      content: '斜面与地面接触并有挤压，地面对斜面的支持力方向应该是？',
      options: [
        { text: '竖直向上', correct: true },
        { text: '垂直斜面向上', correct: false },
        { text: '没有支持力', correct: false }
      ],
      forceId: 'ground-normal'
    },
    {
      id: 'judge-block-pressure',
      title: '第五步：判断物块的弹力（压力）',
      content: '斜面与物块接触并有挤压，物块对斜面的压力方向应该是？',
      options: [
        { text: '竖直向下', correct: false },
        { text: '垂直斜面向下', correct: true },
        { text: '沿斜面向下', correct: false }
      ],
      forceId: 'block-pressure'
    },
    {
      id: 'judge-block-friction',
      title: '第六步：判断物块的摩擦力',
      content: '斜面是粗糙的，物块对斜面是否有摩擦力？方向是？',
      options: [
        { text: '无摩擦力', correct: false },
        { text: '沿斜面向上', correct: false, mistakeId: 'friction-wrong-direction' },
        { text: '沿斜面向下', correct: true, reason: '正确。斜面对物块的摩擦力沿斜面向上，根据作用力与反作用力，物块对斜面的摩擦力沿斜面向下。' }
      ],
      forceId: 'block-friction'
    },
    {
      id: 'judge-ground-friction',
      title: '第七步：判断地面的摩擦力',
      content: '最后，地面对斜面是否有摩擦力？',
      options: [
        { text: '有向左的摩擦力', correct: false, mistakeId: 'ground-friction' },
        { text: '有向右的摩擦力', correct: false, mistakeId: 'ground-friction' },
        { text: '没有摩擦力', correct: true, reason: '非常棒！使用整体法分析，物块和斜面整体在水平方向没有外力，所以地面对斜面没有摩擦力。' }
      ]
    }
  ]
};
