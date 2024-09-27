/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React, { useEffect } from 'react';
import {InboxOutlined} from '@src/utils/antdIcon';
import { Form, Input, Upload } from 'antd';

const { Dragger } = Upload;

const UploadData = (props:any) => {
  const {fileList, setFileList, form} = props;


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


  useEffect(() => {
    form.resetFields();
    setFileList([]);
  }, []);

  return (
    <Form.Item shouldUpdate={() => true} noStyle>
      {() => (
        <>
          <Form.Item label={'数据集名称'} rules={[{ required: true, message: '请输入数据集名称'}]} name="name">
            <Input placeholder={'请输入'} size={'large'}/>
          </Form.Item>
          <Form.Item label={'描述'} rules={[{ required: false, message: '' }]} name={'description'}>
            <Input.TextArea
              showCount
              maxLength={100}
              style={{ height: 80, resize: 'none' }}
              placeholder={'添加数据集描述'}
              size={'large'}
            />
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
              <p className="ant-upload-hint" style={{margin: 0}}>最多支持上传1个文件，支持.zip格式</p>
            </Dragger>
          </Form.Item>


        </>
      )}
    </Form.Item>
  );
};
export default UploadData;
