import React, { useReducer } from 'react';
import { createRoot} from "react-dom/client";
import {ConfigProvider, App} from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { RootContext } from '@src/frame/rootContext';
import RouterComponent from '@src/routers/router';
import '@src/assets/css/global.less';
import './i18n/i18n';
import { rootInitReduce, rootInitState } from '@src/frame/getNewReducer';
import zhCN from "antd/locale/zh_CN";
// import enUS from "antd/locale/en_US";

const Root = () => {
  // 全局state的配置
  const [state, dispatch] = useReducer(rootInitReduce, rootInitState());

  return (
    /* 采用严格模式 */
    // eslint-disable-next-line react/jsx-filename-extension
    // <React.StrictMode>
    <RootContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token，影响范围大
              colorPrimary: '#5B46F6',
              // colorPrimary: '#193BE3',
              colorError: '#e72325',
              // borderRadius: 2,

              // 派生变量，影响范围小
              // colorBgContainer: '#f6ffed',
            },
          }}
          locale={zhCN}>
          <App>
            <RouterComponent />
          </App>
        </ConfigProvider>
      </BrowserRouter>
    </RootContext.Provider>
    // </React.StrictMode>
  );
};
const rootDom  = createRoot(document.getElementById('root'))
rootDom.render(<Root />);
