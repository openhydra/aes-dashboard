/**
 * @AUTHOR zhy
 * @DATE 2024/01/2
 * @Description:
 */
import React from 'react';
import { Space, Tag, Switch } from 'antd';
import { checkUserAuth } from '@src/utils';


const columns = (tableRef, openHandle, closeHandle) => {
  let columnsList = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      valueType: 'index',
      width: '60px',
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: '账号名',
      dataIndex: ['metadata', 'name'],
      key: 'account',
      width: '120px',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => record?.metadata?.name || '-'
    },
    {
      title: '容器状态',
      dataIndex: ['spec', 'deviceStatus'],
      key: 'status',
      width: 80,
      ellipsis: {
        showTitle: false
      },
      valueEnum:(_) => {
        return {
          default: { text: '未运行', status: 'Default' },
          Creating: { text: '创建中', status: 'Default' },
          Pending: { text: '排队(资源不足)', status: 'Default' },
          Running: { text: '运行中', status: 'Processing' },
          Terminating: { text: '关闭中', status: 'Success' }
          // Queued: { text: `排队中 ( 前面有${_?.spec?.lineNo}在等待 )`, status: 'Success' }
        };
      }
    },
    {
      title: '容器类型',
      dataIndex: 'type',
      key: 'type',
      width: '80px',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => <Tag color={record?.spec?.deviceType === 'cpu' ? 'gold' : 'volcano'}>{record?.spec?.deviceType || '-'}</Tag>
    },
    {
      title: '环境名称',
      dataIndex: ['spec', 'sandboxName'],
      key: 'sandboxName',
      width: 180,
      ellipsis: {
        showTitle: true
      },
      render: (_, record) => record?.spec?.sandboxName || '-'
    },
    {
      title: '环境链接',
      dataIndex: ['spec', 'sandboxURLs'],
      key: 'sandboxURLs',
      width: 180,
      ellipsis: {
        showTitle: true
      },
      render: (_, record) => {
        if(record?.spec?.sandboxURLs){
          return record?.spec?.sandboxURLs?.split(',')?.map((item) => {
            return <a key={item} href={item} target="_blank" rel="noop">{item}<br/></a>
          })
        } else {
          return '-';
        }
      }
    },
    checkUserAuth('device', 8) && {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: '180px',
      align: 'center',
      // fixed: 'right',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => {
        let disabled = record?.spec?.deviceStatus === 'Terminating'
        let canOpen = record?.spec?.deviceStatus === 'default';
        let canClose = record?.spec?.deviceStatus === 'default' || record?.spec?.deviceStatus === 'Terminating';
        return (
          <Space>
            <Switch
              checked={record?.spec?.deviceStatus === 'Pending' || record?.spec?.deviceStatus === 'Running'}
              checkedChildren="开启"
              unCheckedChildren="关闭"
              disabled={disabled}
              loading={record?.spec?.deviceStatus === 'Create' || record?.spec?.deviceStatus === 'Pending' || record?.spec?.deviceStatus === 'Terminating'}
              onClick={(checked) => {
                if(checked){
                  // 开启
                  canOpen && openHandle(record)
                }else{
                  !canClose && closeHandle(record)
                }
              }} />
          </Space>
        );
      }
    }
  ];
  return columnsList;
};
export { columns };
