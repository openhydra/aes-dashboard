/**
 * @AUTHOR zhy
 * @DATE 2024/01/2
 * @Description:
 */
import React from 'react';
import { Space, Tag } from 'antd';
import globalStyles from '@src/assets/css/global.less';
import CustomIconButton from '@src/components/CustomIconButton';
import { DeleteOutlined } from '@src/utils/antdIcon';

const columns = (tableRef) => {
  let columnsList = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      valueType: 'index',
      width: '60px',
      // fixed: 'left',
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: '课程名称',
      dataIndex: ['metadata', 'name'],
      key: 'account',
      width: 180
    },
    {
      title: '课程介绍',
      dataIndex: ['spec', 'description'],
      key: 'description',
      width: '180px',
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: '180px',
      align: 'center',
      // fixed: 'right',
      ellipsis: {
        showTitle: false
      },
      render: (text, record) => {
        return (
          <Space>
            <CustomIconButton
              buttonText={'编辑'}
            />
              <CustomIconButton
                buttonText={'重置密码'}
              />
            <CustomIconButton
              // toolTipProps={{ placement: 'right' }}
              buttonText={'删除'}
              // icon={
              //   <DeleteOutlined
              //     className={globalStyles.iconRed}
              //     onClick={() => {
              //       tableRef.current.openDeleteModal(record);
              //     }}
              //   />
              // }
            />
          </Space>
        );
      }
    }
  ];
  return columnsList;
};
export { columns };
