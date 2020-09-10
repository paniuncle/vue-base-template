# Vue-Base-Template

## 简介
Vue快速开发基础模板，含有Vue-Router、Vue-Cookies等常用库，并编写了
鉴权模块、路由配置、API配置文件。您可以仅关注自己的业务逻辑，无需自行设计
前端项目结构和相关配置。

## 项目结构

```$xslt
- api                      ---------------------- 项目API目录
  - auth.js                ---------------------------- 鉴权相关API
  - common.js              ---------------------------- 通用API
  - ......                 ---------------------------- 自定义业务API

- src                      ---------------------- 资源目录
  - assets                 ---------------------------- 静态资源目录
  - components             ---------------------------- 公用组件库
  - utils                  ---------------------------- 工具库
    - query.js             ---------------------------------- 解析URL参数库
    - request.js           ---------------------------------- 包装请求类库
    - signal.js            ---------------------------------- 签名库
  - pages                  ---------------------------- 页面目录
    - someModuel1          ---------------------------------- 模块1
      - components         ---------------------------------------- 模块1组件库
      - index.vue          ---------------------------------------- 模块1页面
    - someModule2
      - components
      - index.vue
    - ......
  - router                 ---------------------------------- 路由文件
    - index.js             ---------------------------------------- 默认路由文件
  - App.vue                ---------------------------------- 应用入口页面
  - main.js                ---------------------------------- 应用入口文件

- public
- tests 
```

## 路由信息

如果需要修改 `路由信息` 您可以到 `src/router/index.js` 进行修改。

```javascript
import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter);

// 您只需要修改本注释以下部分的内容即可
const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: null,
        },
    ],
});

// 注释结束

export default router;
```

有关于路由配置的内容摘自[Vue-Router官方网站](https://router.vuejs.org/zh/)
### 动态路由信息匹配
我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。
例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，
都要使用这个组件来渲染。那么，我们可以在 `vue-router`
的路由路径中使用“动态路径参数”(dynamic segment) 来达到这个效果：

```javascript
const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})
```

### 普通路由
```javascript
const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/test', component: User }
  ]
})
```

如果您需要学习更多有关于Vue-Router的知识，请到 [Vue-Router官方网站](https://router.vuejs.org/zh/)
进行学习。

## 鉴权配置
登录获得UserId和Token之后，这两个信息将会用于我们的接口的鉴权。在获得UserId和Token之前，需要进行登录或者注册才能获取对于的UserId和Token。
> 为了方便您的使用，我们已经将计算签名写到了 `src/utils/signal.js` 文件中，您只需要引入该文件，并调用即可。

### 鉴权值计算

本 API 主要通过将多个参数和时间戳混编成一个字符串，然后对这个字符串进行hmac-sha256计算得到Signature

#### 第 1 步 - 拼接字符串

第一步，设所有发送或者接收到的数据为集合M，将集合M内非空参数值的参数按照参数名ASCII码从小到大排序（字典序），使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串stringA。

**特别注意以下重要规则：**

- 参数名ASCII码从小到大排序（字典序）；

- 如果参数的值为空不参与签名；

- 参数名区分大小写；

- 验证调用返回或主动通知签名时，传送的sign参数不参与签名，将生成的签名与该sign值作校验。

- 接口可能增加字段，验证签名时必须支持增加的扩展字段

假设传送的参数如下：

```none
a： 123123
b： 10000100
c： 1000
d： test
```

对参数按照key=value的格式，并按照参数名ASCII字典序排序如下：

```none
StringA = "a=123123&b=10000100&c=1000&d=test";
```


#### 第 2 步 - 拼接Timestamp、UserId和Nonce

当上述的字符串拼接完毕之后，在字符串背后加上Timestamp、UserId和Nonce

```none
StringB = StringA + "&timestamp=" + timestamp + "&user_id=" + userid + "&nonce_str=" + nonce;

```

#### 第 3 步 - 计算Signature

```none
Signature = hash_hmac("sha256", StringB, Token);

```

#### 第 4 步 - 在请求中的Header添加到请求中

将前述计算中得到的Timestamp、UserId、Nonce和Signature添加到请求中的Header中

例如

```json hljs
PUT https://xxx.com/api/v1/users/1
Content-Type: application/json
X-User-Id: 13
X-Signature: xxxxxxxxxxxxxxx
X-Timestamp: 132434544564
X-Nonce: josjdoiaalkjdksf
{
  "id": 1,
  "name": "someone",
  "nickname": "小明",
  "photoUrls": "http://photocdn.sohu.com/20150811/mp26678520_1439257270139_10.jpeg",
  "status": "available"
}

```


## 封装请求配置
为了方便您的使用，我们已将 `axios` 进行封装。您只需要到 `src/utils/request.js` 文件中，
编写有关于错误处理相关的代码即可。

请您找到以下代码，按照注释提示的内容进行编写和修改即可。
```javascript
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
```


## API相关
由于我们对 `axios` 进行了进一步的封装，您在往后的请求中只需要调用 `src/utils/request.js`
库中的函数即可。由此，为了方便统一管理API，我们建议您将api文件放入到
`api` 目录中。其中 `src/api/auth.js` 文件中，建议您存放有关于用户登录注册和鉴权相关的内容。
`src/api/common.js` 文件中推荐您存放一些公共API，例如获取用户信息等内容。而其他业务，您可以在
该目录下创建更多的文件来存放。关于API的写法，您可以参照项目文件中，或者以下代码进行参考。

```javascript
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
```

调用API的时候，建议您使用以下的书写方法

```javascript
// 写法1
async someFunction() {
    let res = await somePostFunction();
}

// 写法2

someFunction() {
    someFunction().then( (res)=> {
    
    } )
    .catch( (error)=> {
    
    } )
}
```
