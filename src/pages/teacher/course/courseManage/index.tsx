/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, { useRef, useState } from 'react';
import PublicTable from '@src/components/PublicTable';
import {  message } from 'antd';
import {columns} from './constant';
import { ExclamationCircleOutlined } from '@src/utils/antdIcon';
import CreateAccount from './create';
import * as AccountServices from 'src/services/user/account';
import { useRequest } from 'ahooks';
import * as _ from 'lodash-es';
import AddCourseSVG from "@src/assets/images/teacher/addCourse.svg";

const CourseManage: React.FC = () => {
  const tableRef = useRef<any>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [fileList, setFileList] = useState<any>(null);

  // // 初始化表格数据
  // const {
  //   data: sourceData,
  //   loading: isLoading,
  //   run: paginationCallBack
  // } = useRequest((params) => AccountServices.getAccount(params).then((res) => {
  //   res.items?.map((response, index) => response.id = response.metadata.name + '_' + index);
  //   return res;
  // }), { manual: true });

  return ( ''
    // <PublicTable
    //   ref={tableRef}
    //   // dataSource={sourceData?.items || []}
    //   dataSource={[{name: '3'}]}
    //   loading={isLoading}
    //   updateTable={paginationCallBack}
    //   columns={columns(tableRef)}
    //   hiddenSearchOperate
    //   hiddenDownloadOperate
    //   modalSetting={
    //     {
    //       creatButtonName: '创建课程',
    //       modalTitle: <div><span><AddCourseSVG style={{transform: 'scale(1)'}}/></span>创建课程</div>,
    //       formName: 'createAccount',
    //       createLoading: createLoading,
    //       modalWidth: 550,
    //       layoutConfig: {
    //         labelWrap: true,
    //         labelCol: {
    //           span: 12
    //         },
    //         wrapperCol: {
    //           span: 24
    //         }
    //       },
    //       FormItems: (form) => <CreateAccount form={form} fileList={fileList} setFileList={setFileList} />,
    //       onSubmit: (values) => {
    //         setCreateLoading(true);
    //         delete values.confirmPassword;
    //         let newValues = _.cloneDeep(values);
    //         delete newValues.name;
    //         AccountServices.addAccount({
    //           metadata: {name: values?.name},
    //           spec: newValues
    //         })
    //           .then((res) => {
    //             message.success('创建成功');
    //             setCreateLoading(false);
    //             tableRef.current.closeCreateModal(true);
    //           })
    //           .catch(() => setCreateLoading(false));
    //       }
    //     }
    //   }
    //   style={{marginTop: '-100px'}}
    //   deleteModalSetting={{
    //     title: '删除账号',
    //     content: (
    //       <>
    //         <ExclamationCircleOutlined style={{ color: '#faad14' }} /> 确定删除所选账号？
    //       </>
    //     ),
    //     deleteRun: (params) => {
    //       setCreateLoading(true);
    //       AccountServices.delAccount({ name: params?.metadata?.name })
    //         .then(() => {
    //           message.success('删除成功');
    //           tableRef.current.closeDeleteModal(true);
    //         })
    //         .catch(() => tableRef.current.closeDeleteModal(true));
    //     }
    //   }}
    // />
  );
};

export default CourseManage;
