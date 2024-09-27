/**
 * @AUTHOR zhy
 * @DATE 2024/01/2
 * @Description:
 */
import React from 'react';
import { Space, Tag, Tooltip } from 'antd';
import CustomIconButton from '@src/components/CustomIconButton';


const colorList = {
  '6750A4': {
    background: 'linear-gradient(90deg, #6750A4 0%, #AD96EB 100%)',
    content: '#F3F1F8',
    boxShadow: '0 0 4px 5px rgba(103, 80, 164, 0.4)'
  },
  '2834E4': {
    background: 'linear-gradient(90deg, #2834E4 0%, #6EA5E3 100%)',
    content: '#E5EBFF',
    boxShadow: '0 0 4px 5px rgba(93, 146, 207, 0.4)'
  },
  'E06E9C': {
    background: 'linear-gradient(90deg, #E06E9C 0%, #E9A0BD 100%)',
    content: '#FFF4FD',
    boxShadow: '0 0 4px 5px rgba(224, 110, 156, 0.4)'
  },
  'C59D01': {
    background: 'linear-gradient(90deg, #C59D01 0%, #FCD540 100%)',
    content: '#FFF5ED',
    boxShadow: '0 0 4px 5px rgba(197, 157, 1, 0.4)'
  },
  '3EC1A1': {
    background: 'linear-gradient(90deg, #3EC1A1 0%, #75D8C0 100%)',
    content: '#F1F9F7',
    boxShadow: '0 0 4px 5px rgba(62, 193, 161, 0.4)'
  }
};
//
// const columns = (tableRef, roleList) => {
//   let columnsList = [
//     {
//       title: '序号',
//       dataIndex: 'index',
//       key: 'index',
//       valueType: 'index',
//       width: '60px',
//       fixed: 'left',
//       ellipsis: {
//         showTitle: false
//       }
//     },
//     {
//       title: '账号名',
//       dataIndex: 'name',
//       key: 'name',
//       width: 180
//     },
//     {
//       title: '角色',
//       dataIndex: 'roles',
//       key: 'roles',
//       width: '180px',
//       ellipsis: {
//         showTitle: false
//       },
//       render: (_, record) => {
//         return record?.roles?.map((item) => {
//           let role = roleList.filter((el) =>el.id === item.id);
//           return <Tag color={'green'} style={{padding: '3px 8px'}}>{role.length>0 ? role[0]?.name : ''}</Tag>
//         })
//       }
//     },
//     {
//       title: '班级',
//       dataIndex: [''],
//       key: 'account',
//       width: 180
//     },
//     {
//       title: '描述',
//       dataIndex: ['description'],
//       key: 'description',
//       width: '180px',
//       ellipsis: {
//         showTitle: false
//       }
//     },
//     {
//       title: '操作',
//       dataIndex: 'operate',
//       key: 'operate',
//       width: '180px',
//       align: 'center',
//       fixed: 'right',
//       ellipsis: {
//         showTitle: false
//       },
//       render: (text, record) => {
//         return (
//           <Space>
//             <CustomIconButton
//               buttonText={'编辑'}
//             />
//               <CustomIconButton
//                 buttonText={'重置密码'}
//               />
//             <CustomIconButton
//               // toolTipProps={{ placement: 'right' }}
//               buttonText={'删除'}
//               // icon={
//               //   <DeleteOutlined
//               //     className={globalStyles.iconRed}
//               //     onClick={() => {
//               //       tableRef.current.openDeleteModal(record);
//               //     }}
//               //   />
//               // }
//             />
//           </Space>
//         );
//       }
//     }
//   ];
//   return columnsList;
// };

const columnsGroupDetail = (tableRef, roleList, options = false) => {
  let columnsList = [
    {
      title: '序号',
      dataIndex: 'index',
      // key: 'index',
      valueType: 'index',
      width: '60px',
      // fixed: 'left',
      ellipsis: {
        showTitle: false
      }
    },
    {
      title: '账号名',
      dataIndex: 'name',
      key: 'name',
      // fixed: 'left',
      width: '18%'
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      // width: 140,
      ellipsis: {
        showTitle: true
      },
      render: (_, record) => {
        let array = []
        record?.roles?.map((item) => {
          let role = roleList?.filter((el) => el.id === item.id)[0];
          array.push(role)
        })
        return <Tooltip placement={'top'} title={array?.map((item) => item.name).toString()}>
          {
            array?.map((item, index) => {
            return <Tag key={index} color={'green'} style={{ padding: '3px 8px' }}>{ item?.name || ''}</Tag>;
            })
          }
        </Tooltip>
      }
    },
    {
      title: '描述',
      dataIndex: ['description'],
      key: 'description',
      // width: 140,
      ellipsis: {
        showTitle: false
      }
    },
    options && {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      // width: 180,
      align: 'center',
      // fixed: 'right',
      ellipsis: {
        showTitle: false
      },
      render: (text, record) => {
        return (
          <Space>
            <CustomIconButton
              buttonText={'移出班级'}
              onClick={() => {
                tableRef.current.openDeleteModal(record);
              }}
            />
          </Space>
        );
      }
    }
  ].filter((i) => i);
  return columnsList;
};
export { colorList, columnsGroupDetail };
