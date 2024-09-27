/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import * as styles from './style.less';
import { Alert, Button, message, Modal, Spin } from 'antd';
import {PoweroffOutlined} from '@src/utils/antdIcon';
import stateStorage from '@src/storage/stateStorage';
import * as EnvironmentServices from '@src/services/tool/environment';
import * as DevicesServices from '@src/services/device/device';
import LoadingImg from '@src/assets/images/static/Loading.gif';
import { checkUserAuth } from '@src/utils';


let intervalTime:any = null;

const Index: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  // '' 未运行 Creating 创建中 Pending 排队(资源不足) 运行中 Running 运行中 Terminating 关闭中
  const [status, setStatus] = useState<string>('');
  const [sandboxName, setSandboxName] = useState<string>('');
  const [sandboxURL, setSandboxURL] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any>(null);
  const [cardData, setCardData] = useState<any>({});



  const getDevicesDetailHandle = () => {
    setLoading(true);
    clearInterval(intervalTime)

    /* 默认的设备类型 === 在菜单平台设置中进行配置的*/
    EnvironmentServices.getSandboxes({userName: stateStorage.get('userInfo')?.name}).then((res) => {
      setCardData(res?.sandboxes?.sandboxes || {});
    })

    DevicesServices.getDevicesDetail({name: stateStorage.get('userInfo')?.name}).then((res) => {
      setSourceData(res);
      if(!(res?.spec?.deviceStatus === 'Running' || res?.spec?.deviceStatus === 'default')){
        intervalTime = setInterval(() => getDevicesDetailHandle(), 5000);
      }
      setStatus(res?.spec?.deviceStatus || '');
      setSandboxName(res?.spec?.sandboxName || '');
      setSandboxURL(res?.spec?.sandboxURLs?.split(',') || []);
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
          metadata:{name: sourceData?.metadata?.name},
          spec:{}
        }, {name: sourceData?.metadata?.name}).then(() => {
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
          metadata:{name: sourceData?.metadata?.name},
          spec:{
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
    getDevicesDetailHandle();
    return () => clearInterval(intervalTime);
  }, []);

  return (
    <div className={styles.viewEnvironment}>
      <Spin spinning={loading}>
        <div className={styles.title}>实验环境</div>
        {
          Object.keys(cardData || {}).length > 0 &&
          <Alert
            message={
              status === '' ?
                '未运行' : (
                  status === 'Creating' ? `创建中 实验室环境创建中，当前排队数 ${sourceData?.spec?.lineNo || 0} 个` : (
                    status === 'Running' ? '运行中' : (
                      status === 'Pending' ? '排队(资源不足)' : '关闭中'
                    )
                  ))
            }
            type={
              status === '' ?
                'error' : (
                  status !== 'Running' ? 'warning' : 'success')
            }
            showIcon
          />
        }
        <div className={styles.content}>
          {
            Object.keys(cardData || {})?.map((key, index) => {
              return (
                <div className={styles.card} key={index}>
                  <div className={styles.name}>{key}</div>
                  <div className={styles.description}>{cardData[key].description}</div>
                  <div className={styles.componentInfo}>
                    <div>{sandboxName === key && status !== '' ? 'ports' : '组件信息'}</div>
                    {
                      (sandboxName === key && status !== '') ?
                        sandboxURL?.map((info) => {
                          return (
                            <a href={info}
                               key={info}
                               target={'_blank'}>{info}</a>
                          );
                        }) :
                        cardData[key]?.developmentInfo?.map((info) => {
                          return (
                            <p key={info}>{info}</p>
                          )
                        })
                    }
                  </div>
                  <div className={styles.status}>
                    {
                      sandboxName === key ? (
                        <>
                          {
                            status !== '' && <div className={styles.running}></div>
                          }
                          <span>
                            {
                              status === '' ?
                                '未运行' : (
                                  status === 'Creating' ? `创建中，当前排队数 ${sourceData?.spec?.lineNo || 0} 个` : (
                                    status === 'Running' ? '运行中' : (
                                      status === 'Pending' ? '排队(资源不足)' : '关闭中'
                                    )
                                  ))
                            }
                          </span>
                        </>
                      ) : '未运行'
                    }

                  </div>
                  {
                    checkUserAuth('deviceStudentView', 8) &&
                    <Button
                      className={styles.close}
                      size={'large'}
                      icon={<PoweroffOutlined/>}
                      disabled={sandboxName === '' ? false : (
                        !(sandboxName === key && (status === '' || status === 'Running' || status === 'Pending')))
                      }
                      onClick={() => {
                        sandboxName === '' ? openHandle(key) : (
                          !(status === '' || status === 'Terminating') && closeHandle(key) ||
                          status === '' && openHandle(key)
                        )
                      }}>
                      {
                        sandboxName !== key ? '开启实验环境' : (
                          (status === '' || status === 'Terminating') ? '开启实验环境' : '关闭实验环境'
                        )
                      }

                    </Button>
                  }

                  <i className={styles.icon}
                     style={{backgroundImage: `url(/studentImg/${cardData[key].icon_name})`}}></i>
                </div>
              );
            })
          }
        </div>
      </Spin>
    </div>
  );
};

export default Index;
