/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, { useRef, useState } from 'react';
import PublicTable from '@src/components/PublicTable';
import BaseComponent from '@src/components/BaseComponent';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {columns} from './constant';
import { ExclamationCircleOutlined } from '@src/utils/antdIcon';
import CreateRole from './create';
import * as RoleServices from '@src/services/user/role';
import { useRequest } from 'ahooks';
import * as _ from 'lodash-es';
import RoleSVG from "@src/assets/images/user/role.svg";
import { checkUserAuth } from '@src/utils';

const Role: React.FC = () => {
  const tableRef = useRef<any>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();

  // 初始化表格数据
  const {
    data: sourceData,
    loading: isLoading,
    run: paginationCallBack
  } = useRequest((params) => RoleServices.getRoles(params).then((res) => {
    res?.items?.map((response, index) => response.id = response.metadata.name + '_' + index);
    return res;
  }), { manual: true });


  return (
    <BaseComponent pageName={'角色管理'} showBreadcrumb={false} description={'定义角色职责，配置角色访问权限'}>
      <PublicTable
        ref={tableRef}
        dataSource={sourceData || []}
        loading={isLoading}
        updateTable={paginationCallBack}
        columns={columns(tableRef, navigate)}
        hiddenSearchOperate
        hiddenDownloadOperate
        modalSetting={
          checkUserAuth('role', 4) ? {
            creatButtonName: '创建角色',
            modalTitle: <div><span><RoleSVG style={{transform: 'scale(1.1)'}}/></span>创建角色</div>,
            formName: 'createRole',
            createLoading: createLoading,
            modalWidth: 550,
            layoutConfig: {
              labelWrap: true,
              labelCol: {
                span: 6
              },
              wrapperCol: {
                span: 24
              }
            },
            FormItems: (form) => <CreateRole form={form} />,
            onSubmit: (values) => {
              setCreateLoading(true);
              let permission = {};
              Object.keys(values.permission).forEach((key) => {
                values.permission[key].forEach((item) => {
                  let keyArray = item.split('-');
                  let currentKey = keyArray[keyArray.length - 2];
                  //判断为数字
                  if(/^[+-]?\d+(\.\d+)?$/.test(keyArray[keyArray.length - 1])){
                    _.isNil(permission[currentKey]) && (permission[currentKey] = 0);
                    permission[currentKey] = permission[currentKey] | keyArray[keyArray.length - 1];
                  }
                })
              })
              values.permission = permission
              RoleServices.addRoles(values)
                .then((res) => {
                  if(res?.errMsg){
                    message.error(res?.errMsg);
                  }else{
                    message.success(`角色 ${values.name} 创建成功！`);
                  }
                  setCreateLoading(false);
                  tableRef.current.closeCreateModal(true);
                })
                .catch(() => setCreateLoading(false));

            }
          } :false
        }
        deleteModalSetting={{
          title: '删除角色',
          content: (
            <>
              <ExclamationCircleOutlined style={{ color: '#faad14' }} /> 确定删除所选角色？
            </>
          ),
          deleteRun: (params) => {
            setCreateLoading(true);
            RoleServices.delRole({ roleId: params?.id })
              .then(() => {
                message.success(`角色 ${params.name} 删除成功！`);
                tableRef.current.closeDeleteModal(true);
              })
              .catch(() => tableRef.current.closeDeleteModal(true));
          }
        }}
      />
    </BaseComponent>
  );
};

export default Role;
