/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import * as styles from './style.less';
import { Tooltip } from 'antd';
import { ArrowLeftOutlined } from '@src/utils/antdIcon';
import RibbonImg from '@src/assets/images/teacher/detail.png';
import TitlePng from '@src/assets/images/tool/assistant/title.png';
import ArrowSvg from '@src/assets/images/tool/assistant/arrow.svg';
import FileSvg from '@src/assets/images/tool/assistant/file.svg';
import TimeSVG from '@src/assets/images/student/time.svg';
import UserSVG from '@src/assets/images/student/user.svg';
import * as AssistantServices from '@src/services/tool/assistant';
import dayjs from 'dayjs';

interface HomeProps {
  setActiveHandle?: any;
  setProblemsHandle?: any;
}

const Home = ({ setActiveHandle, setProblemsHandle }:HomeProps) => {
  const [quickStartData, setQuickStartData] = useState<any>({});
  const [knowledgeData, setKnowledgeData] = useState<any>([]);

  const getInitData = () => {
    Promise.allSettled([
      AssistantServices.getHomeKnowledge({}),
      AssistantServices.getHomeQuickStart({})
    ]).then(([knowledge, quickStart]) => {
      if(knowledge.status === 'fulfilled'){
        setKnowledgeData(knowledge.value);
      }
      if(quickStart.status === 'fulfilled'){
          setQuickStartData(quickStart.value);
        }
    })
  }

  useEffect(() => {
    getInitData();
  }, []);

  return (
    <div className={styles.view}>
      <div className={styles.contentBg}>
        <img src={RibbonImg} className={styles.ribbon} />
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
        <img src={TitlePng} className={styles.title} />
        <div
          className={styles.info}>你好！我是你的AI教学助教。你可以问任何与教学最佳实践或学校工作相关的问题。点击下方快速提问，也可以选择使用知识库帮助你获得更好的回答。你的问题越具体，我的回答就会越好。我今天能如何帮助你？
        </div>
      </div>
      <div className={styles.content}>
        <div>
          <div className={styles.line}>
            <span>快速提问</span>
          </div>
          <div className={styles.quickQuestion}>
            <div>
              <div className={styles.title}>课程开发与考题编写</div>
              <div className={styles.subTitle}>快速生成初步的教学大纲和相关教案，辅助教师出考试题、测试题和日常作业题
              </div>
              {
                quickStartData?.chatNoFiles?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={styles.detail}
                      onClick={() => {
                        setActiveHandle(2);
                        setProblemsHandle({
                          problem: item?.query
                        })
                      }}>
                      <div>{item?.query}</div>
                    </div>
                  )
                })
              }
            </div>
            <div>
              <div className={styles.title}>学习助手</div>
              <div className={styles.subTitle}>速读各类文档，帮你快速掌握文章核心思想</div>
              {
                quickStartData?.chatWithFiles?.map((item, index) => {
                  return (
                    <div key={index}
                         className={styles.detail}
                         onClick={() => {
                           setActiveHandle(2);
                           setProblemsHandle({
                             problem: item?.query,
                             files:item?.files
                           })
                         }}>
                      <div className={styles.clamp}>{item?.query}</div>
                      <ul>
                        {
                          item?.files?.map((el, index) => {
                            return <li key={index}><i>{el.split('.')[el?.split('.')?.length-1].startsWith('p') ? 'P' : (el.split('.')[el?.split('.')?.length-1].startsWith('doc') ? 'W': 'T')}</i><Tooltip title={el}>{el}</Tooltip></li>;
                          })
                        }

                      </ul>
                    </div>
                  )
                })
              }
            </div>
            <div>
              <div className={styles.title}>代码助手</div>
              <div className={styles.subTitle}>生成你需要的代码，或排查代码中的bug</div>
              {
                quickStartData?.codeAssist?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={styles.detail}
                      onClick={() => {
                        setActiveHandle(2);
                        setProblemsHandle({
                          problem: item?.query
                        })
                      }}>
                      <div>{item?.query}</div>
                    </div>
                  )
                })
              }
          </div>
          </div>
        </div>

        <div>
          <div className={styles.lineTwo}>
            <span>
              <span>推荐知识库</span>
            </span>
            <div onClick={() => setActiveHandle(4)}>
              查看知识库
              <ArrowSvg />
            </div>
          </div>
          <div className={styles.commonKnowledge}>
            {
              knowledgeData.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setActiveHandle(3);
                      setProblemsHandle({
                        kb: item
                      })
                    }} >
                    <div className={styles.right}>
                      <div className={styles.title}>
                        {item?.kb_name}
                        <div className={styles.tag}>公开</div>
                      </div>
                      <div className={styles.detail}>
                        <ul>
                          <li><Tooltip title={item?.username}><UserSVG /><div>{item?.username}</div></Tooltip></li>
                          <li><TimeSVG />{dayjs(item?.create_time).format('YYYY.MM.DD')} 更新</li>
                          <li><FileSvg />包含 <strong>{item?.file_count || 0}</strong> 个文件</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>


      </div>

    </div>
  );
};

export default Home;
