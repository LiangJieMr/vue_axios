/**
 * Created by superman on 17/2/16.
 * http配置
 */

import axios from 'axios'
import store from './store/store'
import * as types from './store/types'
import router from './router'
import qs from 'qs'

// axios 配置
axios.defaults.timeout = 5000
axios.defaults.baseURL = 'https://cnodejs.org/api/v1'
axios.defaults.headers = {
  // 'X-Requested-With': 'XMLHttpRequest',
	"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
};

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // if (store.state.token) {
    //   config.headers.Authorization = `token ${store.state.token}`
    // }
    return config
  },
  err => {
    return Promise.reject(err)
  },
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          store.commit(types.LOGOUT)
          
          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.path !== 'login' &&
            router.replace({
              path: 'login',
              query: { redirect: router.currentRoute.path },
            })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  },
)

// export default axios;
export default {
  post (url, data) {
    return axios({
      method: 'post',
      baseURL: 'https://cnodejs.org/api/v1',
      url,
      data: qs.stringify(data),
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get (url, params) {
    return axios({
      method: 'get',
      baseURL: 'https://cnodejs.org/api/v1',
      url,
      params, // get 请求时带的参数
    }).then(
      (response) => {
        return response
      }
    ).then(
      (res) => {
        return res
      }
    )
  }
}
