/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, { useEffect, useRef, useState } from 'react';
import PublicTable from '@src/components/PublicTable';
import BaseComponent from '@src/components/BaseComponent';
import { Button, Form, Input, message, Modal, Progress, Select, Upload, Spin } from 'antd';
import {columns} from './constant';
import { DownloadOutlined, ExclamationCircleOutlined, InboxOutlined, UploadOutlined } from '@src/utils/antdIcon';
import CreateAccount from './create';
import * as AccountServices from '@src/services/user/account';
import { useRequest } from 'ahooks';
import AccountSVG from "@src/assets/images/user/account.svg";
import * as GroupServices from '@src/services/user/group';
import { checkKeystonePassword } from '@src/utils/regular';
import * as RoleServices from '@src/services/user/role';
import { checkUserAuth } from '@src/utils';
import * as _ from 'lodash-es';

const { Dragger } = Upload;
const Account: React.FC = () => {
  const [form]:any = Form.useForm();
  const [uploadForm]:any = Form.useForm();
  const tableRef = useRef<any>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [upload, setUpload] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [fileList, setFileList] = useState([]);
  let [progressData, setProgressData] = useState<any>(null);

  /**
   * @desc 用户名校验
   * */
  const validatorUsername = (rule, value, type?: string) => {
    let reg =/^([A-Z]|[a-z])([A-Z]|[a-z]|[0-9]|[^ ]){5,29}$/
    if (!reg.test(value)) {
      return Promise.reject('账号名需要以字母开头，可包含数字、字母，且长度6-30位');
    }
    return Promise.resolve();
  };
  /**
   * @desc 密码校验
   * */
  const validatorPassword = (rule, value, type?: string) => {
    let password = form.getFieldValue('password');
    let confirmPassword = form.getFieldValue('confirmPassword');
    if (!checkKeystonePassword(value)) {
      return Promise.reject('密码必需要包含数字、字母,或特殊字符，且长度6-20位');
    } else if (
      confirmPassword !== password &&
      confirmPassword?.length > 0 &&
      password?.length > 0
    ) {
      return Promise.reject('两次密码不一致');
    }
    return Promise.resolve();
  };

  // 初始化表格数据
  const {
    data: sourceData = [],
    loading: isLoading,
    run: paginationCallBack,
    refresh: refreshCallBack
  } = useRequest((params) => AccountServices.getAccount(params).then((res) => {
    return res;
  }), { manual: true });


  const editHandle = (record) => {
    setOpen(true);
    setEdit(true);
    setCurrentUser(record);
    getGroupListHandle()
    getRoleListHandle();
    form.setFieldsValue({
      name: record.name,
      description: record?.description,
      roles: record?.roles?.map((item) => item.id),
      groups: record?.groups?.map((item) => item.id),
    });
  }
  const passwordHandle = (record) => {
    setOpen(true);
    setEdit(false);
    setCurrentUser(record);
    form.setFieldsValue({name: record.name});
  }


  /**
   * 获取角色列表
   * */
  const getRoleListHandle = () =>{
    RoleServices.getRoles({}).then((res) => {
      setRoleList(res);
    })
  }

  /**
   * 获取班级列表
   * */
  const getGroupListHandle = () =>{
    GroupServices.getGroup({}).then((res) => {
      setGroupList(res);
    })
  }

  useEffect(() => {
    getRoleListHandle();
    getGroupListHandle();
  }, []);


  const fileProps = {
    maxCount: 1,
    accept: '.csv',
    onRemove: () => {
      setFileList(null);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList
  };

  return (
    <BaseComponent pageName={'账号管理'} showBreadcrumb={false} description={'创建、查询用户账号，维护用户信息'}>
      <PublicTable
        ref={tableRef}
        dataSource={sourceData || []}
        loading={isLoading}
        updateTable={paginationCallBack}
        columns={columns(tableRef, editHandle, passwordHandle, roleList, groupList)}
        hiddenSearchOperate
        hiddenDownloadOperate
        buttonList={checkUserAuth('user', 4) ? <Button type={'link'} onClick={() => setUpload(true)}><UploadOutlined />批量创建</Button> : false}
        modalSetting={
          checkUserAuth('user', 4) ?{
            creatButtonName: '创建账号',
            modalTitle: <div><span><AccountSVG style={{transform: 'scale(.8)'}}/></span>创建账号</div>,
            formName: 'createAccount',
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
            FormItems: (form) => <CreateAccount form={form} />,
            onSubmit: (values) => {
              values?.roles = values?.roles?.map((item) =>  {return {id: item}});
              values?.groups = values?.groups?.map((item) =>  {return {id: item}});
              setCreateLoading(true);
              delete values.confirmPassword;
              AccountServices.addAccount(values)
                .then((res) => {
                  if(res?.errMsg){
                    message.error(res?.errMsg);
                  }else{
                    message.success(`账号 ${values.name} 创建成功！`);
                  }
                  setCreateLoading(false);
                  tableRef.current.closeCreateModal(true);
                })
                .catch(() => setCreateLoading(false));
            }
          } :false
        }
        style={{marginTop: '-100px'}}
        deleteModalSetting={{
          title: '删除账号',
          content: (
            <>
              <ExclamationCircleOutlined style={{ color: '#faad14' }} /> 确定删除所选账号？
            </>
          ),
          deleteRun: (params) => {
            setCreateLoading(true);
            AccountServices.delAccount({ userId: params.id })
              .then(() => {
                message.success(`账号 ${params.name} 删除成功！`);
                setCreateLoading(false);
                tableRef.current.closeDeleteModal(true);
              })
              .catch(() => tableRef.current.closeDeleteModal(true));
          }
        }}
      />

      <Modal
        title={<div><span><AccountSVG style={{transform: 'scale(.8)'}}/></span>{edit ? '编辑账号' : '更新密码'}</div>}
        centered
        open={open}
        destroyOnClose
        forceRender
        onOk={() =>
          form.validateFields().then(async (values) => {
            setCreateLoading(true);
            let params:any = {
              name: values?.name,
              id: currentUser?.id
            };
            if(edit){
              params.description = values?.description;
              params?.roles = values?.roles?.map((item) =>  {return {id: item}});
              params?.groups = values?.groups?.map((item) =>  {return {id: item}});
            }else{
              // 密码
              params.password = values.password;
            }
            AccountServices.updateAccount(params, {userId: currentUser.id}).then((res) => {
              if(res?.errMsg){
                message.error(res?.errMsg);
              }else{
                message.success(edit ? `账号 ${values.name} 编辑成功！` : `账号 ${values.name} 密码已重置！`);
              }
              setOpen(false);
              setEdit(false);
              refreshCallBack();
              setCreateLoading(false);
            })

          })
        }
        onCancel={() => {
          setOpen(false);
        }}
        confirmLoading={createLoading}
        okText={'确定'}
        cancelText={'取消'}
        width={550}>
        <Form
          layout="vertical"
          form={form}
          wrapperCol={{
            span: 24
          }}
          labelCol={{
            span: 6
          }}
          preserve={false}
        >
          <Form.Item
            label={'账号名'}
            rules={[
              { required: true, message: '请输入账号' },
              { validator: (rule, value) => validatorUsername(rule, value) }
            ]}
            name="name">
            <Input placeholder={'请输入账号名，限英文与数字'} disabled  size='large'/>
          </Form.Item>
          {
            edit ?
              <>
                <Form.Item
                  style={{marginBottom: 0}}
                  label={<div className={'required'}>角色</div>}>
                  <div style={{color:'#878789', marginBottom:10, fontSize:13}}>不同角色对应不同的访问权限，可以在用户管理-角色管理中创建新的角色</div>
                  <Form.Item
                    rules={[
                      { required: true, message: '请选择' }
                    ]}
                    name="roles">
                    <Select
                      mode={'multiple'}
                      allowClear
                      fieldNames={{ label: 'name', value: 'id' }}
                      options={roleList}
                      placeholder={'请选择账号角色'}
                      size='large'/>
                  </Form.Item>
                </Form.Item>
                <Form.Item
                  style={{marginBottom: 0}}
                  label={'班级'}>
                  <div style={{color:'#878789', marginBottom:10, fontSize:13}}>可为账号添加所属班级，方便批量管理。可以在用户管理-班级管理中创建新的班级组。</div>
                  <Form.Item
                    rules={[
                      { required: false, message: '请选择账号所属班级' }
                    ]}
                    name="groups">
                    <Select
                      options={groupList}
                      fieldNames={{ label: 'name', value: 'id' }}
                      placeholder={'请选择账号所属班级'}
                      mode={'multiple'}
                      allowClear
                      size='large'/>
                  </Form.Item>
                </Form.Item>
                <Form.Item label={'描述'} rules={[{ required: false, message: '' }]} name={'description'}>
                  <Input.TextArea
                    showCount
                    maxLength={100}
                    style={{ height: 80, resize: 'none' }}
                    placeholder={'添加账号描述，如姓名、职务、班级等'}
                  />
                </Form.Item>
              </> :
              <>
                <Form.Item
                  label={'新密码'}
                  rules={[
                    { required: true, message: '请输入新密码' },
                    { validator: (rule, value) => validatorPassword(rule, value) }
                  ]}
                  name="password">
                  <Input.Password autoComplete="new-password" placeholder={'请输入'} size='large'/>
                </Form.Item>
                <Form.Item
                  label={'确认新密码'}
                  rules={[
                    { required: true, message: '请再次输入新密码' },
                    { validator: (rule, value) => validatorPassword(rule, value) }
                  ]}
                  name="confirmPassword">
                  <Input.Password placeholder={'请输入'}  size='large'/>
                </Form.Item>
              </>
          }


        </Form>
      </Modal>


      <Modal
        title={<div><span><AccountSVG style={{transform: 'scale(.8)'}}/></span>批量创建账号</div>}
        centered
        closable={!createLoading}
        open={upload}
        destroyOnClose
        forceRender
        onOk={() =>
          uploadForm.validateFields().then(async () => {
            setCreateLoading(true);
            setProgressData(0);
            let formObj = new FormData();
            formObj.append('file', fileList[0]);


            const time = setInterval(() => {
              if (progressData < 99) {
                progressData = progressData + 3
                setProgressData(_.cloneDeep(progressData))
              }
            }, 1500)
            AccountServices.uploadAccount(formObj).then((res) => {
              if(res?.errMsg){
                message.error(res?.errMsg);
              }else{
                clearInterval(time);
                setProgressData(100);
                setTimeout(() => {
                  setProgressData(null);
                  setUpload(false);
                  setFileList([]);
                  refreshCallBack();
                  setCreateLoading(false);
                  message.success('批量账号创建成功！');
                }, 1000)
              }
            }).catch(() => {
              setCreateLoading(false);
              setProgressData(null)
            })
          })
        }
        onCancel={() => {
          setUpload(false);
          setFileList([]);
        }}
        confirmLoading={createLoading}
        cancelButtonProps={{disabled:createLoading}}
        okText={'确定'}
        cancelText={'取消'}
        width={550}>
        <Form
          layout="vertical"
          form={uploadForm}
          wrapperCol={{
            span: 24
          }}
          labelCol={{
            span: 6
          }}
          preserve={false}
        >
          <Spin spinning={createLoading}
                percent={progressData}
                tip={<span style={{fontSize: 20}}>{`${progressData} %`}</span>}
                indicator={<Progress
                    trailColor={'#3C3C3C'}
                    status="active"
                    showInfo={false}
                    style={{ color: '#fff', width: '300px', transform: 'translateX(-50%)' }}
                    strokeColor={{ from: '#5A1FE8', to: '#193BE3' }}
                  />}>
            <Form.Item
              label={'下载模版'}
              name={'model'}
              rules={[{ required: false, message: '' }]}>
              <Button onClick={() => {
                // 创建虚拟的a标签
                const link = document.createElement('a');
                link.href = '/files/import.csv'; // 文件路径
                link.download = 'import.csv'; // 下载后的文件名
                link.click(); // 触发点击事件
                link.remove(); // 移除标签

              }}><DownloadOutlined /> 下载模版</Button>
            </Form.Item>
            <Form.Item
              label={'选择文件'}
              name={'file'}
              rules={[{ required: true, message: '请选择文件' }]}>
              <Dragger {...fileProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击上传，或拖拽文件至此处</p>
                <p className="ant-upload-hint" style={{margin: 0}}>最多支持上传1个文件，支持.csv格式</p>
              </Dragger>
            </Form.Item>
          </Spin>

        </Form>
      </Modal>
    </BaseComponent>
  );
};

export default Account;
