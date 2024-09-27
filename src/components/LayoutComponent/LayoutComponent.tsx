/**
 * @AUTHOR zhy
 * @DATE zhy (2022/04/18)
 * @Description:
 */
import {
  LogoutOutlined,
  UnlockOutlined
} from '@src/utils/antdIcon';
import stateStorage from '@src/storage/stateStorage';
import {Modal, MenuProps, message, Form, Input, Avatar, Dropdown, Alert} from 'antd';
import {
  Layout,
  Menu
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as styles from './style.less';
import {sourceRouterLists, getNewRouterList} from '@src/routers/routerLists';
import * as _ from 'lodash-es';
import { RootContext } from '@src/frame/rootContext';
import logo from '@src/assets/images/static/login_logo.png';
import LogoSVG from '@src/assets/images/static/logo.svg';
import CloseSVG from '@src/assets/images/menu/close.svg';
import OpenSVG from '@src/assets/images/menu/open.svg';
import { checkKeystonePassword } from '@src/utils/regular';
import * as CommonServices from '@src/services/common';
import Marquee from 'react-fast-marquee';
import ActionObj from '@src/frame/getNewReducer';

const { Header, Sider } = Layout;

function LayoutComponent() {
  // 全局state
  const pageState = ActionObj.Layout;
  const { dispatch, state } = useContext(RootContext); // 获取全局的数据

  const navigate = useNavigate();
  const routerParams = useParams();
  const [form]:any = Form.useForm();
  // 获取全局的数据
  // const { state } = useContext(RootContext);

  const [collapsed, setCollapsed] = useState(false);


  const [currentMenuList, setCurrentMenuList] = useState<any>([]);

  type MenuItem = Required<MenuProps>['items'][number];
  const location = useLocation();
  const { pathname } = location;

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [allKeys, setAllKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);



  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type
    } as MenuItem;
  }

  /**
   * @desc 切换用户中心下的菜单
   * @param {string} key  每个菜单的唯一标志key
   * */
  const moreOptionHandle = (event) => {
    if(event.key === 'logOut'){
      navigate('/login');
      stateStorage.clear();
    } else if (event.key === 'changePassword') {
      setPasswordOpen(true);
    }
  };

  /**
   * @desc 将routerList中的path + 参数 —— 转成浏览器路由形式
   * @param {string} path routerList中的path
   * @return {string} 转成浏览器路由形式
   * */
  const getCurrentPath = (path) => {
    Object.keys(routerParams).forEach((key) => {
      path = path?.replace(`:${key}`, routerParams[key]);
    });
    return path;
  };


  /***
   * @desc 左边新菜单
   * @param {Object} allMenuList 扁平化数据
   * @param {pathname} 当前url path
   * */
  const getNewMenuHandle = (allMenuList, pathname) => {
    let allOpenKeys:string[] = [];

    allMenuList?.map((menu: any) => {
      if(menu.rule()){
        if (getCurrentPath(menu.path) === pathname ) {
          if(menu.breadcrumbItem[0].path){
            setSelectedKeys([menu.breadcrumbItem[0].key])
          }else{
            setSelectedKeys([menu.breadcrumbItem[1].key])
          }
        }
      }
    });
    // 当前菜单结构
    let currentMenu:any = sourceRouterLists.filter((el) => el.path === '/')[0].children; //SlideMenuTitleList.filter((el: any) => el.key === currentKey)[0] || {};
    let currentItems: any = [];
    currentMenu.forEach((item: any) => {

      if(item.rule()){
        let array: any = [];
        if(item.items && !item.element){
          allOpenKeys.push(item.key);
          item.items.forEach((ol:any) => {
            if(ol.rule()){
              array.push(
                getItem(
                  <div
                    style={{display: 'flex', alignItems: 'center'}}
                    onClick={() => {
                      setSelectedKeys([ol.key]);
                      navigate(ol.path);
                    }}
                  >
                    {ol.label}
                  </div>,
                  ol.key
                )
              );
            }
          })
          currentItems.push(
            getItem(
              <div
                style={{display: 'flex', alignItems: 'center'}}
              >
                {item.label}
              </div>,
              item.key,
              item.icon,
              array
            )
          );
        }else{
          currentItems.push(
            getItem(
              <div
                style={{display: 'flex', alignItems: 'center'}}
                onClick={() => {
                  setSelectedKeys([item.key]);
                  navigate(item.path);
                }}
              >
                {item.label}
              </div>,
              item.key,
              item.icon
            )
          );
        }
      }
    })

    setCurrentMenuList(currentItems);
    setOpenKeys(collapsed ? [] : _.cloneDeep(allOpenKeys));
    setAllKeys(_.cloneDeep(allOpenKeys));
  };


  const editPasswordHandle = () => {
    form.validateFields().then(async (values) => {
      let params:any = {
        name: stateStorage.get('userInfo')?.name,
        id: stateStorage.get('userInfo')?.id,
        password: values.password
      };
      CommonServices.updateAccount(
        params, {userId:stateStorage.get('userInfo')?.id}
      )
        .then(() => {
          message.success('修改成功');
          stateStorage.set('password', values.password);
          setEditLoading(false);
          setPasswordOpen(false);
        })
        .catch((error) => {
          setEditLoading(false);
          message.success(error.error.message);
        });
    });
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
      password?.length > 0 &&
      type === 'confirm'
    ) {
      return Promise.reject('两次密码不一致');
    }
    return Promise.resolve();
  };


  useEffect(() => {
    const isLogin = Boolean(stateStorage.get('token'));
    if (isLogin) {
      if(pathname.startsWith('/classDetail/')) {
        dispatch(pageState.hiddenLeftMenu(true));
      }else{
        dispatch(pageState.hiddenLeftMenu(false));
      }
      let allMenuList = getNewRouterList().filter((item) => item.path === '/')[0]?.children;
      getNewMenuHandle(allMenuList, pathname);
    }else{
      pathname !== 'login' && navigate('/login');
    }

    }, [pathname]);



  const items:any = [
    {
      key: 'changePassword',
      icon: <UnlockOutlined style={{ fontSize: 16 }} />,
      label:'修改密码'
    },
    {
      key: 'logOut',
      icon: <LogoutOutlined style={{fontSize: 16}}/>,
      label: '退出登录'
    }
  ]

  return (
    <>
      <Layout style={{ height: '100vh' }}>
        <Layout>
          {!state.Layout.hiddenLeftMenu && (
            <Sider
              theme="light"
              width={256}
              collapsed={collapsed}
              style={{paddingBottom: 93}}
            >
              <div className={`${styles.allService} ${(collapsed && styles.centerAllService)}`}>
                {
                  collapsed ?
                    <LogoSVG /> :
                    <img src={logo || ''} alt="" style={{height: 26}}/>
                }

                <div
                  onClick={() => {
                    setCollapsed(!collapsed);
                    if(collapsed) setTimeout(() => setOpenKeys(allKeys), 100)
                  }}
                  className={`${styles.collapsed} `}>
                  {
                    collapsed ?
                      <CloseSVG /> :
                      <OpenSVG />
                  }
                </div>
              </div>
              {
                currentMenuList.length > 0 &&
                <Menu
                  mode="inline"
                  openKeys={openKeys}
                  onOpenChange={(kes) => {
                    setOpenKeys(_.cloneDeep(kes))
                  }}
                  selectedKeys={selectedKeys}
                  items={currentMenuList}
                />
              }

            </Sider>
          )}

          <Layout style={{borderRadius: 0, background: 'linear-gradient(180deg, #DBE1F4 0%, #F2F5FC 51%, rgba(219, 225, 244, 0.00) 100%), #F6F8FE' }}>

            <Header className={styles.header}>
              {
                pathname === '/' && <div style={{ width: '240px' }}></div>
              }

              <div className={styles.headerRight} style={pathname === '/' ? {width:'calc(100% - 240px)'} : {}}>
                {/*<Alert*/}
                {/*  // banner*/}
                {/*  style={{width: '60%', marginRight: 20}}*/}
                {/*  message={*/}
                {/*    <Marquee pauseOnHover gradient={false}>*/}
                {/*      您正在体验 openhydra 每日自动化部署环境，每天 {stateStorage.get('userInfo')?.name} 账号 id 会变化，请重新登陆保证正常功能!*/}
                {/*    </Marquee>*/}
                {/*  }*/}
                {/*/>*/}
                <Dropdown
                  menu={{
                    items,
                    onClick: moreOptionHandle
                }}
                  placement="bottomLeft"
                  arrow>
                  <Avatar style={{backgroundColor: '#f56a00', fontWeight:500, fontSize:20, cursor: 'pointer', verticalAlign: 'middle'}} size="large">
                    {stateStorage.get('userInfo')?.name.substring(0, 1).toUpperCase() || 'admin'}
                  </Avatar>
                </Dropdown>
              </div>
            </Header>

            <div style={{
              // position: "relative",
              padding: '50px 40px 40px 40px',
              overflow: 'hidden',
              height: 'calc(100vh - 56px)',
              borderRadius: 0
            }}>
              <Outlet/>
            </div>
          </Layout>
        </Layout>
      </Layout>
      <Modal
        title={'修改密码'}
        open={passwordOpen}
        onOk={editPasswordHandle}
        onCancel={() => {
          setPasswordOpen(false);
          form.resetFields();
        }}
        okText={'确认'}
        cancelText={'取消'}
        confirmLoading={editLoading}
      >
        <Form form={form} name={'editUser'} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          <Form.Item
            label={'新密码'}
            name="password"
            rules={[
              { required: true, message: ''},
              { validator: (rule, value) => validatorPassword(rule, value) }
            ]}
          >
            <Input.Password autoComplete="new-password" placeholder={'请输入新密码'} />
          </Form.Item>
          <Form.Item
            label={'确认新密码'}
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '' },
              { validator: (rule, value) => validatorPassword(rule, value, 'confirm') }
            ]}
          >
            <Input.Password placeholder={'请再次输入新密码'} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default LayoutComponent;
