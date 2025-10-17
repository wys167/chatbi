// Vue Router配置 - 设置嵌套路由和页面导航
import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import Chat from '../components/Chat.vue'

// 路由配置
const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/data-analysis', // 默认重定向到数据分析页面
    children: [
      {
        path: 'data-analysis',
        name: 'DataAnalysis',
        component: Chat,
        meta: {
          pageKey: 'dataAnalysis',
          title: '数据分析'
        }
      },
      {
        path: 'chart-generation',
        name: 'ChartGeneration',
        component: Chat,
        meta: {
          pageKey: 'chartGeneration',
          title: '图表生成'
        }
      },
      {
        path: 'report-generation',
        name: 'ReportGeneration',
        component: Chat,
        meta: {
          pageKey: 'reportGeneration',
          title: '报告生成'
        }
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 可以在这里添加权限验证等逻辑
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Chat BI`
  }
  next()
})

export default router