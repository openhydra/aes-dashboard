/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, {useEffect, useState, useRef} from 'react';
import BaseComponent from '@src/components/BaseComponent';
import { Form, Flex, Button, message, Input, InputNumber, Row, Col, Tag, Space, Spin, Tooltip } from 'antd';
import {PlusOutlined} from '@src/utils/antdIcon';
import * as SettingServices from '@src/services/device/setting';
import communicationImg from '@src/assets/images/static/communication.png';
import openhydraImg from '@src/assets/images/static/openhydra.png';
import * as styles from './style.less';
import dayjs from 'dayjs';
import LoadingImg from '@src/assets/images/static/Loading.gif';
import { checkUserAuth } from '@src/utils';

const Setting: React.FC = () => {
  const [formAddress] = Form.useForm();
  const [formParams] = Form.useForm();
  const [formIPAddress] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  // storage | runtimeResource | serverIp | gpuType
  const [editActive, setEditActive] = useState<any>('');
  const [versionDetail, setVersionDetail] = useState<any>({});
  // const [licenseDetail, setLicenseDetail] = useState<any>({});



  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef:any = useRef(null);
  const editInputRef:any = useRef(null);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  useEffect(() => {
    editInputRef?.current?.focus();
  }, [editInputValue]);
  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    updateInfo({gpu_resource_keys: newTags}, 'gpuType');
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      updateInfo({gpu_resource_keys: [...tags, inputValue]}, 'gpuType');
    }
    setInputVisible(false);
    setInputValue('');
  };
  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };
  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    updateInfo({gpu_resource_keys: newTags}, 'gpuType');
    setEditInputIndex(-1);
    setEditInputValue('');
  };
  const tagPlusStyle = {
    background: '#fff',
    color: '#5B5B5B',
    border: '1px dashed  #D9D9D9'
  };
  const tagInputStyle = {
    width: 280,
    marginInlineEnd: 8,
    verticalAlign: 'top',
    border: '1px solid #5B46F6'
  };


  const getDefaultSettingHandle = () => {
    setLoading(true);
    Promise.allSettled([
      SettingServices.getSetting(),
      SettingServices.getVersion({versionId: 'default'})
      // SettingServices.getLicenses({licenseId: 'default'})
    ]).then(([setting, version]) => {
      if(setting.status === 'fulfilled'){
        setDetail(setting.value[0]);
        formAddress.setFieldsValue(setting.value[0])
        formParams.setFieldsValue({
          ...setting.value[0],
          default_cpu_per_device : setting.value[0]?.default_cpu_per_device/1000
        })
        formIPAddress.setFieldsValue(setting.value[0])
        setTags(setting.value[0]?.gpu_resource_keys || [])
      }
      if(version.status === 'fulfilled'){
        setVersionDetail(version.value);
      }
      // if(license.status === 'fulfilled'){
      //   setLicenseDetail(license.value);
      // }
      setLoading(false);
    })
  }

  /**
   * @desc 更新参数
   * */
  const updateInfo = (values, type?:string) => {
    setLoading(true);
    if(editActive === 'runtimeResource'){
      values.default_cpu_per_device = values.default_cpu_per_device * 1000;
    }
    SettingServices.updateSetting(values, {settingId: 'default', saveSection: type || editActive})
      .then((res) => {
        if(res?.errMsg){
          message.success(res?.errMsg);
        }else{
          let msg = 'GPU支持品牌 修改成功';
          if(editActive == 'storage') msg = '存储地址 修改成功！';
          if(editActive == 'runtimeResource') msg = '设备运行参数 修改成功！';
          if(editActive == 'serverIp') msg = '服务IP地址 修改成功！';
          message.success(msg);
        }
        setEditActive('')
        setLoading(false);
        getDefaultSettingHandle();
      })
      .catch((err) => setLoading(false));
  };


  useEffect(() => {
    getDefaultSettingHandle();
  }, []);

  return (
    <BaseComponent pageName={'平台设置'} showBreadcrumb={false}>
      <Spin spinning={loading}>
        <div className={styles.content}>
          <div>
            <div className={styles.header}>
              <div className={styles.title}>存储地址</div>
              {
                checkUserAuth('setting', 8) &&
                <div className={styles.options}>
                  <Space>
                    {
                      editActive === 'storage' ?
                        <>
                          <Button onClick={() => {
                            formAddress.setFieldsValue(detail);
                            setEditActive('');
                          }}>取消</Button>
                          <Button
                            type={'primary'}
                            onClick={() => {
                              formAddress.validateFields().then((values) => {
                                updateInfo(values);
                              });
                            }}>保存</Button>
                        </> :
                        <Button onClick={() => setEditActive('storage')}>修改</Button>
                    }
                  </Space>
                </div>
              }
            </div>
            <Form
              layout={'vertical'}
              form={formAddress}
            >
              <Form.Item label="数据集" name="dataset_base_path">
                <Input size={'large'} disabled={editActive !== 'storage'} />
              </Form.Item>
              <Form.Item label="课程资源" name="course_base_path">
                <Input size={'large'} disabled={editActive !== 'storage'} />
              </Form.Item>
              <Form.Item label="工作目录" name="workspace_path">
                <Input size={'large'} disabled={editActive !== 'storage'} />
              </Form.Item>
            </Form>
          </div>
          <div>
            <div className={styles.header}>
              <div className={styles.title}>设备运行参数</div>
              {
                checkUserAuth('setting', 8) &&
                <div className={styles.options}>
                  <Space>
                    {
                      editActive === 'runtimeResource' ?
                        <>
                          <Button onClick={() => {
                            formParams.setFieldsValue({
                              ...detail,
                              default_cpu_per_device: detail?.default_cpu_per_device / 1000
                            })
                            setEditActive('');
                          }}>取消</Button>
                          <Button
                            type={'primary'}
                            onClick={() => {
                              formParams.validateFields().then((values) => {
                                updateInfo(values);
                              })
                            }}>保存</Button>
                        </> :
                        <Button onClick={() => setEditActive('runtimeResource')}>修改</Button>
                    }
                  </Space>
                </div>
              }
            </div>
            <Form
              layout={'inline'}
              form={formParams}
              labelCol={
                { span: 10 }
              }
            >
              <Row gutter={24}>
                <Col span={14} style={{ marginBottom: 20 }}>
                  <Form.Item label="设备使用CPU数量" name="default_cpu_per_device">
                    <InputNumber size={'large'} addonAfter="个" disabled={editActive !== 'runtimeResource'} />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="CPU超分比" name="cpu_over_commit_rate">
                    <InputNumber size={'large'} addonBefore="1 : " disabled={editActive !== 'runtimeResource'} />
                  </Form.Item>
                </Col>
                <Col span={14} style={{ marginBottom: 20 }}>
                  <Form.Item label="设备使用RAM数量" name="default_ram_per_device" initialValue={0}>
                    <InputNumber size={'large'} addonAfter="M" disabled={editActive !== 'runtimeResource'} />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="RAM超分比" name="memory_over_commit_rate" initialValue={0}>
                    <InputNumber size={'large'} addonBefore="1 : " disabled={editActive !== 'runtimeResource'} />
                  </Form.Item>
                </Col>
                <Col span={14} style={{ marginBottom: 20 }}>
                  <Form.Item label="设备使用GPU数量" name="default_gpu_per_device" initialValue={0}>
                    <InputNumber size={'large'} addonAfter="个" disabled={editActive !== 'runtimeResource'} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div>
            <div className={styles.header}>
              <div className={styles.title}>服务IP地址</div>
              {
                checkUserAuth('setting', 8) &&
                <div className={styles.options}>
                  <Space>
                  {
                    editActive === 'serverIp' ?
                      <>
                        <Button onClick={() => {
                          formIPAddress.setFieldsValue(detail)
                          setEditActive('');
                        }}>取消</Button>
                        <Button
                          type={'primary'}
                          onClick={() => {
                            formIPAddress.validateFields().then((values) => {
                              updateInfo(values);
                            })
                          }}>保存</Button>
                      </> :
                      <Button onClick={() => setEditActive('serverIp')}>修改</Button>
                  }
                </Space>
                </div>
              }
            </div>
            <Form form={formIPAddress}>
              <Form.Item label="" name="server_ip">
                <Input size={'large'} disabled={editActive !== 'serverIp'} />
              </Form.Item>
            </Form>
          </div>
          <div>
            <div className={styles.header}>
              <div className={styles.title}>GPU支持品牌</div>
            </div>
            <Flex gap="4px 0" wrap>
              {tags?.map((tag, index) => {
                if (editInputIndex === index) {
                  return (
                    <Input
                      ref={editInputRef}
                      key={tag}
                      size="small"
                      value={editInputValue}
                      onChange={handleEditInputChange}
                      onBlur={handleEditInputConfirm}
                      onPressEnter={handleEditInputConfirm}
                    />
                  );
                }
                const isLongTag = tag.length > 20;
                const tagElem = (
                  <Tag
                    key={tag}
                    closable={checkUserAuth('setting', 8)}
                    style={{
                      userSelect: 'none',
                    }}
                    onClose={() => handleClose(tag)}
                  >
                  <span
                    onDoubleClick={(e) => {
                      if (index !== 0) {
                        setEditInputIndex(index);
                        setEditInputValue(tag);
                        e.preventDefault();
                      }
                    }}
                  >
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </span>
                  </Tag>
                );
                return isLongTag ? (
                  <Tooltip title={tag} key={tag}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                );
              })}


              {inputVisible ? (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  style={tagInputStyle}
                  value={inputValue}
                  placeholder={'请填入GPU地址，如：nvidia.com/gpu'}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              ) : (
                checkUserAuth('setting', 8) ?
                <Tag icon={<PlusOutlined />} style={tagPlusStyle} onClick={showInput}>
                  新增支持的GPU品牌
                </Tag> : null
              )}
            </Flex>
          </div>
          <div>
            <div className={styles.header}>
              <div className={styles.title}>版本信息</div>
            </div>
            <div className={styles.version}>
              <div className={styles.left}>
                {/*<div>*/}
                {/*  <span>公司信息：</span>*/}
                {/*  <span>{licenseDetail?.company}</span>*/}
                {/*</div>*/}
                {/*<div>*/}
                {/*  <span>版本有效期：</span>*/}
                {/*  <span>{dayjs(licenseDetail?.end).format('YYYY/MM/DD   HH:mm:ss')}</span>*/}
                {/*</div>*/}
                <div>
                  <span>当前版本：</span>
                  <span>{versionDetail?.releaseVersion}</span>
                </div>
                <div>
                  <span>Git版本：</span>
                  <Tooltip title={versionDetail?.gitVersion}>{versionDetail?.gitVersion}</Tooltip>
                </div>
              </div>
              <div className={styles.right}>
                <div>
                  <img src={communicationImg} />
                  官方交流群
                </div>
                <div>
                  <img src={openhydraImg} />
                  OpenHydra
                  公众号
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </BaseComponent>
  );
};

export default Setting;
