/**
 * @AUTHOR zhy
 * @DATE 2024/01/2
 * @Description:
 */
import React from 'react';
import { Space } from 'antd';
import CustomIconButton from '@src/components/CustomIconButton';
import { Link } from 'react-router-dom';
import { checkUserAuth } from '@src/utils';

const columns = (tableRef, goToDetailPage) => {
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
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 180
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '180px',
      ellipsis: {
        // showTitle: false
      },
      render: (_, record) => record?.description || '-'
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
              buttonText={
              <Link to={`/roleDetail`}
                    state={{id: record.id}}>查看详情</Link>}
            />
            {
              checkUserAuth('role', 16) &&
              <CustomIconButton
                buttonText={'删除'}
                title={record.name ==='aes-admin'? '系统默认角色，不可操作' : ''}
                buttonProps={{disabled: record.name ==='aes-admin'}}
                onClick={() => tableRef.current.openDeleteModal(record)}
              />
            }
          </Space>
        );
      }
    }
  ];
  return columnsList;
};


// noinspection BadExpressionStatementJS
const jurisdiction = [
  {
    title: '主页',
    key: 'indexView',
    children: [
      // {
      //   title: '学习中心',
      //   key: 'tool-courseStudentView',
      //   children: [
      //     {
      //       title: '查看',
      //       key: 'indexView-1'
      //     }
      //   ]
      // },
      {
        title: '学习中心',
        key: 'indexView-1',
        isLeaf:true
      },
      {
        title: '资源总览',
        key: 'indexView-2',
        isLeaf:true
      }
    ]
  },
  {
    title: '学习工具',
    key: 'tool',
    children: [
      {
        title: '课程',
        key: 'tool-course',
        children: [
          {
            title: '查看',
            key: 'tool-course-2',
            isLeaf:true
          },
          {
            title: '上传',
            key: 'tool-course-4',
            isLeaf:true
          },
          {
            title: '删除',
            key: 'tool-course-16',
            isLeaf:true
          }
        ]
      },
      {
        title: '实验环境',
        key: 'tool-deviceStudentView',
        children: [
          {
            title: '查看',
            key: 'tool-deviceStudentView-1',
            isLeaf:true
          },
          {
            title: '开启',
            key: 'tool-deviceStudentView-4',
            isLeaf:true
          },
          {
            title: '更新',
            key: 'tool-deviceStudentView-8',
            isLeaf:true
          },
          {
            title: '关闭',
            key: 'tool-deviceStudentView-16',
            isLeaf:true
          }
        ]
      },
      {
        title: '虚拟助教',
        key: 'tool-rag',
        children: [
          {
            title: '查看',
            key: 'tool-rag-2',
            isLeaf:true
          },
          {
            title: '创建',
            key: 'tool-rag-4',
            isLeaf:true
          },
          {
            title: '更新',
            key: 'tool-rag-8',
            isLeaf:true
          },
          {
            title: '删除',
            key: 'tool-rag-16',
            isLeaf:true
          }
        ]
      },
      // {
      //   title: '虚拟助教',
      //   key: '1-3',
      //   children: [
      //     {
      //       title: '语料管理',
      //       key: '1-3-0',
      //       children: [
      //         {
      //           title: '查看',
      //           key: '1-3-0-0',
      //           last:true
      //         },
      //         {
      //           title: '上传',
      //           key: '1-3-0-1',
      //           last:true
      //         },
      //         {
      //           title: '更新',
      //           key: '1-3-0-2',
      //           last:true
      //         },
      //         {
      //           title: '删除',
      //           key: '1-3-0-3',
      //           last:true
      //         },
      //         {
      //           title: '下载',
      //           key: '1-3-0-4',
      //           last:true
      //         }
      //       ]
      //     },
      //     {
      //       title: '知识库管理',
      //       key: '1-3-1',
      //       children: [
      //         {
      //           title: '查看',
      //           key: '1-3-1-0'
      //         },
      //         {
      //           title: '创建',
      //           key: '1-3-1-1'
      //         },
      //         {
      //           title: '更新',
      //           key: '1-3-1-2'
      //         },
      //         {
      //           title: '删除',
      //           key: '1-3-1-3'
      //         }
      //       ]
      //     },
      //     {
      //       title: '助教管理',
      //       key: '1-3-2',
      //       children: [
      //         {
      //           title: '查看',
      //           key: '1-3-2-0',
      //         },
      //         {
      //           title: '创建',
      //           key: '1-3-2-1',
      //         },
      //         {
      //           title: '更新',
      //           key: '1-3-2-2',
      //         },
      //         {
      //           title: '删除',
      //           key: '1-3-2-3',
      //         }
      //       ]
      //     }
      //   ]
      // }
    ]
  },
  {
    title: '教学管理',
    key: 'teacher',
    children: [
      {
        title: '数据集管理',
        key: 'teacher-dataset',
        children: [
          {
            title: '查看',
            key: 'teacher-dataset-2',
            isLeaf:true
          },
          {
            title: '上传',
            key: 'teacher-dataset-4',
            isLeaf:true
          },
          {
            title: '删除',
            key: 'teacher-dataset-16',
            isLeaf:true
          }
        ]
      },
      // {
      //   title: '课程资源管理',
      //   key: 'teacher-course',
      //   children: [
      //     {
      //       title: '查看',
      //       key: 'teacher-course-2',
      //       isLeaf:true
      //     },
      //     {
      //       title: '上传',
      //       key: 'teacher-course-4',
      //       isLeaf:true
      //     },
      //     {
      //       title: '删除',
      //       key: 'teacher-course-16',
      //       isLeaf:true
      //     }
      //   ]
      // }
    ]
  },
  {
    title: '用户管理',
    key: 'userManage',
    children: [
      {
        title: '账号管理',
        key: 'userManage-user',
        children: [
          {
            title: '查看',
            key: 'userManage-user-2',
            isLeaf:true
          },
          {
            title: '创建',
            key: 'userManage-user-4',
            isLeaf:true
          },
          {
            title: '更新',
            key: 'userManage-user-8',
            isLeaf:true
          },
          {
            title: '删除',
            key: 'userManage-user-16',
            isLeaf:true
          }
        ]
      },
      {
        title: '角色管理',
        key: 'userManage-role',
        children: [
          {
            title: '查看',
            key: 'userManage-role-2',
            isLeaf:true
          },
          {
            title: '创建',
            key: 'userManage-role-4',
            isLeaf:true
          },
          {
            title: '更新',
            key: 'userManage-role-8',
            isLeaf:true
          },
          {
            title: '删除',
            key: 'userManage-role-16',
            isLeaf:true
          }
        ]
      },
      {
        title: '班级管理',
        key: 'userManage-group',
        children: [
          {
            title: '查看',
            key: 'userManage-group-2',
            isLeaf:true
          },
          {
            title: '创建',
            key: 'userManage-group-4',
            isLeaf:true
          },
          {
            title: '更新',
            key: 'userManage-group-8',
            isLeaf:true
          },
          {
            title: '删除',
            key: 'userManage-group-16',
            isLeaf:true
          }
        ]
      }
    ]
  },
  {
    title: '设备资源管理',
    key: 'deviceManage',
    children: [
      {
        title: '设备管理',
        key: 'deviceManage-device',
        children: [
          {
            title: '查看',
            key: 'deviceManage-device-2',
            isLeaf:true
          },
          {
            title: '创建',
            key: 'deviceManage-device-4',
            isLeaf:true
          },
          {
            title: '更新',
            key: 'deviceManage-device-8',
            isLeaf:true
          },
          {
            title: '删除',
            key: 'deviceManage-device-16',
            isLeaf:true
          },
          {
            title: '管理非本人资源',
            key: 'deviceManage-device-32',
            isLeaf:true
          }
        ]
      },
      {
        title: '平台配置',
        key: 'deviceManage-setting',
        children: [
          {
            title: '查看',
            key: 'deviceManage-setting-2',
            isLeaf:true
          },
          {
            title: '更新',
            key: 'deviceManage-setting-8',
            isLeaf:true
          }
        ]
      }
    ]
  }
]

/**
 * @desc 将树结构数据返回扁平化
 * @param {Object} treeData  树结构
 * @return {Array[]} result 扁平化数组
 * */
const getListByTree = (treeData) => {
  let result:any[] = [];
  treeData.forEach((item) => {
    result.push(item);
    if (item?.children) {
      result = result.concat(getListByTree(item?.children));
    }
  });
  return result;
};


const check_indeterminate = (checkedList, key) =>{
  // 所有扁平化数据
  let allData: any[]= getListByTree(jurisdiction);
  // 当前模块下所有数据
  let allModal = allData.filter((item) => item.key?.length > key?.length && item.key.startsWith(key));
  // 当下模块选中的key 集合
  let currentModalChecked = checkedList[key] || [];
  return currentModalChecked?.length > 0 && currentModalChecked.length < allModal.length;
}


const check_checked = (checkedList, key) =>{
  // 所有扁平化数据
  let allData: any[]= getListByTree(jurisdiction);
  // 当前模块下所有数据
  let allModal = allData.filter((item) => item.key?.length > key?.length && item.key.startsWith(key));
  // 当下模块选中的key 集合
  let currentModalChecked = checkedList[key] || [];

  return currentModalChecked.length >= allModal.length;
}

export {
  jurisdiction,
  columns,
  getListByTree,
  check_indeterminate,
  check_checked
};
