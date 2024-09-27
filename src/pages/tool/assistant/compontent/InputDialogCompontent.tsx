/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import * as styles from '../style.less';
import { notification, Upload, Button, Form, Input, InputNumber, Modal, Select, Tooltip, Slider, message } from 'antd';
import { PaperClipOutlined, PlusCircleFilled, QuestionCircleOutlined, SettingOutlined } from '@src/utils/antdIcon';

import SendSVG from '@src/assets/images/tool/dialog/send.svg';
import StopSVG from '@src/assets/images/tool/dialog/stop.svg';
import TopSVG from '@src/assets/images/tool/dialog/top.svg';
import SettingSVG from '@src/assets/images/tool/dialog/kn_setting.svg';
import * as AssistantServices from '@src/services/tool/assistant';


const InputDialogCompontent = (
  {
    type,
    form,
    kbList,
    kBValue,
    setKBValue,
    fileProps,
    scrollMove,
    canSendMessage,
    createNewConversations,
    sendChatHandle,
    stopChatHandle
  }) => {
  const [api, contextHolder] = notification.useNotification();
  const [createLoading, setCreateLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [baseOpen, setBaseOpen] = useState(false);
  const [value, setValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [modelList, setModelList] = useState([]);


  /**
   * @desc 获取模型
   * */
  const getModelListHandle = () => {
    AssistantServices.getModels({}).then((res) => {
      let newModels = res?.data?.filter((item) => item?.model_type !== 'embedding' ) || [];
      if(newModels.length >0 && form.getFieldValue('model')?.length === 0) {
        form.setFieldsValue({model: newModels[0]?.model_name})
      }
      setModelList(newModels);
    })
  }


  useEffect(() => {
    setValue('');
  }, [canSendMessage]);

  useEffect(() => {
    form.setFieldsValue({
      model: '',
      history_len: 10,
      temperature: 0.7,
      top_k:3,
      score_threshold: 0.5
    })
    getModelListHandle();
  }, [type]);

  useEffect(() => {
    setIsUploading(fileProps?.fileList?.length > 0 ? fileProps?.fileList[0]?.status === 'uploading': false);
  }, [fileProps?.fileList]);

  return (
    <div className={`${styles.inputDialog} ${fileProps?.fileList?.length > 0 ? styles.inputFileDialog : ''}`}>
      {contextHolder}
      <div className={styles.top}>
        <TopSVG onClick={() => scrollMove('top')}/>
        <TopSVG className={styles.bottom} onClick={() => scrollMove('bottom')}/>
      </div>
      <div className={styles.options}>
        <Tooltip title={'设置'}>
          <Button
            icon={<SettingOutlined style={{ fontSize: 20 }} />}
            className={styles.optionBtn}
            onClick={() => {
              setBaseOpen(true);
              getModelListHandle();
            }} />
        </Tooltip>
        {
          type === 2 ?
            <Tooltip title={'上传附件（只能上传一个文件，且不能超过10M）支持.txt .docx .jpg .md .pptx .pdf .csv格式'}>
              <Upload {...fileProps}>
                <Button
                  icon={<PaperClipOutlined style={{ fontSize: 20 }} />}
                  className={styles.optionBtn} />
                </Upload>
            </Tooltip> :
            <Select
              options={kbList}
              value={kBValue?.kb_id}
              onChange={(val, valItem) => {
                setKBValue(valItem);
              }}
              placement={'topLeft'}
              fieldNames={{ label: 'kb_name', value: 'kb_id' }}
              placeholder={'引用知识库'}
              className={styles.knSelect}
              size={'large'} />
        }
        <Tooltip
          title={
          type === 3 ? (
              kBValue ?
                (kBValue?.file_count > 0 ? '' : '当前知识库没有可用文件，暂不可对话') :
                '当前没有可引用的知识库，暂不可对话'
          ) : ''}>
          <Button
            type="primary"
            key="primary"
            disabled={!(type === 3 ? (kBValue && kBValue?.file_count > 0) : true)}
            className={`${styles.addBtn} ${type === 3 ? (kBValue && kBValue?.file_count > 0 ? '' : styles.disabled): ''}`}
            size={'large'}
            onClick={() => createNewConversations()}
            icon={<PlusCircleFilled style={{ fontSize: 22 }} />}
          >
            新建对话
          </Button>
        </Tooltip>
      </div>
      <Input.TextArea
        value={value}
        onChange={(e) => setValue(e?.target?.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            if(value.trim().length > 0) {
              setValue('');
              sendChatHandle(value);
            }
          }
        }}
        style={{ height: 90, resize: 'none', backgroundColor: '#fff', padding: '15px 40px 20px 20px' }}
        placeholder={'请输入你的问题'}
      />
      {
        canSendMessage ?
          <Tooltip title={
            value.trim().length > 0 ? (
              type===2 ? (
                isUploading ? '请等待文件上传' : ''
                  ): (
                kBValue ?
                  (kBValue?.file_count > 0 ? '' : '当前知识库没有可用文件，暂不可对话') :
                  '当前没有可引用的知识库，暂不可对话'
                )
              ) : '请先输入问题'
          }>
            <Button
              shape="circle"
              className={`${
                value.trim().length > 0 ? (
                  type===2 ? (
                    isUploading ? styles.disabledBtn : ''
                  ): (
                    kBValue && kBValue?.file_count > 0 ? '' : styles.disabledBtn
                  )
                ) : styles.disabledBtn} ${styles.sendBtn}`}
              onClick={() => {
                if(value.trim().length > 0 && !isUploading && type === 2) {
                  setValue('');
                  sendChatHandle(value);
                }
                if(value.trim().length > 0 && kBValue && kBValue?.file_count > 0 && type === 3) {
                  setValue('');
                  sendChatHandle(value);
                }
              }}
              icon={<SendSVG />} />
          </Tooltip> :
          <Button
            className={styles.stopBtn}
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => stopChatHandle()}>
            {hover && '停止生成'}
            <StopSVG />
          </Button>
      }




      <div className={styles.tips}>内容由AI模型生成，生成的内容不代表我们的态度或观点</div>

      <Modal
        title={<div><span><SettingSVG style={{ transform: 'scale(1)' }} /></span>{type === 2 ? '多功能对话设置' : '知识库对话设置'}</div>}
        open={baseOpen}
        okText={'确认'}
        cancelText={'取消'}
        onOk={() => {
          form.validateFields().then(async (values) => {
            message.success(type === 2 ? '多功能对话设置编辑成功!' : '知识库对话设置编辑成功!');
            setBaseOpen(false);
          })
        }}
        onCancel={() => setBaseOpen(false)}
        confirmLoading={createLoading}
        width={550}
      >
        <Form
          layout="vertical"
          form={form}
          wrapperCol={{
            span: 24
          }}
          labelCol={{
            span: 24
          }}
          preserve={false}
          className={styles.baseForm}
        >

          <Form.Item shouldUpdate={() => true} noStyle>
            {({getFieldValue, setFieldsValue}) => (
              <>
                <div className={styles.title}>基础设置</div>
                <Form.Item
                  label={'基础LLM模型'}
                  rules={[{ required: true, message: '请选择基础LLM模型' }]}
                  style={{ width: '50%' }}
                  initialValue={modelList?.length > 0 ? modelList[0]?.model_name : ''}
                  name="model">
                  <Select
                    style={{ width: '100%' }}
                    placeholder={'请选择基础LLM模型'}
                    fieldNames={{ label: 'model_name', value: 'id' }}
                    options={modelList}
                    size="large" />
                </Form.Item>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <Form.Item
                    label={
                      <div className={styles.subTitle}>
                        <div>
                          <div>
                            <span>温度</span>
                            <QuestionCircleOutlined
                              onClick={() => {
                                api.info({
                                  message: `温度`,
                                  description: `温度控制着生成的随机性。较高的温度值会增加文本的多样性和创造性，但可能会牺牲一些准确性或连贯性。`,
                                  placement: 'topRight',
                                  icon: <QuestionCircleOutlined style={{ color: '#5B46F6' }} />
                                });
                              }}
                              style={{ color: '#5B46F6', cursor: 'pointer' }} />
                          </div>
                          <div className={styles.en}>Temperature</div>
                        </div>
                        <InputNumber
                          min={0}
                          max={1}
                          step={0.1}
                          value={getFieldValue('temperature')}
                          defaultValue={0.7}
                          style={{width: 50}}
                          size={'small'}
                          onChange={(value) => setFieldsValue({ temperature: value })}
                        />
                      </div>
                    }
                    rules={[{ required: false, message: '请设置温度' }]}
                    style={{ width: '50%' }}
                    initialValue={0.7}
                    name="temperature">
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <div className={styles.subTitle}>
                        <div>
                          <div>
                            <span>历史对话轮数</span>
                            <QuestionCircleOutlined
                              onClick={() => {
                                api.info({
                                  message: `历史对话轮数`,
                                  description: `模型处理当前输入前所参考的对话轮次。历史对话轮数可以帮助模型回忆之前的对话，使上下文具有连贯性。但是历史对话轮数过大可能导致模型的负担加重，影响处理速度和效率。`,
                                  placement: 'topRight',
                                  icon: <QuestionCircleOutlined style={{ color: '#5B46F6' }} />
                                });
                              }}
                              style={{ color: '#5B46F6', cursor: 'pointer' }} />
                          </div>
                          <div className={styles.en}>History Dialogue Turns</div>
                        </div>
                        <InputNumber
                          min={0}
                          max={10}
                          step={1}
                          defaultValue={10}
                          value={getFieldValue('history_len')}
                          style={{width: 50}}
                          size={'small'}
                          onChange={(value) => setFieldsValue({history_len: value})}
                        />
                      </div>
                    }
                    rules={[{ required: false, message: '请设置对话轮数' }]}
                    style={{ width: '50%' }}
                    initialValue={10}
                    name="history_len">
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                    />
                  </Form.Item>
                </div>

                {
                  type === 3 &&
                  <>
                    <div className={styles.title}>知识库设置</div>
                    <Form.Item
                      label={
                        <div className={styles.subTitle}>
                          <div>
                            <div>
                              <span>匹配知识条数</span>
                              <QuestionCircleOutlined
                                onClick={() => {
                                  api.info({
                                    message: `匹配知识条数`,
                                    description: `模型检索语料返回的相关知识条数。对于事实性问题，建议1-2条精确的知识条目。对于需要综合多个信息源的问题，可能需要3-5条或更多的知识条目。`,
                                    placement: 'topRight',
                                    icon: <QuestionCircleOutlined style={{ color: '#5B46F6' }} />
                                  });
                                }}
                                style={{ color: '#5B46F6', cursor: 'pointer' }} />
                            </div>
                            <div className={styles.en}>Matched Knowledge Base Entries</div>
                          </div>
                          <InputNumber
                            min={0}
                            max={5}
                            step={1}
                            value={getFieldValue('top_k')}
                            defaultValue={3}
                            style={{width: 50}}
                            size={'small'}
                            onChange={(value) => setFieldsValue({ top_k: value })}
                          />
                        </div>
                      }
                      initialValue={3}
                      rules={[{ required: false, message: '请设置知识条数' }]}
                      name="top_k">
                      <Slider
                        min={0}
                        max={5}
                        step={1}
                      />
                    </Form.Item>
                    <Form.Item
                      label={
                        <div className={styles.subTitle}>
                          <div>
                            <div>
                              <span>知识匹配分数阈值</span>
                              <QuestionCircleOutlined
                                onClick={() => {
                                  api.info({
                                    message: `知识匹配分数阈值`,
                                    description: `设定的分数标准，帮助用户筛选出与问题最相关的信息。只有达到或超过这个分数的信息才会被用来回答问题。`,
                                    placement: 'topRight',
                                    icon: <QuestionCircleOutlined style={{ color: '#5B46F6' }} />
                                  });
                                }}
                                style={{ color: '#5B46F6', cursor: 'pointer' }} />
                            </div>
                            <div className={styles.en}>Knowledge Matching Score Threshold</div>
                          </div>
                          <InputNumber
                            min={0}
                            max={2}
                            step={0.1}
                            value={getFieldValue('score_threshold')}
                            defaultValue={0.5}
                            style={{width: 50}}
                            size={'small'}
                            onChange={(value) => setFieldsValue({ score_threshold: value })}
                          />
                        </div>
                      }
                      initialValue={0.5}
                      rules={[{ required: false, message: '请设置知识条数' }]}
                      name="score_threshold">
                      <Slider
                        min={0}
                        max={2}
                        step={0.1}
                      />
                    </Form.Item>
                  </>
                }
              </>
            )}
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default InputDialogCompontent;
