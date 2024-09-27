/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import {InboxOutlined} from '@src/utils/antdIcon';
import { Form, Input, Upload, Radio } from 'antd';
import * as EnvironmentServices from '@src/services/tool/environment';
import stateStorage from '@src/storage/stateStorage';
const { Dragger } = Upload;

const UploadData = (props:any) => {
  const {fileList, setFileList, levelList} = props;
  const [cardData, setCardData] = useState<any>({});


  const fileProps = {
    maxCount: 1,
    accept: '.zip,.rar',
    onRemove: () => {
      setFileList(null);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList
  };

  const getSandbox = () => {
    EnvironmentServices.getSandboxes({userName: stateStorage.get('userInfo')?.name}).then((res) => {
      setCardData(res?.sandboxes?.sandboxes || {});
      props.form.setFieldsValue({sandboxName: Object.keys(res?.sandboxes?.sandboxes)[0]})
    })
  }

  useEffect(() => {
    getSandbox();
  }, []);

  return (
    <Form.Item shouldUpdate={() => true} noStyle>
      {() => (
        <>
          <Form.Item label={'课程名称'} rules={[{ required: true, message: '请输入课程资源名称'}]} name="name">
            <Input placeholder={'请输入课程资源名称'} size={'large'}/>
          </Form.Item>
          <Form.Item label={'课程难度'} initialValue={1} rules={[{ required: true, message: '请输入课程资源名称'}]} name="level">
            <Radio.Group >
              {
                levelList?.map((item) => {
                  return  <Radio key={item.id} value={item.id}>{item.name}</Radio>
                })
              }
            </Radio.Group>
          </Form.Item>
          <Form.Item label={'课程使用环境'} initialValue={Object.keys(cardData || {})[0]} name="sandboxName">
            <Radio.Group >
              {
                Object.keys(cardData || {})?.map((key) => {
                  return  <Radio key={key} value={key}>{key}</Radio>
                })
              }
            </Radio.Group>
          </Form.Item>

          <Form.Item label={'课程介绍'} rules={[{ required: false, message: '' }]} name={'description'}>
            <Input.TextArea
              showCount
              maxLength={500}
              style={{ height: 80, resize: 'none' }}
              placeholder={'添加详细的课程介绍，比如简介、面向对象、教学目标等'}
            />
          </Form.Item>

          <Form.Item
            label={'选择课程资源'}
            name={'file'}
            rules={[{ required: true, message: '请选择课程资源' }]}>

            <Dragger {...fileProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击上传，或拖拽文件至此处</p>
              <p className="ant-upload-hint" style={{margin: 0}}>最多支持上传1个文件，支持.zip格式</p>
            </Dragger>
          </Form.Item>
        </>
      )}
    </Form.Item>
  );
};
export default UploadData;
