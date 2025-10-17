// 全局配置文件
// 在这里配置 userid 和 appid

// 默认配置
const DEFAULT_CONFIG = {
  // 用户ID - 可以在这里修改默认用户ID
  userId: 'user',
  
  // 应用ID/Token - 可以在这里修改默认应用Token
  appId: 'Bearer app-HCDo84avfUjmuc1mtsUeEclx',
  
  // 停止消息时使用的用户ID
  //stopUserId: 'default_user',
  
  // 停止消息时使用的任务ID
  //stopTaskId: 'default_task'
}

// 当前配置（可以动态修改）
let currentConfig = { ...DEFAULT_CONFIG }

// 全局配置管理器
export const GlobalConfig = {
  // 获取当前配置
  getConfig() {
    return { ...currentConfig }
  },

  // 获取用户ID
  getUserId() {
    return currentConfig.userId
  },

  // 获取应用ID/Token
  getAppId() {
    return currentConfig.appId
  },

  // 获取停止消息用户ID
  getStopUserId() {
    return currentConfig.stopUserId
  },

  // 获取停止任务ID
  getStopTaskId() {
    return currentConfig.stopTaskId
  },

  // 设置用户ID
  setUserId(userId) {
    currentConfig.userId = userId
  },

  // 设置应用ID/Token
  setAppId(appId) {
    currentConfig.appId = appId
  },

  // 设置停止消息用户ID
  setStopUserId(stopUserId) {
    currentConfig.stopUserId = stopUserId
  },

  // 设置停止任务ID
  setStopTaskId(stopTaskId) {
    currentConfig.stopTaskId = stopTaskId
  },

  // 批量更新配置
  updateConfig(newConfig) {
    currentConfig = { ...currentConfig, ...newConfig }
  },

  // 重置为默认配置
  resetToDefault() {
    currentConfig = { ...DEFAULT_CONFIG }
  }
}

// 导出默认配置供参考
export { DEFAULT_CONFIG }

// 默认导出配置管理器
export default GlobalConfig