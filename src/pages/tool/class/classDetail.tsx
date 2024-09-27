
/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React, { useEffect, useContext, useState } from 'react';
import * as styles from './style.less';
import {RootContext} from "@src/frame/rootContext";
import ActionObj from '@src/frame/getNewReducer';
import {ArrowLeftOutlined, PoweroffOutlined} from "@src/utils/antdIcon";
import TimeSVG from '@src/assets/images/student/time.svg';
import UserSVG from '@src/assets/images/student/user.svg';
import * as ClassServices from '@src/services/tool/class';
import { useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {levelList, classList} from './constant';
import { Button, message, Modal, Spin } from 'antd';
import * as DevicesServices from '@src/services/device/device';
import stateStorage from '@src/storage/stateStorage';
import LoadingImg from '@src/assets/images/static/Loading.gif';
import { checkUserAuth } from '@src/utils';

// 全局state
const pageState = ActionObj.Layout;

let intervalTime: any = null;
const Class = () => {
  const routerParams = useParams();
  // const location = useLocation();
  const { dispatch } = useContext(RootContext); // 获取全局的数据
  const [loading, setLoading] = useState<boolean>(false);
  const [courseDetail, setCourseDetail] = useState<any>({});
  const [sourceData, setSourceData] = useState<any>(null);

  const getCourseDetailHandle = () => {
    setLoading(true)
    ClassServices.getCourseDetail({name: routerParams?.name}).then((res) => {
      setCourseDetail(res || []);
      setLoading(false);
    }).catch(() => setLoading(false))
  }
  const getDevicesDetailHandle = () => {
    clearInterval(intervalTime);
    DevicesServices.getDevicesDetail({ name: stateStorage.get('userInfo')?.name }).then((res) => {
      if (!(res?.spec?.deviceStatus === 'Running' || res?.spec?.deviceStatus === 'default')) {
        intervalTime = setInterval(() => getDevicesDetailHandle(), 5000);
      }
      setSourceData(res);
    });
  }



  const closeHandle = (key) => {
    Modal.confirm({
      title: '关闭课程环境',
      content: '确定关闭当前课程环境吗',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        DevicesServices.delDevices({
          metadata: { name: sourceData?.metadata?.name },
          spec: {}
        }, { name: sourceData?.metadata?.name }).then(() => {
          setLoading(false);
          message.success(`课程环境 ${key} 关闭成功`);
          getDevicesDetailHandle();
        });
      }
    });
  };
  const openHandle = (key) => {
    Modal.confirm({
      title: '开启课程环境',
      content: '确定开启当前课程环境吗',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        DevicesServices.addDevices({
          metadata: {
            name: sourceData?.metadata?.name,
          },
          spec: {
            openHydraUsername: sourceData?.metadata?.name,
            usePublicDataSet: true,
            deviceGpu: 0,
            sandboxName: key
          }
        }).then(() => {
          setLoading(false);
          message.success(`课程环境 ${key} 开启成功`);
          getDevicesDetailHandle();
        });
      }
    });
  };


  useEffect(() => {
    getCourseDetailHandle();
    getDevicesDetailHandle();
    return () => {
      clearInterval(intervalTime)
    }
  }, []);

  return (
    <div className={styles.classDetail}>
      <Spin spinning={loading}>
        <div className={styles.top}>
          <div className={styles.contentBg}>
            <div className={styles.content}>
              <a
                style={{verticalAlign: 'middle', marginRight: '12px'}}
                onClick={() => {
                  history.go(-1);
                }}
                className={styles.back}
              >
                <ArrowLeftOutlined className={styles.svg}/>
                <span>返回</span>
              </a>
              <div>
                <img src={classList[routerParams?.imgIndex || 0]} />
                <div className={styles.right}>
                  <div>
                    <div className={styles.title}>{courseDetail?.metadata?.name}</div>
                    <div className={styles.tag}>
                      <span>{levelList?.filter((el) => courseDetail?.spec?.level === el.id)[0]?.name}</span>
                    </div>
                    {/*{*/}
                    {/*  sourceData?.spec?.sandboxName &&*/}
                    {/*  sourceData?.spec?.sandboxURLs?.split(',').map((el) => {*/}
                    {/*    return <a href={el} target={'_blank'} key={el}>{el}</a>;*/}
                    {/*  })*/}
                    {/*}*/}
                    <div className={styles.bottom}>
                      <div><UserSVG />{courseDetail?.spec?.createdBy}</div>
                      <div><TimeSVG />{dayjs(courseDetail?.spec?.lastUpdate).format('YYYY.MM.DD')}</div>
                    </div>
                  </div>
                  {
                    checkUserAuth('deviceStudentView', 8) && (
                      sourceData?.spec?.sandboxName ?
                        <div>
                          <Button
                            type={'primary'}
                            icon={<PoweroffOutlined />}
                            disabled={(!(sourceData?.spec?.deviceStatus === '' || sourceData?.spec?.deviceStatus === 'Running' || sourceData?.spec?.deviceStatus === 'Pending'))}
                            onClick={() => {
                              if (!(sourceData?.spec?.deviceStatus === '' || sourceData?.spec?.deviceStatus === 'Terminating')) {
                                closeHandle(courseDetail?.spec?.sandboxName);
                              } else if (sourceData?.spec?.deviceStatus === '') {
                                openHandle(courseDetail?.spec?.sandboxName)
                              }
                            }}>
                            {
                              (sourceData?.spec?.deviceStatus === '' || sourceData?.spec?.deviceStatus === 'Terminating') ? '启动课程环境' : '关闭课程环境'
                            }
                          </Button>
                          {sourceData?.spec?.sandboxURLs &&
                            <div>
                              <span>访问地址</span>
                              {
                                sourceData?.spec?.sandboxURLs?.split(',').map((el) => {
                                  return <a href={el} target={'_blank'} key={el}>{el}</a>;
                                })
                              }
                            </div>
                          }
                        </div> :
                        <div>
                          <Button
                            type={'primary'}
                            disabled={false}
                            icon={<PoweroffOutlined />}
                            onClick={() => {
                              openHandle(courseDetail?.spec?.sandboxName);
                            }}>
                            启动课程环境
                          </Button>
                        </div>
                    )
                  }


                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.detail}>
          <div className={styles.title}>课程介绍</div>
          <div className={styles.content}>
            {courseDetail?.spec?.description}
          </div>
        </div>
      </Spin>
    </div>

  )
    ;
};

export default Class;
