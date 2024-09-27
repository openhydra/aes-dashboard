/**
 * @AUTHOR zhy
 * @DATE 2024/01/2
 * @Description:
 */
import React from 'react';
import { Space } from 'antd';
import CustomIconButton from '@src/components/CustomIconButton';
import dayjs from 'dayjs';
import { checkUserAuth } from '@src/utils';

const columns = (tableRef, editModal) => {
  let columnsList = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      valueType: 'index',
      width: '100px',
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: '数据集名称',
      dataIndex: ['metadata', 'name'],
      key: 'data',
      width: '100px',
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: '创建时间',
      dataIndex: ['spec', 'updateTime'],
      key: 'updateTime',
      width: '180px',
      ellipsis: {
        showTitle: false
      },
      render: (text, record) => {
        return dayjs(record?.spec?.lastUpdate).format('YYYY/MM/DD   HH:mm:ss')
      }
    },
    {
      title: '描述',
      dataIndex: ['spec', 'description'],
      key: 'description',
      width: '100px',
      ellipsis: {
        showTitle: false
      }
    },
    checkUserAuth('dataset', 16) && {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: '120px',
      align: 'center',
      ellipsis: {
        showTitle: false
      },
      render: (text, record) => {
        return (
          <Space>
              <CustomIconButton
                buttonText={'删除'}
                onClick={() => tableRef.current.openDeleteModal(record)}
              />
          </Space>
        );
      }
    }
  ].filter((i) => i);
  return columnsList;
};
export { columns };
