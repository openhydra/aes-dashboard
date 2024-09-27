###  AI 教培一体机   项目详细

## 环境依赖

- node: v16+

-- 目录结构

```
src/
    assets/ 静态资源
    components/ 组件
    config/
        apiService.conf.tsx 一个全局请求API
        assetsService.conf.tsx 服务器中静态资源的引入URL
        baseRoute.conf.tsx 基础路由content path
        view.tsx 路由整合
    fetchUtil/ 请求方式
    frame/ 全局存储变量
    i18n/ 多语言
    mock/ Mockjs数据
    pages/ 页面
    routers/ 路由
    services/ 服务（公共方法）
    storage/ localStorage处理
```

------------------------启动方式-------------------------

```
npm run dev
```

------------------------注释要求-------------------------

## 规范

1、注释符与注释内容之间加一个空格
2、注释行与上方代码间加一个空行

## HTML、JS 组件的文件顶部注释

/\*\*

- @AUTHOR: name
- @UPDATE: name (xxxx/xx/xx)
- @DESCRIPTION: 中文说明
  \*/

## Css 注释

- 块级注释统一用 /_xxx_/
  例:

/_以下为仪表盘资源工具的样式_/
.tool{
...
}

## 函数

/\*\*

- @func
- @todo 这个函数需要优化
- @desc 一个带参数的函数
- @param {string} a - 参数 a
- @param {*} a - 参数 a （*表示任何类型）
- @param {number} b=1 - 参数 b 默认值为 1
- @param {string} c=1 - 参数 c 有两种支持的取值</br>1—表示 x</br>2—表示 xx
- @param {object} d - 参数 d 为一个对象
- @param {string} d.e - 参数 d 的 e 属性
- @param {string} d.f - 参数 d 的 f 属性
- @param {object[]} g - 参数 g 为一个对象数组
- @param {string} g.h - 参数 g 数组中一项的 h 属性
- @param {string} g.i - 参数 g 数组中一项的 i 属性
- @param {string} [j] - 参数 j 是一个可选参数
- @param {myCallback} a - 参数 a 是一个回调函数
- @deprecated 已弃用
- @returns {boolean} 返回值为 true
  \*/

## 当前页变量｜全局变量 必须注释

- hooks 中
  // 当前选中的项目 ID
  const [departmentId,setDepartmentId] = userState(null)
- class 中
  const state = {
  appId: 'wx01d071fbf6dac44c', // 应用的唯一标识
  openId: null // 一个用户打开一个微信应用的唯一标识
  }
- 常量文件中
  /\*\*
- @global（全局）
- @var {object}
- @property {string} appId - 应用的唯一标识
- @property {string} openId - 一个用户打开一个微信应用的唯一标识
  \*/
  const state = {
  appId: 'wx01d071fbf6dac44c',
  openId: null
  }

/\*\*

- @constant {string}
- @default #000 （初始值）
- @readonly
  \*/
  var COLOR_RED = '#f00';

**注意: 涉及权限控制的逻辑处理，必须注释；涉及到过滤、遍历添加属性适当添加必要的业务注释**

-----------------------框架采用技术站-----------------------------

```
1、React
2、React-router-dom
3、Ant-Design
4、ES6
5、Hooks
```

## ---------------------------组件说明---------

该项目公用组件一览表详见：[组件说明](https://zhc3o5gmf9.feishu.cn/wiki/wikcnobBK5P5Xt63Qyhs1Ke9Noh "组件说明")，
新添加组件时请在此进行同步（[组件说明](https://zhc3o5gmf9.feishu.cn/wiki/wikcnobBK5P5Xt63Qyhs1Ke9Noh "组件说明")），若无编辑权限请联系管理员给予授权。

## docker 构建

```shell
# docker build
docker build -t aes-dashboard .
docker build --platform linux/amd64 -t aes-dashboard . 

# docker download
docker save aes-dashboard:latest | gzip > ~/Downloads/aes-dashboard.tar.gz
```
