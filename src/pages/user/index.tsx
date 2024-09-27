/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React from 'react';
import BaseComponent from '@src/components/BaseComponent';
import {  Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Account from "@src/pages/user/account";
import * as styles from './style.less';
import Role from "@src/pages/user/role";

const User: React.FC = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '账号管理',
      children: <Account />,
    },
    {
      key: '2',
      label: '角色管理',
      children: <Role />,
    }];
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <BaseComponent pageName={'用户管理'} showBreadcrumb={false} >
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} className={styles.tabs}/>
    </BaseComponent>
  );
};

export default User;
