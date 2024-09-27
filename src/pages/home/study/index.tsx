/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React, { useEffect, useRef, useState } from 'react';
import { message, Modal, Spin, Tooltip } from 'antd';
import { CaretRightOutlined, PoweroffOutlined } from '@src/utils/antdIcon';
import * as styles from './style.less';
import class01Img from '@src/assets/images/tool/class01.png';
import class02Img from '@src/assets/images/tool/class02.png';
import Data01 from '@src/assets/images/student/data_01.png';
import Data02 from '@src/assets/images/student/data_02.png';
import Data03 from '@src/assets/images/student/data_03.png';
import ArrowSVG from '@src/assets/images/student/purple_arrow.svg';
import keras from '/public/studentImg/keras.png';
import PaddlePaddle from '/public/studentImg/PaddlePaddle.png';
import xedu from '/public/studentImg/easyTrain.png';
import UserSVG from '@src/assets/images/student/user.svg';
import TimeSVG from '@src/assets/images/student/time.svg';
import * as CourseServices from '@src/services/teacher/course';
import * as DataSetServices from '@src/services/teacher/data';
import * as EnvironmentServices from '@src/services/tool/environment';
import stateStorage from '@src/storage/stateStorage';
import * as DevicesServices from '@src/services/device/device';
import NoData from '@src/components/NoData/NoData';
import dayjs from 'dayjs';
import * as _ from 'lodash-es';
import { useNavigate } from 'react-router-dom';
import class03Img from '@src/assets/images/tool/class03.png';
import class04Img from '@src/assets/images/tool/class04.png';
import class05Img from '@src/assets/images/tool/class05.png';
import { levelList } from '@src/pages/tool/class/constant';
import LoadingImg from '@src/assets/images/static/Loading.gif';
import { checkUserAuth } from '@src/utils';

let intervalTime: any = null;

const classList=[class01Img, class02Img, class03Img, class04Img, class05Img];

const Index = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const swiperRef = useRef<any>(null);
  const swiperContentRef = useRef<any>(null);
  const [showArrow, setShowArrow] = useState<boolean>(false);
  const [courseList, setCourseList] = useState<any[]>([]);
  const [datasetList, setDatasetList] = useState<any[]>([]);
  const [cardData, setCardData] = useState<any>({});
  const [sourceData, setSourceData] = useState<any>(null);

  const moveSwiperHandle = (key: string) => {
    const allContent = swiperRef.current.offsetWidth;
    const boxContent = swiperContentRef.current.offsetWidth;
    const transform_translateX = swiperRef.current.style.transform;
    swiperRef.current.style.transition = '1s';
    if (key === 'left') {
      if (transform_translateX === '') {
        // 到最左边啦，不做处理
      } else {
        const currentX = Number(transform_translateX.split('translateX(-')[1].split('px)')[0]);
        if ((currentX - boxContent) > 0) {
          swiperRef.current.style.transform = `translateX(-${currentX - boxContent}px)`;
        } else {
          swiperRef.current.style.transform = '';
        }
      }
    } else {
      const currentX = transform_translateX.length > 0 ? Number(transform_translateX.split('translateX(-')[1].split('px)')[0]) : 0;

      //总长度 - 左侧隐藏的部分 - 滑动的盒子长度 > 盒子 ====》 可以再移动一个盒子长度
      if (allContent - currentX - boxContent >= boxContent) {
        swiperRef.current.style.transform = `translateX(-${currentX + boxContent}px)`;
      } else {
        // 右侧没有一个盒子长度了
        if (allContent - currentX - boxContent > 0) {
          swiperRef.current.style.transform = `translateX(-${allContent - boxContent}px)`;
        } else {

        }
      }
    }
  };

  const getDevicesDetailHandle = () => {
    clearInterval(intervalTime);

    /* 默认的设备类型 === 在菜单平台设置中进行配置的*/
    EnvironmentServices.getSandboxes({ userName: stateStorage.get('userInfo')?.name }).then((res) => {
      setCardData(res?.sandboxes?.sandboxes || {});
    });

    DevicesServices.getDevicesDetail({ name: stateStorage.get('userInfo')?.name }).then((res) => {

      if (!(res?.spec?.deviceStatus === 'Running' || res?.spec?.deviceStatus === 'default')) {
        intervalTime = setInterval(() => getDevicesDetailHandle(), 5000);
      }
      setSourceData(res);

    });
  };

  const getInitData = () => {
    setLoading(true);
    Promise.allSettled([
      CourseServices.getCourse({}),
      DataSetServices.getDatasets({})
    ]).then(([course, dataset]) => {
      if (course.status === 'fulfilled') {
        setCourseList(course.value.items);
      }
      if (dataset.status === 'fulfilled') {
        setDatasetList(dataset.value.items);
      }
      setLoading(false);
    });
  };


  const closeHandle = (key) => {
    Modal.confirm({
      title: '关闭实验环境',
      content: '确定关闭当前实验环境吗',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        DevicesServices.delDevices({
          metadata: { name: sourceData?.metadata?.name },
          spec: {}
        }, { name: sourceData?.metadata?.name }).then(() => {
          setLoading(false);
          message.success(`实验环境 ${key} 关闭成功`);
          getDevicesDetailHandle();
        });
      }
    });
  };
  const openHandle = (key) => {
    Modal.confirm({
      title: '开启实验环境',
      content: '确定开启当前实验环境吗',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        DevicesServices.addDevices({
          metadata: {
            name: sourceData?.metadata?.name
          },
          spec: {
            openHydraUsername: sourceData?.metadata?.name,
            usePublicDataSet: true,
            deviceGpu: 0,
            sandboxName: key
          }
        }).then(() => {
          setLoading(false);
          message.success(`实验环境 ${key} 开启成功`);
          getDevicesDetailHandle();
        });
      }
    });
  };


  useEffect(() => {
    getInitData();
    getDevicesDetailHandle();

    return () => clearInterval(intervalTime);
  }, []);

  return (
    <div className={styles.view}>
      <Spin spinning={loading}>
        <div className={styles.title} onClick={() => navigate('/course')}>精选课程</div>
        <div
          className={styles.swiper}
          onMouseOver={() => setShowArrow(true)}
          onMouseLeave={() => setShowArrow(false)}>
          {showArrow && courseList?.length > 0 &&
            <ArrowSVG className={styles.arrowLeft} onClick={() => moveSwiperHandle('left')} />}
          <div className={styles.swiperContent} ref={swiperContentRef}>
            {
              courseList?.length > 0 ?

                <div ref={swiperRef} id={'swiperRef'}>
                  {
                    courseList?.map((item, index) => {
                      return (
                        <div className={styles.item} key={index} onClick={() =>
                          navigate( `/classDetail/${item?.metadata?.name}/${ index % 5}`)}>
                          <div className={styles.img}>
                            <img src={classList[index % 5]} />
                          </div>
                          <div className={styles.cardTitle}>{item?.metadata?.name}</div>
                          <div className={styles.tag}>
                            <span>{levelList?.filter((el) => item?.spec?.level === el.id)[0]?.name}</span>
                          </div>
                          <div className={styles.bottom}>
                            <div><UserSVG />{item?.spec?.createdBy}</div>
                            <div><TimeSVG />{dayjs(item?.spec?.lastUpdate).format('YYYY.MM.DD')}</div>
                          </div>
                        </div>
                      );
                    })
                  }
                </div> :
                <div className={styles.noData}>
                  <NoData />
                </div>
            }
          </div>
          {showArrow && courseList?.length > 0 &&
            <ArrowSVG className={styles.arrowRight} onClick={() => moveSwiperHandle('right')} />}
        </div>
        <div className={styles.cardBottom}>
          <div className={styles.left}>
            <div className={styles.name}>实验数据集</div>
            {
              datasetList?.length > 0 ?
                <ul>
                  {
                    datasetList?.map((item, index) => {
                      return index < 3 ? (
                        <li key={index}>
                          <img src={index === 0 ? Data01 : (index === 1 ? Data02 : Data03)} />
                          <div>
                            <div>{item?.metadata?.name}</div>
                            <div><TimeSVG />{dayjs(item?.spec?.lastUpdate).format('YYYY.MM.DD')}</div>
                          </div>
                          {/*<Button type="default" icon={<DownloadOutlined />}  >*/}
                          {/*  下载*/}
                          {/*</Button>*/}
                        </li>
                      ) : null;
                    })
                  }
                </ul> :
                <div className={styles.noData}>
                  <NoData />
                </div>
            }

          </div>
          <div className={styles.right}>
            <div className={styles.name} onClick={() => navigate('/environment')}>快速启动</div>
            {
              Object.keys(cardData || {})?.length > 0 ?
                <ul>
                  {
                    Object.keys(cardData || {})?.map((key, index) => {
                      return index < 3 ? (
                        <li key={key}>
                          <img src={key === 'keras' ? keras : (key === 'PaddlePaddle' ? PaddlePaddle : xedu)} />
                          <div>
                            <div>{key}</div>
                            <div>
                              {
                                sourceData?.spec?.sandboxName === key && !(sourceData?.spec?.deviceStatus === '' || sourceData?.spec?.deviceStatus === 'Terminating') ?
                                sourceData?.spec?.sandboxURLs?.split(',')?.map((el) => {
                                  return <a href={el} target={'_blank'} key={el}>{el}</a>;
                                }):
                                  <Tooltip title={cardData[key]?.description}>
                                    {cardData[key]?.description}
                                  </Tooltip>
                              }

                            </div>
                          </div>
                          {
                            sourceData?.spec?.sandboxName === key ?
                              <div
                                className={`${checkUserAuth('deviceStudentView', 8) ? styles.disabled : ''} ${sourceData?.spec?.deviceStatus === ''
                                  ? styles.close : (sourceData?.spec?.deviceStatus === 'Terminating' ? styles.disabled : styles.running)}`}
                                onClick={() => {
                                  if(checkUserAuth('deviceStudentView', 8)){
                                    if(!(sourceData?.spec?.deviceStatus === '' || sourceData?.spec?.deviceStatus === 'Terminating')){
                                      closeHandle(key);
                                    }else if(sourceData?.spec?.deviceStatus === ''){
                                      openHandle(key)
                                    }
                                  }
                                }}>
                                <div>
                                  {
                                    sourceData?.spec?.deviceStatus === '' ?
                                      '未运行' : (
                                        sourceData?.spec?.deviceStatus === 'Creating' ? `创建中，当前排队数 ${sourceData?.spec?.lineNo || 0} 个` : (
                                          sourceData?.spec?.deviceStatus === 'Running' ? '运行中' : (
                                            sourceData?.spec?.deviceStatus === 'Pending' ? '排队(资源不足)' : '关闭中'
                                          )
                                        ))
                                  }
                                </div>
                                <Tooltip title={(sourceData?.spec?.deviceStatus === '' || sourceData?.spec?.deviceStatus === 'Terminating') ? '开启环境' : '关闭环境'} placement={'bottom'}>
                                  <div>
                                    {
                                      (sourceData?.spec?.deviceStatus === '' || sourceData?.spec?.deviceStatus === 'Terminating') ?
                                        <CaretRightOutlined style={{ color: _.isNil(sourceData?.spec?.sandboxName) && checkUserAuth('deviceStudentView', 8)  ? '#193BE3' : '#aaa', fontSize: 16 }} /> :
                                        <PoweroffOutlined style={{ color: checkUserAuth('deviceStudentView', 8) ? '#E06E9C' : '#aaa', fontSize: 16 }} />
                                    }
                                  </div>
                                </Tooltip>
                              </div> :
                              <div className={checkUserAuth('deviceStudentView', 8) ? (_.isNil(sourceData?.spec?.sandboxName) ? styles.close : styles.disabled) :  styles.disabled}
                                   onClick={() => checkUserAuth('deviceStudentView', 8) && _.isNil(sourceData?.spec?.sandboxName) && openHandle(key)}>
                                <div>未运行</div>
                                <Tooltip title={'开启环境'} placement={'bottom'}>
                                  <div>
                                    <CaretRightOutlined style={{ color: _.isNil(sourceData?.spec?.sandboxName) && checkUserAuth('deviceStudentView', 8) ? '#193BE3' : '#aaa', fontSize: 16 }} />
                                  </div>
                                </Tooltip>
                              </div>
                          }
                        </li>
                      ) : null;
                    })
                  }

                </ul> :
                <div className={styles.noData}>
                  <NoData />
                </div>
            }
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default Index;
