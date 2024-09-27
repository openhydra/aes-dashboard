import React, { useContext, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { cloudTypeName } from '@src/utils';
import GetTableColumnFilterDropdown from '../TableColumnsFilter/TableColumnsFilter';
import stateStorage from '@src/storage/stateStorage';
import { RootContext } from '@src/frame/rootContext';
import * as _ from 'lodash-es';

function GetColumns(props: {
  showType?:
    | 'Enterprise'
    | 'Region'
    | 'Department'
    | 'Project'
    | 'CloudType'
    | 'OssServer'
    | 'PublicRegion'
    | 'Roles'
    | 'RangePicker'; // showType 与组件 GetTableColumnFilterDropdown 中type对齐
  title?: string; // 名称
  dataIndex?: string; // columns中的index
  width?: string; // columns 宽度
  filterDropdownProps?: any; // 传入GetTableColumnFilterDropdown中,特定的props
  render?: any; //  需要特别处理的render,
  filterStyle?: any; // 第一个过滤筛选框的位置
}) {
  const t: any = useTranslation().i18n.t;
  // 初始化当前过滤值
  let { showType, title, dataIndex = '', width, render, filterDropdownProps, filterStyle } = props;

  // 获取全局的数据
  const { state } = useContext(RootContext);
  const [currentInitValue, setCurrentInitValue] = useState(undefined);

  // 转换后的render
  let newRender;

  // 根据当前showType,也就是原组件的type类型去判断column对象内容
  if (showType === 'Enterprise') {
    title = title || t('企业');
    dataIndex = dataIndex || 'enterpriseId';
    newRender =
      render ||
      ((text, record) => (
        <Tooltip
          placement="topLeft"
          title={record?.enterpriseName || record?.enterprise?.name || record?.ossServer?.enterpriseName || '-'}
        >
          {record?.enterpriseName || record?.enterprise?.name || record?.ossServer?.enterpriseName || '-'}
        </Tooltip>
      ));
  } else if (showType === 'Region') {
    title = title || t('区域');
    dataIndex = dataIndex || 'regionId';
    newRender =
      render ||
      ((text, record) => {
        let name = record?.ossServer?.region?.name || record?.regionName || record?.region?.name || '-';
        return (
          <Tooltip placement="topLeft" title={name}>
            {name}
          </Tooltip>
        );
      });
  } else if (showType === 'Project') {
    title = title || t('<==项目==>');
    dataIndex = dataIndex || 'projectId';
    newRender =
      render ||
      ((text, record) => {
        let name = record?.project?.name || record?.projectName || '-';
        return (
          <Tooltip placement="topLeft" title={name}>
            {name}
          </Tooltip>
        );
      });
  } else if (showType === 'CloudType') {
    // 云平台类型只能用key:vendor, 需要传type,vendor，给后端查询，暂时处理方式限定死
    title = title || t('云平台');
    dataIndex = dataIndex || 'vendor';
    newRender =
      render ||
      ((text, record) => {
        let name =
          cloudTypeName(
            record?.ossServer?.type || record?.ossServerType,
            record?.ossServer?.vendor || record?.ossServerVendor || record?.vendor
          ) || record[dataIndex];
        return (
          <Tooltip placement="topLeft" title={t(name)}>
            {t(name)}
          </Tooltip>
        );
      });
  } else if (showType === 'Department') {
    title = title || t('项目');
    dataIndex = dataIndex || 'departmentId';
    newRender =
      render ||
      ((text, record) => {
        let name = record?.departmentName || record?.department?.name || '-';
        return (
          <Tooltip placement="topLeft" title={name}>
            {name}
          </Tooltip>
        );
      });
  } else if (showType === 'OssServer') {
    title = title || t('云账户');
    dataIndex = dataIndex || 'ossServerId';
    newRender =
      render ||
      ((text, record) => {
        let name = record?.ossServer?.name || record?.ossServerName || '-';
        return (
          <Tooltip placement="topLeft" title={name}>
            {name}
          </Tooltip>
        );
      });
  } else if (showType === 'PublicRegion') {
    title = title || t('公有云地域');
    dataIndex = dataIndex || 'publicRegionName';
    newRender =
      render ||
      ((text, record) => {
        let name = record?.publicRegionName || '-';
        return (
          <Tooltip placement="topLeft" title={name}>
            {name}
          </Tooltip>
        );
      });
  } else if (showType === 'Roles') {
    title = title || t('角色');
    dataIndex = dataIndex || 'role';
    newRender =
      render ||
      ((text, record) => {
        let name = record?.userRoleList[0]?.name || '-';
        return (
          <Tooltip placement="topLeft" title={name}>
            {name}
          </Tooltip>
        );
      });
  } else if (showType === 'RangePicker') {
    title = title || t('时间');
    dataIndex = dataIndex || 'createTime';
    newRender =
      render ||
      ((_, record) => {
        let name = record[dataIndex] || '-';
        return (
          <Tooltip placement="topLeft" title={name}>
            {name}
          </Tooltip>
        );
      });
  }

  useEffect(() => {
    let loop = true;
    // 跳转默认选中。。。暂时如此处理，后期需要跳转！！！！
    setInterval(() => {
      if (loop) {
        // 根据记忆列表，获取记忆值
        const memoryListParams = stateStorage.get('memoryListParams') || [];
        const memoryKey = state?.TableColumnsFilter?.memoryKey;
        if (memoryListParams?.length > 0) {
          let params: any = memoryListParams.filter((item) => item?.memoryKey === memoryKey)[0]?.params;
          if (params && dataIndex) {
            setCurrentInitValue(_.cloneDeep(!_.isNil(params[dataIndex]) ? params[dataIndex] : undefined));
          }
          loop = false;
        }
      }
    }, 1000);
  }, []);

  const filterValueCallBack = (val) => {
    setCurrentInitValue(val?.length > 0 ? val : undefined);
  };

  return {
    title,
    dataIndex,
    key: dataIndex,
    width: width || '120px',
    ellipsis: {
      showTitle: false
    },
    filteredValue: currentInitValue,
    filterDropdown: (props) => (
      <GetTableColumnFilterDropdown
        {...props}
        {...filterDropdownProps}
        filterStyle={filterStyle}
        currentInitValue={currentInitValue}
        filterValueCallBack={filterValueCallBack}
        type={showType}
      />
    ),
    render: newRender
  };
}

export default GetColumns;
