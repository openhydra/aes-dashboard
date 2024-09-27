/**
 * @AUTHOR zhy
 * @DATE 2024/01/2
 * @Description:
 */
import React from 'react';
import { Space } from 'antd';
import CustomIconButton from '@src/components/CustomIconButton';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { checkUserAuth } from '@src/utils';
import stateStorage from '@src/storage/stateStorage'; // 导入 UTC 插件
dayjs.extend(utc);

const columns = (tableRef, user_id, type) => {
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
      title: '知识文件名称',
      dataIndex: 'file_name',
      key: 'file_name',
      width: 300
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: '180px',
      ellipsis: {
        showTitle: false
      },
      render : (_, record) =>  dayjs.utc(record?.create_time).local().format('YYYY.MM.DD HH:mm:ss')
    },

    (user_id === stateStorage.get('userInfo')?.id &&
      type !== '1' &&
      checkUserAuth('rag', 8)) && {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: '180px',
      align: 'center',
      ellipsis: {
        showTitle: false
      },
      render: (text, record) => {
        return (
          <Space>
            {/*<CustomIconButton*/}
            {/*  buttonText={'下载'}*/}
            {/*  onClick={() => downloadHandle(record)}*/}
            {/*/>*/}
            <CustomIconButton
              buttonText={'删除'}
              onClick={() => {
                tableRef.current.openDeleteModal(record);
              }}
            />
          </Space>
        );
      }
    }
  ];
  return columnsList;
};
export { columns };
