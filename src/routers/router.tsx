/**
 * @AUTHOR zhy
 * @DATE zhy (2022/1/28)
 * @Description: 路由配置
 */

// HashRouter:有#号  ---暂时使用哈希模式，服务器设置了访问WEB-INF文件的权限
// BrowserRouter:没有#号  是在 Web 浏览器中运行 React Router 的推荐界面(官方推荐)
// Routes:只要匹配到一个地址不往下匹配，相当于for循环里面的break
// Link:跳转页面，相当于vue里面的router-link
// exact:完全匹配路由

import React from 'react';
import { useRoutes } from 'react-router-dom';
import {getNewRouterList} from './routerLists';
const RouterComponent = () => {

  const element = useRoutes(getNewRouterList());

  return (
    <div className="App" style={{ width: '100%', height: '100%' }}>
      {element}
    </div>
  );
};

export default RouterComponent;
