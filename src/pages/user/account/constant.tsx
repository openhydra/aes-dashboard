/**
 * @AUTHOR zhy
 * @DATE 2024/01/2
 * @Description:
 */
import React from 'react';
import { Input, Space, Tag, Button } from 'antd';
import CustomIconButton from '@src/components/CustomIconButton';
import { checkUserAuth, hexToRgba } from '@src/utils';
import { SearchOutlined } from '@src/utils/antdIcon';

const columns = (tableRef, editHandle, passwordHandle, roleList, groupList) => {
  let newJson = {};
  groupList.forEach((item) => newJson[item.id] = {text: item.name, id:item.id});

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
      dataIndex: 'name',
      key: 'name',
      width: 100,
      onFilter: (value, record) =>
        record.name
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8}}>
          <Input
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={ () => {
              confirm();
            }}
            style={{ width: 188, marginBlockEnd: 8, display: 'block' }} />
          <Space style={{width: '80%', marginLeft:'10%', display: 'flex', justifyContent: 'space-between'}}>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 50 }}
            >
              重置
            </Button>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 50 }}
            >
              查询
            </Button>
          </Space>

        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      width: '180px',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => {
       return record?.roles?.map((item) => {
          let role = roleList?.filter((el) =>el.id === item.id);
          return <Tag key={item.id} color={'green'} style={{padding: '3px 8px'}}>{role.length>0 ? role[0]?.name : ''}</Tag>
        })
      }
    },
    {
      title: '班级',
      dataIndex: 'group',
      key: 'group',
      width: 180,
      filters: true,
      valueEnum: {
        all: { text: '全部' },
        ...newJson
      },
      render: (_, record) => {
        return record?.groups?.map((item) => {
          let group = groupList?.filter((el) =>el.id === item.id) || [];
          return <span key={item?.id}
                       style={{
                          color: '#'+group[0]?.tagColor || '6750A4',
                          background:hexToRgba(group[0]?.tagColor || '6750A4', 0.1),
                          padding: '6px 8px',
                          borderRadius: 8,
                          marginBottom: 5,
                          display: 'inline-block',
                          marginRight: 5}}>{group?.length>0 ? group[0]?.name : '-'}</span>
        }) || '-'
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '180px',
      ellipsis: {
        showTitle: false
      },
      render: (_, record) => record?.description || '-'
    },
    (checkUserAuth('user', 8) || checkUserAuth('user', 16)) && {
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
            {
              checkUserAuth('user', 8) &&
              <CustomIconButton
                buttonText={'编辑'}
                title={record.name ==='aes-admin'? '系统默认角色，不可操作' : ''}
                buttonProps={{disabled: record.name ==='aes-admin'}}
                onClick={() => editHandle(record)}
              />
            }
            {
              checkUserAuth('user', 8) &&
              <CustomIconButton
                buttonText={'重置密码'}
                onClick={() => passwordHandle(record)}
              />
            }
            {
              checkUserAuth('user', 16) &&
              <CustomIconButton
                buttonText={'删除'}
                title={record.name ==='aes-admin'? '系统默认角色，不可操作' : ''}
                buttonProps={{disabled: record.name ==='aes-admin'}}
                onClick={() => {
                  tableRef.current.openDeleteModal(record);
                }}
              />
            }

          </Space>
        );
      }
    }
  ].filter((i) => i);
  return columnsList;
};
export { columns };
