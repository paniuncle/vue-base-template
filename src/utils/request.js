/* eslint-disable */
import axios from 'axios';
import vueAxios from 'vue-axios';
import VueCookies from 'vue-cookies';
import Vue from 'vue';

import conf from '../../config.base';
import signal from './signal';

Vue.use(vueAxios, axios);
Vue.use(VueCookies);

const userId = this.$cookies.get('user_id');
const token = this.$cookies.get('token');
let instance = null;

// 添加请求头
if (userId === undefined || token === undefined) {
  instance = axios.create({
    headers: { 'content-type': 'application/json' },
  });
} else {
  instance = axios.create({
    headers: {
      'content-type': 'application/json',
      'X-User-Id': userId,
      'X-Token': token,
      'X-Timestamp': '',
      'X-Nonce': '',
      'X-Signature': '',
    },
  });
}

if (conf.DEBUG) {
  instance.defaults.baseURL = conf.debugURL;
} else {
  instance.defaults.baseURL = conf.baseURL;
}

instance.defaults.withCredentials = true;

// 请求拦截器
instance.interceptors.request.use((config) => {
  const signalDict = signal(config.params, userId, token);
  // eslint-disable-next-line no-param-reassign
  config.headers['X-Timestamp'] = signalDict.timestamp;
  // eslint-disable-next-line no-param-reassign
  config.headers['X-Nonce'] = signalDict.nonce_str;
  // eslint-disable-next-line no-param-reassign
  config.headers['X-Signature'] = signalDict.signature;

  return config;
}, (error) => Promise.reject(error));

// 响应拦截器
instance.interceptors.response.use((response) => {
  // 同意处理非正确的请求
  if (response.status === 200) {
    if (response.data.code === 0) {
      return response.data;
    }
    // 这里建议直接弹窗 告诉请求错误是什么
  } else if (response.status === 401) {
    // 鉴权失败做什么处理
  } else if (response.status === 500) {
    // 服务器内部错误做什么处理
  } else {
    // 其他未知错误做什么处理
  }
}, (error) => {
  if (error && error.response) {
    if (error.response.status === 400) {
      // 400 错误干些什么
    } else if (error.response.status === 500) {
      // 500 错误干些什么
    } else {
      // 其他未知错误
    }
  }
  return Promise.reject(error);
});

export default instance;
