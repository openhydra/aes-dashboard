/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React from 'react';
import {InboxOutlined} from '@src/utils/antdIcon';
import { Form, InputNumber, message, Upload } from 'antd';
import * as _ from 'lodash-es';
const { Dragger } = Upload;

const UploadFile = (props:any) => {
  const {fileList, setFileList} = props;


  const fileProps = {
    // maxCount: 1,
    multiple: true,
    accept: ".txt,.md,.json,.csv,.pdf,.docx,.png,.jpg,.jpeg,.pptx",
    onRemove: (file) => {
      setFileList(fileList.filter((item) => item.name !== file.name));
    },
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error(`上传的文件${file.name}必须小于10MB!`)
      }
      if((isLt10M || Upload.LIST_IGNORE) === true){
        fileList.push(file);
        setFileList(_.cloneDeep(fileList));
      }
      return false
    },
    fileList
  };

  return (
    <Form.Item shouldUpdate={() => true} noStyle>
      {() => (
        <>
          <Form.Item
            label={'选择文件'}
            name={'file'}
            rules={[{ required: true, message: '请选择文件' }]}>

            <Dragger {...fileProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击上传，或拖拽文件至此处</p>
              <p className="ant-upload-hint" style={{ margin: 0 }}>支持上传多个文件，支持.txt, .md, .json, .cvs, .pdf, .docx, .png, .jpg, .jpeg, .pptx格式</p>
            </Dragger>
          </Form.Item>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
            <Form.Item
              label={'单段文本最大长度'}
              rules={[{ required: true, message: '请输入单段文本最大长度' }]}
              style={{ width: '50%' }}
              initialValue={750}
              name="chunk_size">
              <InputNumber style={{width: '100%'}} placeholder={'请输入单段文本最大长度'} size='large' min={0}/>
            </Form.Item>
            <Form.Item
              label={'相邻文本重合长度'}
              rules={[{ required: true, message: '请输入相邻文本重合长度' }]}
              style={{ width: '50%' }}
              initialValue={150}
              name="chunk_overlap">
              <InputNumber style={{width: '100%'}} placeholder={'请输入相邻文本重合长度'} size='large' min={0} />
            </Form.Item>
          </div>


        </>
      )}
    </Form.Item>
  );
};
export default UploadFile;
