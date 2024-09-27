/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, { useState } from 'react';
import {  Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Study from "@src/pages/home/study";
import * as styles from './style.less';
import Overview from "@src/pages/home/overview";
import { checkUserAuth } from '@src/utils';

const Home: React.FC = () => {
  const [active, setActive] = useState('1');
  const items: TabsProps['items'] = [
    checkUserAuth('indexView', 1) && {
      key: '1',
      label: '学习中心',
      children:  active === '1' && <Study />,
    },
    checkUserAuth('indexView', 2) && {
      key: '2',
      label: '资源总览',
      children:  active === '2' && <Overview />,
    }];
  const onChange = (key: string) => {
    setActive(key);
  };
  return (
    <Tabs defaultActiveKey={active} items={items} onChange={onChange} className={styles.tabs}/>
  );
};

export default Home;
