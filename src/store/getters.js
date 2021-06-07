import { isString } from '@/utils/validate'

const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  mainBodyH: state => state.system.mainBodyH,
  mainBodyW: state => state.system.mainBodyW,
  // 指定接口是否正在请求中
  appointedInterface: state => (target) => {
    console.log(target, state.interfaces.interfacesUnderWay)
    // 参数支持字符串和数组两种类型
    let result = false
    if (isString(result)) {
      console.log(1)
      result = state.interfaces.interfacesUnderWay.find(value => value === target)
    } else {
      console.log(2)
      result = state.interfaces.interfacesUnderWay.find(value => target.indexOf(value) !== -1)
    }
    return result
  }
}
export default getters
