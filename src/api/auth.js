/*
    该文件用于存放关于登录、鉴权等相关api
 */
import request from '../utils/request';

export const getExample = () => request({
  url: '/v1/example',
  method: 'GET',
  data: {},
});

export const postExample = (param) => request({
  url: '/v1/example',
  method: 'POST',
  data: param,
});
