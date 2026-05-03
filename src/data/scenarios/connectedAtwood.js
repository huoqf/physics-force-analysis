/**
 * 场景：阿特伍德机
 */
export const connectedAtwoodScenario = {
  id: 'connected-atwood',
  type: 'atwood-machine',
  title: '阿特伍德机 (滑轮悬挂)',
  description: '质量分别为m1和m2的两个物体挂在轻绳两端，绳绕过光滑定滑轮。若 m2 > m1，m2 将向下加速，m1 将向上加速。',
  
  physicsParams: {
    massA: 1.0, // 左侧轻
    massB: 3.0, // 右侧重
    g: 9.8
  },

  targetObject: {
    id: 'blockB', // 右侧重的物体
    name: '物块B(重)',
    type: 'rectangle'
  },

  motion: {
    direction: 'down-vertical',
    label: 'a'
  },

  correctForces: [
    { id: 'gravity-B', name: '物块B重力', symbol: 'm_2 g', origin: '地球', target: '物块B', direction: '竖直向下', reason: '地球引力产生。' },
    { id: 'tension-up', name: '绳子拉力', symbol: 'T', origin: '轻绳', target: '物块B', direction: '竖直向上', reason: '定滑轮改变了力的方向，绳对B的拉力向上。' }
  ],

  commonMistakes: [
    { id: 'tension-error', name: '拉力判断错误', feedback: '错误！张力并不等于较轻物体的重力，也不等于较重物体的重力。它使轻物体向上加速，同时阻碍重物体向下坠落。' }
  ],

  steps: [
    {
      id: 'select-object',
      title: '第一步：选择研究对象',
      content: '请点击右侧较重的物块B作为研究对象。',
      action: 'click',
      target: 'blockB',
      reason: '隔离重物体分析。'
    },
    {
      id: 'add-gravity',
      title: '第二步：受力分析',
      content: '隔离B后，它在竖直方向受哪些力？',
      options: [
        { text: '仅受重力', correct: false },
        { text: '受重力和绳子的拉力', correct: true, reason: '正确！' }
      ]
    },
    {
      id: 'force-g',
      title: '标出重力',
      content: '标出重力',
      options: [{ text: '标出向下重力', correct: true }],
      forceId: 'gravity-B'
    },
    {
      id: 'force-t',
      title: '标出拉力',
      content: '标出拉力',
      options: [{ text: '标出向上拉力', correct: true }],
      forceId: 'tension-up'
    },
    {
      id: 'judge-tension',
      title: '第三步：体会阿特伍德机的张力',
      content: '关于阿特伍德机中同一根绳的张力T，以下说法正确的是？',
      options: [
        { text: 'T = m_1 * g', correct: false, mistakeId: 'tension-error' },
        { text: 'm_1*g < T < m_2*g', correct: true, reason: '非常正确！对m_1: T - m_1*g = m_1*a (向上加速, T>m_1*g)；对m_2: m_2*g - T = m_2*a (向下加速, T<m_2*g)。张力介于两者重力之间。' }
      ]
    }
  ]
};
