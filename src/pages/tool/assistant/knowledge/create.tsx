/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import * as styles from './style.less';
import File01Img from '@src/assets/images/tool/assistant/file01.png';
import File02Img from '@src/assets/images/tool/assistant/file02.png';
import { Form, Input, Select, Radio } from 'antd';
import * as AssistantServices from '@src/services/tool/assistant';


const Create = (props:any) => {
  const {edit} = props;
  const [modelList, setModelList] = useState([]);


  /**
   * @desc 获取模型
   * */
  const getModelListHandle = () => {
    AssistantServices.getModels({}).then((res) => {
      setModelList(res?.data);
    })
  }

  useEffect(() => {
    getModelListHandle();
  }, []);

  return (
    <Form.Item shouldUpdate={() => true} noStyle>
      {() => (
        <>
          <Form.Item label={'知识库名称'} rules={[{ required: true, message: '请输入知识库名称'}]} name="kb_name">
            <Input placeholder={'请输入知识库名称，限英文与数字'} disabled={edit}  size='large'/>
          </Form.Item>
          <Form.Item label={'描述'} rules={[{ required: false, message: '' }]} name={'kb_info'}>
            <Input.TextArea
              showCount
              maxLength={100}
              style={{ height: 80, resize: 'none' }}
              placeholder={'添加知识库描述'}
            />
          </Form.Item>
          <div style={{display: 'flex', alignItems:'center', gap: 20}}>
            <Form.Item
              label={'向量库类型'}
              rules={[{ required: true, message: '请选择向量库类型'}]}
              style={{width: '50%'}}
              initialValue={'faiss'}
              name="vector_store_type">
              <Select
                placeholder={'请选择向量库类型'}
                fieldNames={{ label: 'vector_store_type', value: 'id' }}
                size='large'
                disabled={edit}
                options={[{vector_store_type: 'faiss', id: 'faiss'}]}/>
            </Form.Item>
            <Form.Item
              label={'Embeddings模型'}
              rules={[{ required: true, message: '请选择Embeddings模型'}]}
              style={{width: '50%'}}
              name="embed_model">
              <Select
                placeholder={'请选择Embeddings模型'}
                fieldNames={{ label: 'model_name', value: 'id' }}
                size='large'
                disabled={edit}
                options={modelList?.filter((item) => item.model_type === 'embedding')}/>
            </Form.Item>
          </div>
          <Form.Item
            label={'知识库可见范围'}
            rules={[{ required: true, message: ''}]}
            initialValue={false}
            name="is_private">
            <Radio.Group  disabled={edit} className={`${styles.boxRadio}  ${styles.bigRadio}`} style={{ marginBottom: '20px' }}>
              <Radio value={false}>
                <Radio.Button value={false}>
                  <img src={File01Img}/>
                  <div>公开知识库</div>
                </Radio.Button>
              </Radio>
              <Radio value={true}>
                <Radio.Button value={true}>
                  <img src={File02Img}/>
                  班级知识库
                </Radio.Button>
              </Radio>
              {/*<Radio value={2}>*/}
              {/*  <Radio.Button value={2}>*/}
              {/*    <img src={File03Img}/>*/}
              {/*    私有知识库*/}
              {/*  </Radio.Button>*/}
              {/*</Radio>*/}
            </Radio.Group>
          </Form.Item>
        </>
      )}
    </Form.Item>
  );
};
export default Create;
