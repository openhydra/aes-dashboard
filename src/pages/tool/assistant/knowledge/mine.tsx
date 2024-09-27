/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import * as styles from './style.less';
import UserSVG from '@src/assets/images/student/user.svg';
import TimeSVG from '@src/assets/images/student/time.svg';
import FileSvg from '@src/assets/images/tool/assistant/file.svg';
import AddImage from '@src/assets/images/tool/knowledge/addKnowledge.png';
import KnSvg from '@src/assets/images/tool/knowledge/kn.svg';
import { Form, Modal, Badge, message, Tooltip, Spin } from 'antd';
import CardMoreCompontent from '@src/pages/tool/assistant/compontent/CardMoreCompontent';
import Create from '@src/pages/tool/assistant/knowledge/create';
import { ExclamationCircleFilled } from '@src/utils/antdIcon';
import * as AssistantServices from '@src/services/tool/assistant';
import stateStorage from '@src/storage/stateStorage';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { checkUserAuth } from '@src/utils';
const MineKnowledge: React.FC = () => {
  const [form]:any = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [kbList, setKbList] = useState([]);
  const [current, setCurrent] = useState(null);

  const moreOptionHandle = (key,data) => {
    if(key === 'edit'){
      setShowOpen(true);
      setEdit(true);
      setCurrent(data);
      form.setFieldsValue({...data})
    }else{
      Modal.confirm({
        title: '警告',
        icon: <ExclamationCircleFilled />,
        content: '您即将删除该知识库，这将删除所有知识库下的文件数据。此操作不可逆，确定继续吗？',
        onOk() {
          setLoading(true);
          AssistantServices.delKB({knowledgeBaseId: data?.kb_id}).then((res) =>{
            message.success(`知识库 ${data?.kb_name} 删除成功！`);
            getKBListHandle();
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }

  /**
   * @desc 获取知识库
   * */
  const getKBListHandle = () => {
    AssistantServices.getKBbyUserId({userId: stateStorage.get('userInfo').id}).then((res) => {
      setKbList(res);
      setLoading(false);
    })
  }

  useEffect(() => {
    setLoading(true);
    getKBListHandle();
  }, []);

  return (
    <div className={styles.commonView}>
      <Spin spinning={loading}>
        <div className={styles.detail_content}>
          {
            checkUserAuth('rag', 4) &&
            <div
              className={styles.itemAdd}
              onClick={() => {
                setShowOpen(true);
                setEdit(false);
                form.resetFields();
              }}>
              <img src={AddImage} />
              <div>新建知识库</div>
            </div>
          }
          {
            kbList?.map((item) => {
              return (
                <Badge.Ribbon key={item?.kb_id} text={item?.is_private ? '班级' : '公共'} placement={'start'}
                              className={`${item?.is_private ? styles.class : styles.public}`}>
                <div
                  className={styles.item}
                  onClick={() => {
                    if(item?.username ==='build-in'){
                      message.warning('系统默认知识库，不可以操作！')
                    }else if(item?.user_id !== stateStorage.get('userInfo')?.id){
                      message.warning('非您创建的知识库，不可以操作！')
                    }else{
                      navigate(`/assistant/knowledgeDetail/${item?.kb_id}`, {state:{user_id:item?.user_id}})
                    }
                  }}>
                  <div className={`${styles.top} ${item?.is_private ? styles.classFile : styles.publicFile}`}>
                    <div className={styles.right}>
                      <div className={styles.title}>
                        {item?.kb_name}
                        {
                          (checkUserAuth('rag', 8) || checkUserAuth('rag', 16)) &&
                          <CardMoreCompontent moreOptionHandle={moreOptionHandle} edit={checkUserAuth('rag', 8)} del={checkUserAuth('rag', 16)} data={item}/>
                        }
                      </div>
                      <div className={styles.description}>
                        {item?.kb_info}
                      </div>
                    </div>
                  </div>
                  <ul className={styles.mid}>
                    <li>
                      <span>向量库类型</span>
                      <span>{item?.vs_type}</span>
                    </li>
                    <li>
                      <span>Embeddings模型</span>
                      <span>{item?.embed_model}</span>
                    </li>
                  </ul>
                  <ul className={styles.bottom}>
                    <li>
                      <div><Tooltip title={item?.username}><UserSVG /><div>{item?.username}</div></Tooltip></div>
                      <div><TimeSVG />{dayjs(item?.create_time).format('YYYY.MM.DD')} 更新</div>
                    </li>
                    <li><FileSvg />包含 <strong>{item?.file_count || 0}</strong> 个文件</li>
                  </ul>
                </div>
              </Badge.Ribbon>
            )
          })
        }
      </div>
      </Spin>
      <Modal
        title={<div><span><KnSvg style={{ transform: 'scale(1)' }} /></span>{edit ? '编辑知识库' : '新建知识库'}</div>}
        open={showOpen}
        okText={edit ? '确认' : '创建'}
        cancelText={'取消'}
        onOk={() => {
          form.validateFields().then(async (values) => {
            setCreateLoading(true);
            if(edit){
              AssistantServices.updateKB({
                kb_id: current.kb_id,
                kb_info: values?.kb_info,
                is_private: values?.is_private
              }, {knowledgeBaseId: current?.kb_id}).then((res) => {
                if (res?.errMsg) {
                  message.error(res?.errMsg);
                } else {
                  message.success(`知识库 ${form.getFieldValue('kb_name')} 编辑成功！`);
                }
                setCreateLoading(false);
                setShowOpen(false);
                getKBListHandle();
              }).catch(() => setCreateLoading(false));
            }else{
              AssistantServices.createKB({
                ...values,
                user_id: stateStorage.get('userInfo')?.id
              }).then((res) => {
                if (res?.errMsg) {
                  message.error(res?.errMsg);
                } else {
                  message.success(`知识库 ${form.getFieldValue('kb_name')} 创建成功！`);
                }
                setCreateLoading(false);
                setShowOpen(false);
                getKBListHandle();
              }).catch(() => setCreateLoading(false));
            }


          })
        }}
        onCancel={() => setShowOpen(false)}
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
        >
          <Create edit={edit} />
        </Form>
      </Modal>
    </div>
  );
};

export default MineKnowledge;
