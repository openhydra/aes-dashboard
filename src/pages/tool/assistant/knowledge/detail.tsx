/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React, { useEffect, useRef, useState } from 'react';
import * as styles from './style.less';
import PublicTable from '@src/components/PublicTable';
import { message, Spin, Progress } from 'antd';
import { ArrowLeftOutlined, ExclamationCircleOutlined } from '@src/utils/antdIcon';
import { columns } from './constant';
import AccountSVG from '@src/assets/images/user/account.svg';
import UploadFile from './uploadFile';
import { useRequest } from 'ahooks';
import stateStorage from '@src/storage/stateStorage';
import { useLocation, useParams } from 'react-router-dom';
import * as AssistantServices from '@src/services/tool/assistant';
import * as _ from 'lodash-es';
import { checkUserAuth } from '@src/utils';


const KnowledgeDetail: React.FC = () => {
  const routerParams = useParams();
  const location = useLocation();
  const tableRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [fileList, setFileList] = useState<any>([]);
  const [kbDetail, setKbDetail] = useState<any>({});
  let [progressData, setProgressData] = useState<any>(null)

  // 初始化表格数据
  const {
    data: sourceData,
    loading: isLoading,
    run: paginationCallBack
  } = useRequest((params) => AssistantServices.getKBFile({
    knowledgeBaseId: routerParams?.kb_id
  }).then((res) => {
    return res?.data
  }), { manual: true });


  const getKBDetailHandle = () => {
    AssistantServices.getKBDetail({knowledgeBaseId:routerParams?.kb_id}).then((res) => {
      setKbDetail(res);
      setLoading(false);
    })
  }


  useEffect(() => {
    getKBDetailHandle();
    stateStorage.set('dialogActive', 4);
    stateStorage.set('kbActive', location?.state?.type || '2');
  }, []);

  return (
    <div className={styles.detailView}>
      <Spin spinning={loading}>
        <a
          style={{ verticalAlign: 'middle', marginRight: '12px' }}
          onClick={() => {
            history.go(-1);
          }}
          className={styles.back}
        >
          <ArrowLeftOutlined className={styles.svg} />
          <span>返回</span>
        </a>

        <div className={styles.content}>
          <div className={`${styles.top} ${!(location?.state?.user_id === stateStorage.get('userInfo')?.id && location?.state?.type !== '1' &&
            checkUserAuth('rag', 8)) ? styles.topNone: ''}`}>
            <div className={styles.title}>{kbDetail?.kb_name}</div>
            <ul className={styles.mid}>
              <li>
                <span>向量库类型</span>
                <span>{kbDetail?.vs_type}</span>
              </li>
              <li>
                <span>Embeddings模型</span>
                <span>{kbDetail?.embed_model}</span>
              </li>
            </ul>
          </div>
          <div className={styles.table}>
            <PublicTable
              ref={tableRef}
              customRowKey={'No'}
              dataSource={sourceData || []}
              loading={isLoading}
              updateTable={paginationCallBack}
              columns={columns(tableRef, location?.state?.user_id, location?.state?.type)}
              hiddenSearchOperate
              hiddenDownloadOperate
              modalSetting={
                (location?.state?.user_id === stateStorage.get('userInfo')?.id &&
                  location?.state?.type !== '1' &&
                checkUserAuth('rag', 8)) ? {
                  creatButtonName: '上传知识文件',
                  modalTitle: <div><span><AccountSVG style={{transform: 'scale(.8)'}}/></span>上传知识文件</div>,
                  formName: 'createAccount',
                  createLoading: createLoading,
                  okText:'将文件添加到知识库',
                  modalWidth: 550,
                  layoutConfig: {
                    labelWrap: true,
                    labelCol: {
                      span: 24
                    },
                    wrapperCol: {
                      span: 24
                    }
                  },

                  FormItems: (form) => <Spin spinning={createLoading}
                                             percent={progressData}
                                             tip={<span style={{fontSize: 20}}>{`${progressData} %`}</span>}
                                             indicator={<Progress
                                               trailColor={'#3C3C3C'}
                                               status="active"
                                               showInfo={false}
                                               style={{ color: '#fff', width: '300px', transform: 'translateX(-50%)' }}
                                               strokeColor={{ from: '#5A1FE8', to: '#193BE3' }}
                                             />}>
                    <UploadFile form={form} fileList={fileList} setFileList={setFileList}/>
                  </Spin>,
                  onSubmit: (values) => {
                    setCreateLoading(true);
                    setProgressData(0);
                    let formObj = new FormData();
                    fileList.forEach((item) => {
                      formObj.append('files', item);
                    })
                    formObj.append('kb_id', kbDetail?.kb_id);
                    formObj.append('kb_name', kbDetail?.kb_name);
                    formObj.append('chunk_overlap', values?.chunk_overlap);
                    formObj.append('chunk_size', values?.chunk_size);


                    const time = setInterval(() => {
                      if (progressData < 99) {
                        progressData = progressData + 3
                        setProgressData(_.cloneDeep(progressData))
                      }
                    }, 1500)
                    AssistantServices.uploadKBFile(formObj,{
                      knowledgeBaseId: kbDetail?.kb_id
                    }).then((res) => {
                      if (res?.errMsg) {
                        message.error(res?.errMsg);
                        setCreateLoading(false);
                      } else {
                        clearInterval(time);
                        setProgressData(100);
                        setTimeout(() => {
                          setProgressData(null);
                          setCreateLoading(false);
                          setFileList([]);
                          tableRef.current.closeCreateModal(true);
                          message.success(`知识文件 ${kbDetail?.kb_name} 上传成功！`);
                        }, 1000)
                      }
                    }).catch(() => {
                      setCreateLoading(false);
                      setProgressData(null)
                    })
                  }
                } : false
              }
              deleteModalSetting={{
                title: '删除知识文件',
                content: (
                  <>
                    <ExclamationCircleOutlined style={{ color: '#faad14' }} /> 确定删除所选知识文件？
                  </>
                ),
                deleteRun: (params) => {
                  setCreateLoading(true);
                  AssistantServices.delKBFile([params?.file_name],{
                    knowledgeBaseId: kbDetail?.kb_id
                  })
                    .then(() => {
                      message.success(`知识文件 ${params?.file_name} 删除成功!`);
                      setCreateLoading(false);
                      tableRef.current.closeDeleteModal(true);
                    })
                    .catch(() => tableRef.current.closeDeleteModal(true));
                }
              }}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default KnowledgeDetail;
