/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { checkKeystonePassword } from '@src/utils/regular';
import * as GroupServices from '@src/services/user/group';
import * as RoleServices from '@src/services/user/role';

const CreateAccount = (props) => {
  const form = props.form;
  const [roleList, setRoleList] = useState([]);
  const [groupList, setGroupList] = useState([]);
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
    getGroupListHandle()
    getRoleListHandle();
  }, []);

  return (
    <Form.Item shouldUpdate={() => true} noStyle>
      {({  }) => (
        <>
          <Form.Item
            label={'账号名'}
            rules={[
              { required: true, message: '请输入账号' },
              { validator: (rule, value) => validatorUsername(rule, value) }
            ]}
            name="name">
            <Input placeholder={'请输入账号名，限英文与数字'}  size='large'/>
          </Form.Item>
          <Form.Item
            label={'密码'}
            rules={[
              { required: true, message: '请输入密码' },
              { validator: (rule, value) => validatorPassword(rule, value) }
            ]}
            name="password">
            <Input.Password autoComplete="new-password" placeholder={'请输入'} size='large'/>
          </Form.Item>
          <Form.Item
            label={'确认密码'}
            rules={[
              { required: true, message: '请再次输入密码' },
              { validator: (rule, value) => validatorPassword(rule, value) }
            ]}
            name="confirmPassword">
            <Input.Password placeholder={'请输入'}  size='large'/>
          </Form.Item>
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

        </>
      )}
    </Form.Item>
  );
};
export default CreateAccount;
