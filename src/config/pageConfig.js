// 页面配置管理 - 集中管理不同页面的快捷问题和API Token

// API Token配置 - 不同页面使用不同的Token
export const API_TOKENS = {
  // 数据分析页面
  dataAnalysis: 'Bearer app-TWPKrkFsahIoaxT3Z3JozDZ7',
  // 图表生成页面
  chartGeneration: 'Bearer app-upQgqetiw4q7jlW75v5KaZvT',
  // 报告生成页面
  reportGeneration: 'Bearer app-UlO7cZvhKHtD8h63lGyciVGJ'
}

// 快捷问题配置 - 不同页面显示不同的快捷问题
export const QUICK_QUESTIONS = {
  // 数据分析页面的快捷问题
  dataAnalysis: [
    { id: 1, content: '本月经营状况如何' },
    { id: 2, content: '商品库存状况如何' },
    { id: 3, content: '同比增长分析' },
    { id: 4, content: '门店净利润' },
    { id: 5, content: '当月移动收款统计' },
    { id: 6, content: '最近生意怎么样' },
    { id: 7, content: '有多少会员' },
    { id: 8, content: '会员购买排名' }
  ],
  
  // 图表生成页面的快捷问题
  chartGeneration: [
    /* { id: 1, content: '生成一个饼图显示产品分类占比' },
    { id: 2, content: '创建柱状图展示月度收入' },
    { id: 3, content: '制作折线图显示增长趋势' },
    { id: 4, content: '生成散点图分析相关性' },
    { id: 5, content: '创建雷达图对比多维数据' },
    { id: 6, content: '制作热力图显示数据分布' },
    { id: 7, content: '生成漏斗图展示转化流程' },
    { id: 8, content: '创建仪表盘显示KPI指标' },
    { id: 9, content: '制作堆叠柱状图对比数据' } */
  ],
  
  // 报告生成页面的快捷问题
  reportGeneration: [
    /* { id: 1, content: '生成月度销售报告' },
    { id: 2, content: '创建用户行为分析报告' },
    { id: 3, content: '制作财务分析报告' },
    { id: 4, content: '生成市场调研报告' },
    { id: 5, content: '创建产品性能报告' },
    { id: 6, content: '制作竞争对手分析报告' },
    { id: 7, content: '生成客户满意度报告' },
    { id: 8, content: '创建运营数据报告' },
    { id: 9, content: '制作年度总结报告' } */
  ]
}

// 页面配置信息 - 包含页面标题、路由等信息
export const PAGE_CONFIG = {
  dataAnalysis: {
    title: '数据分析',
    path: '/data-analysis',
    icon: '📊',
    description: '智能数据分析与洞察'
  },
  chartGeneration: {
    title: '顾客会员',
    path: '/chart-generation',
    icon: '📈',
    description: ''
  },
  reportGeneration: {
    title: '销售订单',
    path: '/report-generation',
    icon: '📋',
    description: ''
  }
}

// 获取指定页面的API Token
export const getApiToken = (pageKey) => {
  return API_TOKENS[pageKey] || API_TOKENS.dataAnalysis
}

// 获取指定页面的快捷问题
export const getQuickQuestions = (pageKey) => {
  return QUICK_QUESTIONS[pageKey] || QUICK_QUESTIONS.dataAnalysis
}

// 获取指定页面的配置信息
export const getPageConfig = (pageKey) => {
  return PAGE_CONFIG[pageKey] || PAGE_CONFIG.dataAnalysis
}

// 获取所有页面配置（用于导航菜单）
export const getAllPageConfigs = () => {
  return Object.keys(PAGE_CONFIG).map(key => ({
    key,
    ...PAGE_CONFIG[key]
  }))
}