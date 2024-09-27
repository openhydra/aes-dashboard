/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, { useRef, useState } from 'react';
import BaseComponent from '@src/components/BaseComponent';
import PublicTable from '@src/components/PublicTable';
import { message } from 'antd';
import {columns} from './constant';
import {ExclamationCircleOutlined} from '@src/utils/antdIcon';
import UploadData from './uploadData';
import { useRequest } from 'ahooks';
import * as DataSetServices from '@src/services/teacher/data';
import DataSVG from '@src/assets/images/teacher/data.svg';
import { checkUserAuth } from '@src/utils';

const Data: React.FC = () => {
  const tableRef = useRef<any>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [fileList, setFileList] = useState<any>(null);

  // 初始化表格数据
  const {
    data: sourceData,
    loading: isLoading,
    run: paginationCallBack
  } = useRequest((params) => DataSetServices.getDatasets(params).then((res) => {
    res?.items?.map((response, index) => response.id = response.metadata.name + '_' + index);
    return res;
  }), { manual: true });


  return (
    <BaseComponent pageName={'数据集管理'} showBreadcrumb={false} description={'包含机器学习实验中所需的各类数据集'}>
      <PublicTable
        ref={tableRef}
        dataSource={sourceData?.items || []}
        loading={isLoading}
        updateTable={paginationCallBack}
        columns={columns(tableRef)}
        hiddenSearchOperate
        hiddenDownloadOperate
        modalSetting={
          checkUserAuth('dataset', 4) ? {
            creatButtonName: '上传数据集',
            modalTitle: <div><span><DataSVG style={{transform: 'scale(.8)'}}/></span>上传数据集</div>,
            formName: 'updateData',
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
            handleModalClose:(form) => form.resetFields(),
            FormItems: (form) => <UploadData form={form} fileList={fileList} setFileList={setFileList}/>,
            onSubmit: (values) => {
              setCreateLoading(true);
              let formObj = new FormData();
              formObj.append('file', fileList[0]);
              formObj.append('name', values?.name);
              formObj.append('description', values?.description || '');

              DataSetServices.addDatasets(formObj)
                .then((res) => {
                  if(res?.errMsg){
                    message.error(res?.errMsg);
                  }else{
                    message.success(`数据集 ${values.name} 上传成功！`);
                  }
                  setCreateLoading(false);
                  tableRef.current.closeCreateModal(true);
                })
                .catch(() => setCreateLoading(false));
            }
          } :false
        }
        deleteModalSetting={{
          title: '删除数据',
          content: (
            <>
              <ExclamationCircleOutlined style={{ color: '#faad14' }} /> 确定删除所选数据集？
            </>
          ),
          deleteRun: (params) => {
            DataSetServices.delDatasets({ name: params.metadata.name })
              .then((err) => {
                message.success(`数据集 ${params.metadata.name} 删除成功！`);
                tableRef.current.closeDeleteModal(true);
              })
              .catch(() => tableRef.current.closeDeleteModal(true));
          }
        }}
      />
    </BaseComponent>
  );
};

export default Data;
