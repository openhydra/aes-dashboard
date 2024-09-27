/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, { useEffect, useRef, useState } from 'react';
import PublicTable from '@src/components/PublicTable';
import BaseComponent from '@src/components/BaseComponent';
import { useLocation } from 'react-router-dom';
import { message, Button, Form, Modal, Transfer, Table } from 'antd';
import {columnsGroupDetail} from './constant';
import { ExclamationCircleOutlined} from '@src/utils/antdIcon';
import * as GroupServices from '@src/services/user/group';
import { useRequest } from 'ahooks';
import UserSVG from "@src/assets/images/user/user.svg";
import * as styles from "./style.less";
import * as RoleServices from '@src/services/user/role';
import { checkUserAuth } from '@src/utils';

const Detail: React.FC = () => {
  const location = useLocation();
  const tableRef = useRef<any>(null);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [usersNotInGroup, setUsersNotInGroup] = useState<any[]>([]);
  const [roleList, setRoleList] = useState<any[]>(null);
  const [targetKeys, setTargetKeys] = useState<any[]>([]);

  // 初始化表格数据
  const {
    data: sourceData,
    loading: isLoading,
    run: paginationCallBack,
    refresh: refreshCallBack
  } = useRequest((params) => GroupServices.getUsersInGroup({...params, groupId:location?.state?.id}).then((res) => {
    return res;
  }), { manual: true });

  const getUsersNotInGroupHandle = () => {
    GroupServices.getUsersNotInGroup({groupId: location?.state?.id}).then((res) => {
      res?.map((item) => item.key = item.id)
      setUsersNotInGroup(res);
    })
  }

  /**
   * 获取角色列表
   * */
  const getRoleListHandle = () =>{
    RoleServices.getRoles({}).then((res) => {
      setRoleList(res || []);
    })
  }
  useEffect(() => {
    getRoleListHandle();
  }, []);


  const TableTransfer = (props) => {
    const { leftColumns, rightColumns, ...restProps } = props;
    return (
      <Transfer
        style={{
          width: '100%',
        }}
        {...restProps}
      >
        {({
            direction,
            filteredItems,
            onItemSelect,
            onItemSelectAll,
            selectedKeys: listSelectedKeys,
            disabled: listDisabled,
          }) => {
          const columns = direction === 'left' ? leftColumns : rightColumns;
          const rowSelection = {
            getCheckboxProps: () => ({
              disabled: listDisabled,
            }),
            onChange(selectedRowKeys) {
              onItemSelectAll(selectedRowKeys, 'replace');
            },
            selectedRowKeys: listSelectedKeys,
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
          };
          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              style={{
                pointerEvents: listDisabled ? 'none' : undefined,
                height: 400,
                width: 475,
                overflow: 'auto'
              }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) {
                    return;
                  }
                  onItemSelect(key, !listSelectedKeys.includes(key));
                },
              })}
            />
          );
        }}
      </Transfer>
    );
  };

  return (
    <BaseComponent
      pageName={location?.state?.name}
      showBreadcrumb={true}
      breadcrumbParams={{ name: location?.state?.name }}>
      <PublicTable
        ref={tableRef}
        dataSource={sourceData || []}
        loading={isLoading}
        updateTable={paginationCallBack}
        columns={columnsGroupDetail(tableRef, roleList, checkUserAuth('group', 8))}
        hiddenSearchOperate
        hiddenDownloadOperate
        buttonList={
          checkUserAuth('group', 8) ?
            <Button type={'primary'} size={'large'} onClick={() => {
              getUsersNotInGroupHandle();
              setOpen(true);
            }}>
              添加班级成员
            </Button> :false
        }
        modalSetting={false}
        deleteModalSetting={{
          title: '移出班级',
          content: (
            <>
              <ExclamationCircleOutlined style={{ color: '#faad14' }} /> 确定将所选账号移出班级？
            </>
          ),
          deleteRun: (params) => {
            setCreateLoading(true);
            GroupServices.delUsersInGroup({groupId:location?.state?.id, userId:  params.id})
              .then(() => {
                message.success(`${params.name} 成功移出 ${location?.state?.name}！`);
                setCreateLoading(false);
                tableRef.current.closeDeleteModal(true);
              })
              .catch(() => tableRef.current.closeDeleteModal(true));
          }
        }}
      />

      <Modal
        title={<div><span><UserSVG style={{ transform: 'scale(1.3)', fill: '#5B46F6'}} /></span>添加班级成员</div>}
        centered
        open={open}
        destroyOnCloseq
        onOk={() =>
          form.validateFields().then(async (values) => {
            let params:any[] = [];
            targetKeys.forEach((item) => {
              params.push({id: usersNotInGroup.filter((el) => el.id === item)[0]?.id})
            })
            setCreateLoading(true);
            GroupServices.addUsersToGroup(params, {groupId: location?.state?.id}).then((res) => {
              if(res?.errMsg){
                message.error(res?.errMsg);
              }else {
                message.success(`成员成功添加至 ${location?.state?.name}！`);
              }
              setTargetKeys([]);
              setOpen(false);
              setCreateLoading(false);
              refreshCallBack();
            }).catch((res) => {
              message.success(res);
              setCreateLoading(false);
            })
          })
        }
        onCancel={() => {
          setOpen(false);
          setTargetKeys([])
          form.resetFields();
        }}
        confirmLoading={createLoading}
        okText={'确定'}
        cancelText={'取消'}
        className={styles.addGroup}
        width={1040}>
        <Form
          layout="vertical"
          form={form}
          labelCol={{
            span: 6
          }}
          wrapperCol={{
            span: 24
          }}
          preserve={false}
        >
          <Form.Item label={'选择成员'} rules={[{ required: true, message: '请选择成员'}]} name="name">
            <TableTransfer
              dataSource={usersNotInGroup}
              targetKeys={targetKeys}
              showSearch
              showSelectAll={false}
              filterOption={(input, item) => item.name?.includes(input)}
              leftColumns={columnsGroupDetail(tableRef, roleList)}
              rightColumns={columnsGroupDetail(tableRef, roleList)}
              onChange={(nextTargetKeys) => {
                setTargetKeys(nextTargetKeys);
              }}
            />
          </Form.Item>
        </Form>

      </Modal>
    </BaseComponent>
  );
};

export default Detail;
