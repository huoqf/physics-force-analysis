/**
 * 场景：斜面上的轻绳连接模型
 */
export const connectedInclineHangingScenario = {
  id: 'connected-incline-hanging',
  type: 'incline-connected',
  title: '斜面上的轻绳连接模型',
  description: '物体A在光滑斜面上，物体B悬挂。两者由绕过斜面顶端滑轮的轻绳连接。若悬挂物B较重，B向下加速，A沿斜面向上加速。',
  
  physicsParams: {
    massA: 2.0,
    massB: 4.0,
    angle: 30, // 斜面倾角
    g: 9.8
  },

  targetObject: {
    id: 'blockA', // 这里我们研究斜面上的物体A
    name: '物块A(斜面)',
    type: 'rectangle'
  },

  motion: {
    direction: 'up-incline',
    label: 'a'
  },

  correctForces: [
    { id: 'gravity', name: '物块A重力', symbol: 'G_A', origin: '地球', target: '物块A', direction: '竖直向下', reason: '地球引力产生。' },
    { id: 'normal-force', name: '斜面支持力', symbol: 'F_N', origin: '斜面', target: '物块A', direction: '垂直斜面向上', reason: '斜面对A的支持力。' },
    { id: 'static-friction', name: '绳子拉力', symbol: 'T', origin: '轻绳', target: '物块A', direction: '沿斜面向上', reason: '轻绳对A产生沿斜面向上的拉力。' } // 为了复用ForceCanvas里的箭头逻辑，借用static-friction绘制沿斜面向上的力，或者增加专门的力类型
  ],

  commonMistakes: [
    { id: 'gravity-error', name: '直接比较质量判断方向', feedback: '错误！斜面上的物体A下滑的阻力是 m_A*g*sinθ，而不是 m_A*g。必须比较 m_B*g 和 m_A*g*sinθ。' }
  ],

  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '请点击斜面上的物体A作为研究对象。',
      action: 'click',
      target: 'blockA',
      reason: '隔离A，分析斜面上的受力。'
    },
    {
      id: 'add-gravity',
      title: '第二步：受力分析',
      content: '物体A受到哪些力？',
      options: [
        { text: '仅受重力和支持力', correct: false },
        { text: '受重力、支持力和沿斜面向上的绳子拉力', correct: true, reason: '正确。' }
      ]
    },
    {
      id: 'force-g',
      title: '标出重力',
      content: '标出重力',
      options: [{ text: '标出重力', correct: true }],
      forceId: 'gravity'
    },
    {
      id: 'force-n',
      title: '标出支持力',
      content: '标出支持力',
      options: [{ text: '标出支持力', correct: true }],
      forceId: 'normal-force'
    },
    {
      id: 'force-t',
      title: '标出拉力',
      content: '标出拉力',
      options: [{ text: '标出拉力', correct: true }],
      forceId: 'static-friction' // 利用这个ID来绘制沿斜面向上的力
    },
    {
      id: 'judge-accel',
      title: '第三步：运动学分析',
      content: '判断A的加速度方向',
      options: [
        { text: '一定沿斜面向上', correct: false, mistakeId: 'gravity-error' },
        { text: '取决于 m_B 和 m_A*sinθ 的大小', correct: true, reason: '非常棒！因为本模型中 m_B = 4kg，m_A*sin30° = 1kg，所以 m_B*g > m_A*g*sinθ，A必定向上加速。' }
      ]
    }
  ]
};
