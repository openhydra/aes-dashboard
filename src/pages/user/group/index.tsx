/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import BaseComponent from '@src/components/BaseComponent';
import { App, Button, Dropdown, Form, Input, Modal, Spin, Result, Empty } from 'antd';
import { colorList } from './constant';
import {
  DisconnectOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleFilled,
  PlusCircleFilled,
  TeamOutlined
} from '@src/utils/antdIcon';
import * as GroupServices from '@src/services/user/group';
import { Link } from 'react-router-dom';
import UserSVG from '@src/assets/images/user/user.svg';
import * as globals from '@src/assets/css/global.less';
import * as styles from './style.less';
import LoadingImg from '@src/assets/images/static/Loading.gif';
import { checkUserAuth } from '@src/utils';

const Group: React.FC = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [active, setActive] = useState('6750A4');
  const [hoverGroup, setHoverGroup] = useState(null);
  const [edit, setEdit] = useState(null);

  const getGroupListHandle = (count) => {
    GroupServices.getGroup({}).then((res) => {
      res?.map((item) => {
        let currentCount = count.filter((el) => el.id === item.id)[0];
        item.count = currentCount.count || 0;
      });
      setGroupList(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  };
  const getGroupSumCountHandle = () => {
    setLoading(true);
    GroupServices.getGroupSumCount({}).then((res) => {
      getGroupListHandle(res?.counts);
    });
  };

  const moreOptionHandle = (event) => {
    if (event.key === 'edit') {
      setEdit(hoverGroup);
      setOpen(true);
      form.setFieldsValue(hoverGroup);
      setActive(hoverGroup.tagColor);
    } else {
      Modal.confirm({
        title: '警告',
        icon: <ExclamationCircleFilled />,
        content: '您即将解散该班级群组，这将删除所有群组数据。此操作不可逆，确定继续吗？',
        onOk() {
          GroupServices.delGroup({ groupId: hoverGroup.id }).then(() => {
            message.success('解散成功');
            getGroupSumCountHandle();
          });
        },
        onCancel() {
          console.log('Cancel');
        }
      });
    }
  };

  useEffect(() => {
    getGroupSumCountHandle();
  }, []);


  const items: any = [
    checkUserAuth('group', 8) && {
      key: 'edit',
      icon: <EditOutlined style={{ fontSize: 16 }} />,
      label: '编辑'
    },
    checkUserAuth('group', 16) && {
      key: 'del',
      icon: <DisconnectOutlined style={{ fontSize: 16 }} />,
      label: '解散'
    }
  ];

  return (
    <BaseComponent pageName={'班级管理'} showBreadcrumb={false} description={'添加班级组群，对帐号进行批量管理'}>
      <Spin spinning={loading}>
        <div className={styles.view}>
          {
            checkUserAuth('group', 4) &&
            <Button
              type="primary"
              key="primary"
              className={globals.addBtn}
              style={{ position: 'absolute', right: 0, }}
              size={'large'}
              icon={<PlusCircleFilled style={{ fontSize: 22 }} />}
              onClick={() => {
                setOpen(true);
                setEdit(null);
                setActive('6750A4');
                form.resetFields();
                form.setFieldsValue({ tagColor: active });
              }}
            >
              创建班级
            </Button>
          }


          <div className={styles.content}>
            {
              groupList.length > 0 ?
                groupList?.map((item) => {
                  return (
                    <div className={styles.item}
                         key={item?.id}
                         onMouseEnter={() => setHoverGroup(item)}
                         onMouseLeave={() => setHoverGroup(null)}>
                      <div className={styles.header}
                           style={{ background: `${item?.tagColor ? colorList[item?.tagColor]?.background : colorList['6750A4']?.background}` }}>
                        <div className={styles.title}>
                          <div><UserSVG style={{ fill: `${item?.tagColor ? '#' + item?.tagColor : '#6750A4'}` }} />
                          </div>
                          <span>{item?.name}</span>
                        </div>
                        {
                          hoverGroup?.id === item?.id && (checkUserAuth('group', 16) ||checkUserAuth('group', 8))&&
                          <Dropdown
                            menu={{
                              items,
                              onClick: moreOptionHandle
                            }}
                            placement="bottomLeft"
                            arrow>
                            <EllipsisOutlined className={styles.ellipsis} />
                          </Dropdown>
                        }
                      </div>
                      <Link to={`/groupDetail/${encodeURI(item?.name)}`}
                            state={{ name: item?.name, id: item?.id }}
                      >
                        <div
                          className={styles.detail}
                          style={{
                            color: `${item?.tagColor ? '#' + item?.tagColor : '#6750A4'}`,
                            background: `${item?.tagColor ? colorList[item?.tagColor]?.content : colorList['6750A4']?.content}`
                          }}>
                          <div className={styles.description}>{item?.description || '暂无描述'}</div>
                          <div className={styles.bottom}>
                            <TeamOutlined style={{ fontSize: 14, marginRight: 4 }} />
                            <span>共{item.count}名成员</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                }) :
                <Result
                  style={{width: '100%'}}
                  icon={<Empty description={false} imageStyle={{height: 110}} /> }
                  title="这学校还没有一个班级，校长你要加油招生了"
                />
            }
          </div>
          <Modal
            title={<div><span><UserSVG
              style={{ transform: 'scale(1.3)', fill: '#5B46F6' }} /></span>{edit ? '编辑班级信息' : '创建班级'}</div>}
            centered
            open={open}
            destroyOnClose
            forceRender
            onOk={() =>
              form.validateFields().then(async (values) => {
                setCreateLoading(true);
                if (edit) {
                  values.id = edit.id;
                  GroupServices.updateGroup(values, { groupId: edit.id }).then((res) => {
                    if (res?.errMsg) {
                      message.error(res?.errMsg);
                    } else {
                      message.success(`班级 ${values.name} 编辑成功！`);
                    }
                    setOpen(false);
                    setCreateLoading(false);
                    setEdit(null);
                    getGroupSumCountHandle();
                  });
                } else {
                  GroupServices.addGroup(values).then((res) => {
                    if (res?.errMsg) {
                      message.error(res?.errMsg);
                    } else {
                      message.success(`班级 ${values.name} 创建成功！`);
                    }
                    setOpen(false);
                    setCreateLoading(false);
                    getGroupSumCountHandle();
                  });
                }

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
              <Form.Item label={'班级名称'}
                         rules={[{ required: true, message: '请输入班级名称' }]}
                         name="name">
                <Input placeholder={'请输入班级名称'} size={'large'} />
              </Form.Item>
              <Form.Item label={'描述'}
                         rules={[{ required: false, message: '' }]}
                         name={'description'}>
                <Input.TextArea
                  showCount
                  maxLength={100}
                  style={{ height: 80, resize: 'none' }}
                  placeholder={'添加班级描述'}
                  size={'large'}
                />
              </Form.Item>
              <Form.Item label={'班级标记颜色'}
                         rules={[{ required: true, message: '请选择班级标记颜色' }]}
                         name={'tagColor'}>
                <ul className={styles.tagColor}>
                  {
                    Object.keys(colorList || {})?.map((item) => {
                      return <li
                        key={item}
                        onClick={() => {
                          setActive(item);
                          form.setFieldsValue({ tagColor: item });
                        }}
                        style={{
                          borderColor: `${'#' + item}`,
                          background: `${colorList[item].content}`,
                          boxShadow: `${item === active ? colorList[item].boxShadow : 'none'}`
                        }}>
                        <div style={{
                          background: `${'#' + item}`
                        }}></div>
                      </li>;
                    })
                  }
                </ul>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Spin>
    </BaseComponent>
  );
};

export default Group;
