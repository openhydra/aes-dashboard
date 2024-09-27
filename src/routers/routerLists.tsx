import LayoutComponent from '@src/components/LayoutComponent/LayoutComponent';
import { Spin } from 'antd';
import React, { lazy, Suspense } from 'react';
import AuthRoute from './private';
import * as _ from 'lodash-es';
import DeviceSVG from '@src/assets/images/menu/device.svg';
import HomeSVG from '@src/assets/images/menu/home.svg';
import ToolSVG from '@src/assets/images/menu/tool.svg';
import TeacherSVG from '@src/assets/images/menu/teacher.svg';
import UserSVG from '@src/assets/images/menu/user.svg';
import LoadingImg from '@src/assets/images/static/Loading.gif';
import { checkUserAuth } from '@src/utils';

function LazyWrapper(path: string) {
  const Component = lazy(() => import(`@src/pages/${path}`));
  return (
    <Suspense
      fallback={
        <Spin
          indicator={<img src={LoadingImg} style={{transform: 'scale(1.3)'}} />}
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems:'center'
          }}
        />
      }
    >
      <AuthRoute component={<Component />} path={path} />
    </Suspense>
  );
}
const sourceRouterLists: any = [
  {
    path: '/login',
    key: 'login',
    element: LazyWrapper('login'),
    rule: true
  },
  {
    path: '/assistant',
    key: 'rag',
    element: LazyWrapper('tool/assistant'),
    rule: () => checkUserAuth('rag', 2)
  },
  {
    path: '/assistant/knowledgeDetail/:kb_id',
    key: 'knowledgeDetail',
    element: LazyWrapper('tool/assistant/knowledge/detail'),
    rule: () => checkUserAuth('rag', 2)
  },
  {
    path: '/',
    element: <LayoutComponent />,
    children: [
      {
        label: '主页',
        path: '/',
        key: 'indexView',
        element: LazyWrapper('home'),
        icon: <HomeSVG style={{transform: 'scale(1.4)'}}/>,
        rule: () => checkUserAuth('indexView', 1) || checkUserAuth('indexView', 2),
      },
      {
        label: '学习工具',
        icon: <ToolSVG style={{transform: 'scale(1.4)'}}/>,
        key: 'tool',
        rule: () => checkUserAuth('course', 2) || checkUserAuth('rag', 2) || checkUserAuth('deviceStudentView', 1),
        items:[
          {
            label: '课程',
            path: '/course',
            key: 'course',
            element: LazyWrapper('tool/class'),
            rule: () => checkUserAuth('course', 2),
            items:[
              {
                path: '/classDetail/:name/:imgIndex',
                key: 'classDetail',
                element: LazyWrapper('tool/class/classDetail'),
                rule: () => checkUserAuth('course', 2),
              }
            ]
          },
          {
            label: '实验环境',
            path: '/environment',
            key: 'deviceStudentView',
            element: LazyWrapper('tool/environment'),
            rule: () => checkUserAuth('deviceStudentView', 1)
          },
          {
            label: '虚拟助教',
            path: '/assistant',
            key: 'rag',
            rule: () => checkUserAuth('rag', 2)
          },
        ]
      },
      {
        label: '教学管理',
        icon: <TeacherSVG style={{transform: 'scale(1.4)'}}/>,
        key: 'teacher',
        rule: () => checkUserAuth('dataset', 2),
        items:[
          // {
          //   label: '教学课程管理',
          //   path: '/course',
          //   key: 'course',
          //   element: LazyWrapper('teacher/course'),
          //   rule: '',
          // },
          // {
          //   label: '作业管理',
          //   path: '/job',
          //   key: 'job',
          //   element: LazyWrapper('teacher/job'),
          //   rule: '',
          // },
          {
            label: '数据集管理',
            path: '/data',
            key: 'dataset',
            element: LazyWrapper('teacher/data'),
            rule: () => checkUserAuth('dataset', 2)
          },
        ]
      },
      {
        label: '用户管理',
        key: 'userManage',
        icon: <UserSVG style={{transform: 'scale(1.5)'}}/>,
        rule: () => checkUserAuth('user', 2) ||checkUserAuth('role', 2)||checkUserAuth('group', 2),
        items:[
          {
            label: '账号管理',
            path: '/account',
            key: 'user',
            element: LazyWrapper('user/account'),
            rule: () => checkUserAuth('user', 2),
          },
          {
            label: '角色管理',
            path: '/role',
            key: 'role',
            element: LazyWrapper('user/role'),
            rule: () => checkUserAuth('role', 2),
            items:[
              {
                label: '角色详情',
                path: '/roleDetail',
                key: 'roleDetail',
                element: LazyWrapper('user/role/detail'),
                rule: () => checkUserAuth('role', 2),
              }
            ]
          },
          {
            label: '班级管理',
            path: '/group',
            key: 'group',
            element: LazyWrapper('user/group'),
            rule: () => checkUserAuth('group', 2),
            items:[
              {
                path: '/groupDetail/:name',
                key: 'groupDetail',
                element: LazyWrapper('user/group/detail'),
                rule: () => checkUserAuth('group', 2),
              }
            ]
          }
        ]
      },
      {
        label: '设备资源管理',
        icon: <DeviceSVG style={{transform: 'scale(1.2)'}}/>,
        key: 'deviceResource',
        rule: () => checkUserAuth('device', 2) || checkUserAuth('setting', 2),
        items:[
          {
            label: '设备管理',
            path: '/device',
            key: 'device',
            element: LazyWrapper('device/device'),
            rule: () => checkUserAuth('device', 2),
          },
          {
            label: '平台配置',
            path: '/setting',
            key: 'setting',
            element: LazyWrapper('device/setting'),
            rule: () => checkUserAuth('setting', 2)
          },
        ]
      }
    ]
  },
  {
    path: '*',
    key: '*',
    element: LazyWrapper('notFound/404'),
    label: '404'
  }
];


/**
 * @desc 修改route框架结构,原来items下面内容，包含element的
 * @param {Object} sourceData routerLists下面每一项的children
 * @param {number} key 层级/面包屑的下标
 * @return {Array} result children的结果内容 = items下面包含element的项集合
 * */
let breadcrumbItem: any[] = [];
const changeStructure = (sourceData, key) => {
  let result: any[] = [];
  sourceData.forEach((item) => {
      // 设置层级的面包屑
      breadcrumbItem[key] = item?.element
        ? {
          label: item.label,
          path: item?.path,
          key: item?.key,
          subKey: item?.subKey
        }
        : {
          label: item.label,
          key: item?.key,
          role: item?.role,
          subKey: item?.subKey
        };
      // 遍历的层级大于当前面包屑，砍去多余
      if (breadcrumbItem.length > key) {
        breadcrumbItem = breadcrumbItem.splice(0, key + 1);
      }
      // 有items 进行递归
      if (item.items && item.items.length > 0) {
        // 有element 也需要存放结果，并将当前的items删掉
        if (item.element) {
          item.breadcrumbItem = _.cloneDeep(breadcrumbItem);
          result.push(item);
          result = result.concat(changeStructure(item.items, key + 1));
          delete item.items;
        } else {
          result = result.concat(changeStructure(item.items, key + 1));
        }
      } else if (item.children && item.children.length > 0) {
        item?.children?.forEach((childrenItem) => {
          let content: any = {};
          if (childrenItem.path.length > 0) {
            content = childrenItem;
          } else {
            let cloneDeepItem = _.cloneDeep(item);
            delete cloneDeepItem.children;
            cloneDeepItem.element = childrenItem.element;
            content = cloneDeepItem;
          }

          let json = {
            ...content,
            path: childrenItem.path.length > 0 ? item.path + '/' + childrenItem.path : item.path
          };
          let ary = _.cloneDeep(breadcrumbItem);
          if (childrenItem.path.length > 0) {
            ary.push({
              label: childrenItem.label,
              path: json.path
            });
          }
          json.breadcrumbItem = ary;
          // 将当前面包屑塞入结果数据中
          result.push(json);
        });
        delete item.children;
      } else {
        // 将当前面包屑塞入结果数据中
        item.breadcrumbItem = _.cloneDeep(breadcrumbItem);
        result.push(item);
      }

  });
  return result;
};

/**
 * @desc 将原router改成框架所识别的结构
 * */
const getNewRouterList = () => {
  let tree = _.cloneDeep(sourceRouterLists);
  tree.map((module) => {
    module?.children && (module.children = changeStructure(module?.children, 0));
  });
  return tree;
};

// export default getNewRouterList();

export { sourceRouterLists, getNewRouterList };
