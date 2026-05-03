/**
 * 场景：竖直方向两物体连接
 */
export const connectedVerticalScenario = {
  id: 'connected-vertical',
  type: 'vertical-connected',
  title: '竖直方向两物体连接',
  description: '物体A在上方，B在下方，两者由轻绳连接。上方受外力F作用，整体竖直向上加速运动。',
  
  physicsParams: {
    massA: 2.0,
    massB: 3.0,
    forceF: 60.0,
    g: 9.8
  },

  targetObject: {
    id: 'blockB',
    name: '物块B',
    type: 'rectangle'
  },

  motion: {
    direction: 'up-vertical',
    label: 'a'
  },

  correctForces: [
    { id: 'gravity-B', name: '物块B重力', symbol: 'G_B', origin: '地球', target: '物块B', direction: '竖直向下', reason: '地球引力产生。' },
    { id: 'tension-up', name: '绳子向上拉力', symbol: 'T', origin: '轻绳', target: '物块B', direction: '竖直向上', reason: '轻绳对下方物体B产生向上的拉力。' }
  ],

  commonMistakes: [
    { id: 'tension-equals-gravity', name: '认为T等于G', feedback: '错误！整体向上加速，B受到的合力向上，因此 T > m_B * g。' },
    { id: 'missing-gravity', name: '漏画重力', feedback: '错误！地球上的物体始终受重力作用。' }
  ],

  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '我们将隔离下方的物体B来求轻绳张力T。请点击物块B。',
      action: 'click',
      target: 'blockB',
      reason: '隔离最边缘的物体往往最容易求解内部作用力。'
    },
    {
      id: 'judge-forces',
      title: '第二步：受力分析',
      content: '物块B在空中受到哪些力？',
      options: [
        { text: '重力、外力F和拉力T', correct: false, mistakeId: 'tension-equals-gravity' }, // Using arbitrary mistake ID for wrong logic
        { text: '仅受重力和向上的拉力T', correct: true, reason: '正确。外力F作用在A上，不直接作用在B上。B只受场力（重力）和接触力（拉力）。' }
      ]
    },
    {
      id: 'add-gravity',
      title: '标出重力',
      content: '请确认重力方向。',
      options: [{ text: '标出重力', correct: true }],
      forceId: 'gravity-B'
    },
    {
      id: 'add-tension',
      title: '标出张力',
      content: '请确认张力方向。',
      options: [{ text: '标出张力T', correct: true }],
      forceId: 'tension-up'
    },
    {
      id: 'judge-acceleration',
      title: '第三步：结合牛顿第二定律',
      content: '由于B向上加速，拉力T和重力的大小关系是？',
      options: [
        { text: 'T = m_B * g', correct: false, mistakeId: 'tension-equals-gravity' },
        { text: 'T > m_B * g', correct: true, reason: '正确！根据牛顿第二定律，T - m_B*g = m_B*a，即 T = m_B*(g+a)。处于超重状态。' }
      ]
    }
  ]
};
