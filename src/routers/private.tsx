/**
 * @AUTHOR zhy
 * @DATE zhy (2022/1/28)
 * @Description: 路由jie
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import stateStorage from '@src/storage/stateStorage';

interface Props {
  component: any;
  path: string;
}
function AuthRoute(props: Props) {
  // return props.component;
  const isLogin = Boolean(stateStorage.get('token'));
  if (isLogin) {
    return props.component;
  } else {
    if (props.path === 'login') {
      return props.component;
    } else {
      return <Navigate to={'/login'} />;
    }
  }
}
export default AuthRoute;
