/**
 * @AUTHOR zhy
 * @DATE 2024/01/2
 * @Description:
 */
import React from 'react';
import { Space } from 'antd';
import * as globalStyles from '@src/assets/css/global.less';
import CustomIconButton from '@src/components/CustomIconButton';
import { DeleteOutlined } from '@src/utils/antdIcon';

const columns = (tableRef) => {
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
      title: '课程资源',
      dataIndex: ['metadata', 'name'],
      key: 'data',
      width: '100px',
      ellipsis: {
        showTitle: false
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
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: '120px',
      align: 'center',
      // fixed: 'right',
      ellipsis: {
        showTitle: false
      },
      render: (text, record) => {
        return (
          <Space>
              <CustomIconButton
                toolTipProps={{ placement: 'right' }}
                title={'删除'}
                icon={
                  <DeleteOutlined
                    className={globalStyles.iconRed}
                    onClick={() => tableRef.current.openDeleteModal(record)}
                  />
                }
              />
          </Space>
        );
      }
    }
  ];
  return columnsList;
};
export { columns };
