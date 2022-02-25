import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui'

/** 
 * 提示函数 
 * 禁止点击蒙层、显示1.5秒后关闭
 */
const tip = msg => {
  Message({
    message: msg,
    type: 'error',
    duration: 1500
  })
}

/** 
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: '/login',
    // query: {
    //   redirect: router.currentRoute.fullPath
    // }
  });
}

/** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (Number(status)) {
    // 401: 未登录状态，跳转登录页
    case 401:
      // tip(other);
      setTimeout(() => {
        toLogin();
      }, 1510);
      break;
    // 1302 token过期
    // 清除token并跳转登录页
    case 1302:
      tip(other);
      localStorage.removeItem('token');
      localStorage.removeItem('member_id');
      localStorage.removeItem('nickname');
      localStorage.removeItem('abs_url');
      setTimeout(() => {
        toLogin();
      }, 1510);
    // 404请求不存在
    case 404:
      tip('请求的资源不存在');
      break;
    default:
      tip(other);
  }
}

// 创建axios实例
var instance = axios.create({ timeout: 1000 * 12 });

// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/** 
 * 请求拦截器 
 * 每次请求前，如果存在token则在请求头中携带token 
 */
instance.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况        
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token        
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码        
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。        
    const token = localStorage.getItem('token');
    // token 后台设置的 token 字段名
    token && (config.headers.token = token);
    // 临时需要往每个接口请求参数里添加参数 wap_terminal = 1
    if (config.data == '' || config.data == undefined || config.data == null) {
      let data = 'wap_terminal=1'
      config.data = data
    } else {
      let data = config.data + '&' + 'wap_terminal=1'
      config.data = data
    }
	
    return config;
  },
  error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  // 根据自己项目决定 是判断flag还是stateCode
  res => res.data.flag === 'success' ? Promise.resolve(res) : Promise.reject(
    res,
    // tip(res.data.message)
    errorHandle(res.data.data.errorCode, res.data.message)
  ),
  // res=>{
  	 //  if( res.data.flag === 'success'?){
  		//  return Promise.resolve(res)
  	 //  }
  	 //  else{
  		// return Promise.reject(res,errorHandle(res.data.data.errorCode, res.data.message))
  	 //  }
  	  
  // }
  // 请求失败
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围 
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit('changeNetwork', false);
    }
  });

export default instance