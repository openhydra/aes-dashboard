/**
 * Author: neiluoluo nie.luoluo@99cloud.net
 * Date: 2022-07-22 16:16:51
 * @LastEditors: neiluoluo
 * @LastEditTime: 2023-05-17 15:44:21
 * Description: 公用面包屑
 *
 */
import {getNewRouterList} from '@src/routers/routerLists';
import { Breadcrumb, Spin, Tooltip } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as _ from 'lodash-es';
import stateStorage from '@src/storage/stateStorage';
import { LoadingOutlined } from '@src/utils/antdIcon';

// 面包屑优先显示uuid，没有uuid就显示name，大标题显示name，没有name显示“-”
function LayoutBreadcrumb(props: {
  breadcrumbParams?: {
    // key为path中的key去掉：
    // 假如path为  /user/:id/tags/:tagId
    // 自定义传参为  params:{id:'自定义,tagId:'自定义'}
    [keyName: string]: string;
  };
}) {
  const t: any = useTranslation().i18n.t;
  const location = useLocation();
  const { pathname } = location;
  const breadcrumbParams = props?.breadcrumbParams || {};
  const routerParams = useParams();

  /**
   * @desc 将routerList中的path + 参数 —— 转成浏览器路由形式
   * @param {string} path routerList中的path
   * @return {string} 转成浏览器路由形式
   * */
  const getCurrentPath = (path) => {
    Object.keys(routerParams).forEach((key) => {
      path = path?.replace(`:${key}`, encodeURI(routerParams[key]));
    });
    return path;
  };
  const getBreadcrumbItems = (pathname, _breParams) => {
    let breParams = { ..._breParams };
    // 判断当前path
    let breadcrumbItem = [];
    _.cloneDeep(getNewRouterList())?.map((module) => {
      module?.children &&
        module?.children?.map((item) => {
          if (item.path === pathname) {
            let memoryListParams = stateStorage.get('memoryListParams') || [];
            !memoryListParams.some((memory) => memory.url == pathname) && stateStorage.del('memoryListParams');
            // stateStorage.del('memoryListParams');
            document.title = item.breadcrumbItem[1]?.label + ' - ' + 'OpenHydra';
            // setBreadcrumb(item.breadcrumbItem);
            breadcrumbItem = item.breadcrumbItem;
          } else if (getCurrentPath(item.path) === pathname) {
            // 查找到 routerList中的path === 浏览器上路由
            item?.breadcrumbItem?.map((el) => {
              // 修改面包屑的name
              if (el.path?.includes(':') && breParams && _.isNil(el.label)) {
                // 需要替换的path
                for (const key in breParams) {
                  if (breParams[key]) {
                    el.label = breParams[key];
                    el.path = el.path?.replace(`:${key}`, routerParams[key]);
                    delete breParams[key];
                    break;
                  }
                }
              }
              return el;
            });
            document.title = t(item.breadcrumbItem[1]?.label) + ' - ' + 'OpenHydra';
            breadcrumbItem = _.cloneDeep(item.breadcrumbItem);
          }
        });
    });
    return breadcrumbItem;
  };

  const result: any = useMemo(() => getBreadcrumbItems(pathname, breadcrumbParams), [pathname, breadcrumbParams]);
  const [breadcrumb, setBreadcrumb] = useState<any[]>(() => result || []);
  useEffect(() => {
    const res: any = getBreadcrumbItems(pathname, breadcrumbParams);
    setBreadcrumb(res || []);
  }, [pathname, breadcrumbParams]);
  const antIcon = <LoadingOutlined style={{ fontSize: 12 }} spin />;
  return (
    <>
      <Breadcrumb>
        {breadcrumb?.map((item, index) => (
          <Breadcrumb.Item key={index}>
            {!item.path || index === breadcrumb.length - 1 ? (
              item?.label ? (
                <Tooltip title={t(item?.label)}>
                  <span
                    style={{
                      display: 'table-cell',
                      maxWidth: '340px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {t(item?.label)}
                  </span>
                </Tooltip>
              ) : (
                <Spin indicator={antIcon} />
              )
            ) : (
              <Link to={item.path} style={{ color: '#1677ff' }}>
                {item?.label ? t(item?.label) : <Spin indicator={antIcon} />}
              </Link>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </>
  );
}

export default LayoutBreadcrumb;
