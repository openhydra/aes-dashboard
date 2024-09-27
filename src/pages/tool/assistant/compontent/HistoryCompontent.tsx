/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import * as styles from '@src/pages/tool/assistant/dialog/style.less';
import { Input, Modal, Space, message, Spin, Tooltip } from 'antd';
import ComImg from '@src/assets/images/tool/dialog/his_com.png';
import KnImg from '@src/assets/images/tool/dialog/his_kn.png';
import dayjs from 'dayjs';
import { DeleteOutlined, ExclamationCircleFilled } from '@src/utils/antdIcon';
import * as AssistantServices from '@src/services/tool/assistant';
import stateStorage from '@src/storage/stateStorage';


const { Search } = Input;

const HistoryCompontent = (
  {
    className,
    open,
    type,
    chatTitleCallBack,
    historyDetailCallBack,
    conversationInfo
  }) => {
  const [loading, setLoading] = useState(false);
  const [hoverId, setHoverId] = useState('');
  const [historyList, setHistoryList] = useState([]);
  const [sourceHistoryList, setSourceHistoryList] = useState([]);



  const delConversationHandle = (conversationId) => {
    Modal.confirm({
      title: '警告',
      icon: <ExclamationCircleFilled />,
      content: '您即将删除这条对话历史，这将删除其所有对话数据。此操作不可逆，确定继续吗？',
      onOk() {
        AssistantServices.delHistoryConversations({conversationId}).then((res) => {
          message.success('对话历史删除成功');
          getInitConversations();
        });
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  }

  const onSearch:any = (value, _e, info) => {
    setHistoryList(sourceHistoryList?.filter((item) => item?.name?.includes(value)));
  }

  /**
   * @desc 查看历史对话，若有存在历史
   * */
  const getInitConversations = () => {
    setLoading(true);
    AssistantServices.getHistoryConversations({userId: stateStorage.get('userInfo').id, chatType: type===2?'llm_chat,file_chat': 'kb_chat'}).then((res) => {
      setHistoryList(typeof res === "object" && res?.length > 0 ? res : []);
      setSourceHistoryList(res);
      setLoading(false);
      typeof res === "object" && res?.length > 0 && chatTitleCallBack(res?.filter((item) => item.id === conversationInfo?.id)[0]?.name);
    })
  }

  useEffect(() => {
    open && getInitConversations();
  }, [open, conversationInfo]);

  return (
    <div className={className}>
      <Spin spinning={loading}>
        {
          open &&
          <div className={styles.historyContent}>
            <div className={styles.title}>历史记录</div>
            <Search
              placeholder="搜索对话"
              size={'large'}
              className={styles.search}
              onSearch={onSearch}
              enterButton />
            <div className={styles.list}>
              {
                historyList?.length > 0 ?
                  historyList?.map((item) => {
                    return (
                      <div
                        key={item?.id}
                        className={`${styles.item} ${conversationInfo?.id === item.id ? styles.active : ''}`}
                        onClick={() => historyDetailCallBack(item)}
                        onMouseOver={() => setHoverId(item.id)}
                        onMouseLeave={() => setHoverId('')}>
                        <div className={styles.top}>
                          <div className={styles.title}>
                            {
                              type === 2 ?
                                <>
                                  <img src={ComImg} />
                                  多功能对话
                                </> :
                                <>
                                  <img src={KnImg} />
                                  知识库对话
                                </>
                            }

                          </div>
                          <div>{dayjs(item.create_time).format('MM月DD日')}</div>
                        </div>
                        <div className={styles.subTitle}>
                          <Tooltip title={item.name}>{item.name}</Tooltip>
                          {
                            item.id === hoverId && conversationInfo?.id !== item.id &&
                            <Space>
                              {/*<EditOutlined style={{ fontSize: 16 }} />*/}
                              <DeleteOutlined
                                style={{ fontSize: 16 }}
                                onClick={(e:any) => {
                                  e.stopPropagation();
                                  delConversationHandle(item.id)
                                }}
                              />
                            </Space>
                          }
                        </div>
                      </div>
                    )
                  }) :
                  <div className={styles.empty}>
                    <div className={styles.emptyContent}>
                      还没有任何历史记录
                    </div>
                  </div>
              }
            </div>
          </div>
        }
      </Spin>
    </div>
  );
};

export default HistoryCompontent;
