/**
 * @AUTHOR zhy
 * @DATE zhy (2022/1/28)
 * @Description:
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as styles from './style.less';
import { Button, Form, Input, message } from 'antd';
import * as LoginServices from '@src/services/login';
import { LockOutlined, UserOutlined} from '@src/utils/antdIcon';
import stateStorage from '@src/storage/stateStorage';
import { encode } from 'js-base64';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();


  const onSubmitHandle = (values: any) => {

    LoginServices.index({
      name:values.username?.trim(),
      password: values.password?.trim()
    }).then((res) => {
      stateStorage.set('token', encode(`${values.username}:${values.password}`));
      stateStorage.set('permission', res.permission);
      stateStorage.set('userInfo', {name: res.name, id: res.id, groups: res?.groups});
      navigate('/');
    }).catch((res) => message.error(res.message));
  };
  return (
    <div className={styles.view}>
      <div className={styles.left}>
        {/*<div className={styles.intro}>*/}
        {/*</div>*/}
      </div>
      <div className={styles.right}>
        <div className={styles.right_top}>
          <div>登录AI-Edu平台</div>
          <div>探索无界AI智能世界，畅享个性化学习体验</div>
        </div>
        <div className={styles.form}>
          <Form form={form} onFinish={onSubmitHandle}>

            <Form.Item
              label=""
              name="username"
              rules={[{required: true, message: '请输入用户名'}]}
              style={{marginBottom: 40}}
            >
              <Input
                prefix={<UserOutlined style={{ fontSize:22, color: 'rgba(0,0,0,.45)' }}/>}
                placeholder={'请输入用户名'}
                // className={styles.input}
                size={'large'}
              />
            </Form.Item>
            <Form.Item
              label=""
              name="password"
              rules={[{required: true, message: '请输入密码'}]}
              style={{marginBottom: 65}}
            >
              <Input.Password
                prefix={<LockOutlined style={{ fontSize:22, color: 'rgba(0,0,0,.45)' }} />}
                // className={styles.input}
                placeholder={'请输入密码'}
                size={'large'}
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                size={'large'}
                style={{
                  width: '100%',
                  height: '68px',
                  fontSize: '24px',
                  // backgroundColor: '#0953cc'
                }}
                type="primary"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.right_bottom}>{/*@{CMP} {version}*/}</div>
      </div>
    </div>
  );
};

export default Login;
