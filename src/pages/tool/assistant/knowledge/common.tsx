/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import * as styles from './style.less';
import { Badge, message, Spin, Tooltip } from 'antd';
import UserSVG from '@src/assets/images/student/user.svg';
import TimeSVG from '@src/assets/images/student/time.svg';
import FileSvg from '@src/assets/images/tool/assistant/file.svg';
import { useNavigate } from 'react-router-dom';
import * as AssistantServices from '@src/services/tool/assistant';
import stateStorage from '@src/storage/stateStorage';
import dayjs from 'dayjs';

const CommonKnowledge: React.FC = () => {
  const navigate = useNavigate();
  const [kbList, setKbList] = useState([]);
  const [loading, setLoading] = useState(false);


  /**
   * @desc 获取知识库
   * */
  const getKBListHandle = () => {
    AssistantServices.getKBbyUserId({userId: stateStorage.get('userInfo').id, appendKB: 'publicKB,groupedKB'}).then((res) => {
      setKbList(res);
      setLoading(false);
    }).catch(() => setLoading(false))
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
            kbList?.map((item) => {
              return (
                <Badge.Ribbon key={item?.kb_id} text={item?.is_private ? '班级' : '公共'} placement={'start'}
                              className={`${item?.is_private ? styles.class : styles.public}`}>
                  <div
                    key={item?.kb_name}
                    className={styles.item}
                    onClick={() => {
                      if(item?.username ==='build-in'){
                        message.warning('系统默认知识库，不可以操作！')
                      }else if(item?.user_id !== stateStorage.get('userInfo')?.id){
                        message.warning('非您创建的知识库，不可以操作！')
                      }else{
                        navigate(`/assistant/knowledgeDetail/${item?.kb_id}`, {state:{user_id:item?.user_id, type: '1'}})
                      }
                    }}>
                    <div className={`${styles.top} ${item?.is_private ? styles.classFile : styles.publicFile}`}>
                      <div className={styles.right}>
                        <div className={styles.title}>
                          {item?.kb_name}
                        </div>
                        <Tooltip title={item?.kb_info} className={styles.description}>
                          {item?.kb_info}
                        </Tooltip>
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
    </div>
  );
};

export default CommonKnowledge;
