/**
 * Author: lx
 * Date: 2022-07-28
 * Description: 基础组件类
 *
 */
import React, { useEffect, useState } from 'react';
import LayoutBreadcrumb from '../LayoutBreadcrumb/LayoutBreadcrumb';
import * as styles from './style.less';
import { ArrowLeftOutlined } from '@src/utils/antdIcon';
import { Content } from 'antd/lib/layout/layout';
import { useLocation } from 'react-router-dom';
import stateStorage from '@src/storage/stateStorage';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// antd组件国际化翻译
import enUSIntl from 'antd/es/locale/en_US';
import zhCNIntl from 'antd/es/locale/zh_CN';
import zhTWIntl from 'antd/es/locale/zh_TW';
import { ConfigProvider } from 'antd';
import {getNewRouterList} from '@src/routers/routerLists';

// 国际化语言list
const intlMap = {
  zhCNIntl,
  znENIntl: enUSIntl,
  zhTWIntl
};

const BaseComponent = (props: {
  pageName?: string; // 页面名称
  description?: any; // 描述
  goBack?: boolean; // 是否显示返回上一页按钮
  buttonList?: JSX.Element; // 编辑/取消/保存等操作按钮的slot
  showBreadcrumb?: boolean; // 是否显示整个面包屑 默认true
  breadcrumbParams?: {
    // key为path中的key去掉：
    // 假如path为  /user/:id/tags/:tagId
    // 自定义传参为  params:{id:'自定义,tagId:'自定义'}
    [keyName: string]: string;
  };
  [propName: string]: any;
}) => {
  const currentPath = useLocation().pathname;
  const menuList = getNewRouterList().filter((item) => item.path === '/')[0].children;
  const { breadcrumbParams, goBack=false,  pageName, description, buttonList, showBreadcrumb = true, customStyle } = props;
  // 默认每个页面需要返回按钮
  const [status, setStatus] = useState<any | boolean>(false);
  dayjs.locale(intlMap[`zh${stateStorage.get('lang')}Intl`]);
  /**
   * @desc 判断当前页面是否需要goBack
   * @param {Object} menu 菜单List
   * @param {string} path 当前path
   * */
  const goBackStatus = (menu, path, show) =>

    menu?.forEach((item) => {
      if (item?.path) {
        // 如果当前path，是接口返回的根模块的，不需要返回按钮

        if (path === item.path && ((item.breadcrumbItem[0].path && item.breadcrumbItem.length === 1) || (!item.breadcrumbItem[0].path && item.breadcrumbItem.length === 2))) {
          show.isShow = false;
        }
      } else {
        goBackStatus(item.items, path, show);
      }
    });
  useEffect(() => {
    if (goBack !== false) {
      let show = { isShow: true };
      goBackStatus(menuList, currentPath, show);
      setStatus(show.isShow);
    }
  }, [goBack]);


  return (
    <>
      <div className={styles.contentHeader}>
        {
          showBreadcrumb &&
          <div style={{height: '22px',  marginBottom: 15}}>
            <LayoutBreadcrumb breadcrumbParams={breadcrumbParams || {}}/>
          </div>
        }
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            {status && (
              <a
                onClick={() => {
                  history.go(-1);
                }}
                className={styles.back}
              >
                <ArrowLeftOutlined className={styles.svg}/>
                <span>返回</span>
              </a>
            )}
            {pageName && <h2>{pageName || '-'}</h2>}
            {
              description && <span className={styles.description}>{description}</span>
            }
          </div>
          {
            buttonList &&  <div>{buttonList}</div>
          }
        </div>
      </div>
      <Content
        className="site-layout-background"
        style={
          customStyle || {
            // padding: showBreadcrumb ? 20 : 20,
            margin: 0,
            minHeight: 280,
            // maxHeight: 'calc(100% - 40px)', // 课程资源管理页面
            height: 'calc(100% - 90px)', // 课程资源管理页面
            // backgroundColor: '#fff',
            borderRadius: 4,
            position: 'relative',
            overflowX: 'hidden',
            overflowY: 'hidden'
          }
        }
      >
        <ConfigProvider locale={intlMap[`zh${stateStorage.get('lang')}Intl`]}>{props.children}</ConfigProvider>
      </Content>
    </>
  );
};
export default BaseComponent;
