/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React from 'react';
import BaseComponent from '@src/components/BaseComponent';
import {  Tabs } from 'antd';
import type { TabsProps } from 'antd';
// import CourseManage from "@src/pages/teacher/course/courseManage";
import * as styles from './style.less';
import Resource from "@src/pages/teacher/course/resource";

const Course: React.FC = () => {
  const items: TabsProps['items'] = [
    // {
    //   key: '1',
    //   label: '课程管理',
    //   children: <CourseManage />,
    // },
    {
      key: '2',
      label: '课程资源管理',
      children: <Resource />,
    }];
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    // 教学课程管理
    <BaseComponent pageName={'课程'} showBreadcrumb={false} >
      <Tabs defaultActiveKey="2" items={items} onChange={onChange} className={styles.tabs}/>
    </BaseComponent>
  );
};

export default Course;
