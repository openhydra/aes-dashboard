/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, {useEffect, useRef, useState} from 'react';
import { useRequest } from 'ahooks';
import BaseComponent from '@src/components/BaseComponent';
import PublicTable from '@src/components/PublicTable';
import { Alert, message, Modal, Radio, Select, Space, Spin, Tooltip } from 'antd';
import { columns } from './constant';
import * as styles from './style.less';
import * as DevicesServices from '@src/services/device/device';
import DeviceSVG from "@src/assets/images/device/device.svg";
import LoadingImg from '@src/assets/images/static/Loading.gif';
import { checkUserAuth } from '@src/utils';
import stateStorage from '@src/storage/stateStorage';
import * as GroupServices from '@src/services/user/group';

let intervalTime:any = null;
const Device: React.FC = () => {
  const tableRef = useRef<any>(null);
  const [sourceData, setSourceData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [settingLoading, setSettingLoading] = useState(false);
  const [optionLoading, setOptionLoading] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<any>([]);
  const [groupList, setGroupList] = useState([]);
  const [group, setGroup] = useState(null);


  const [type, setType] = useState(0); // gpu 1 cpu 0
  const [sandboxName, setSandboxName] = useState(''); // vscode or jupyterlab
  const [gpuResource, setGpuResource] = useState(''); // nvidia.com/gpu

  const getDevicesHandle = (params) => {
    setIsLoading(true);
    DevicesServices.getDevices({
      ...params
    }).then((res) => {
      clearInterval(intervalTime)
      res?.items?.map((el, index) => (el.spec.deviceStatus = el?.spec?.deviceStatus || 'default', el.id = el.metadata.name + '_' +index));

      for(let item of res?.items || []){
        if(!(item.spec.deviceStatus === 'Running' || item.spec.deviceStatus === 'default')){
          setIsLoop(true);
          intervalTime = setInterval(() =>{
            getDevicesHandle(params);
          } , 5000);
          break;
        }
      }
      setSourceData(res);
      setIsLoading(false);
    })
  }

  /* 默认的设备配置*/
  const {
    data: flavorData,
    run: getFlavorHandle
  } = useRequest(() => DevicesServices.getFlavor({flavorId:'default'}), {manual: true});


  /**
   * 获取班级列表
   * */
  const getGroupListHandle = () =>{
    GroupServices.getGroup({}).then((res) => {
      setGroup(stateStorage.get('userInfo')?.groups?.map((item) => item.id));
      setGroupList(res);
      getDevicesHandle({group:stateStorage.get('userInfo')?.groups?.map((item) => item.id)});
    })
  }

  const openHandle = (record) => {
    getFlavorHandle();
    setShowOpen(true);
    setCurrentDevice([record]);
  };
  const closeHandle = (record) => {
    Modal.confirm({
      title: '关闭设备',
      content: '确定关闭当前设备吗',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        DevicesServices.delDevices({
          metadata: { name: record?.metadata?.name },
          spec: {}
        }, { name: record?.metadata?.name }).then(() => {
          message.success('关闭成功');
          getDevicesHandle({group: group});
        });
      }
    });
  };
  useEffect(() => {
    getGroupListHandle()
    getFlavorHandle();

    return () => clearInterval(intervalTime);
  }, []);

  return (
    <BaseComponent pageName={'设备管理'} showBreadcrumb={false}>
      <Spin spinning={optionLoading}>
        <div  className={styles.device}>
          <Alert
            message={
              <div>
                <span>设置使用情况</span>
                <span style={{
                  fontWeight: 'bold',
                  fontSize: 16
                }}> {flavorData?.sumUps?.spec?.podAllocated} / {flavorData?.sumUps?.spec?.podAllocatable} </span>
                <span>  &nbsp; GPU占用</span>
                <span style={{
                  fontWeight: 'bold',
                  fontSize: 16
                }}> {flavorData?.sumUps?.spec?.gpuAllocated} / {flavorData?.sumUps?.spec?.gpuAllocatable}</span>
              </div>
            }
            type={'info'}
            showIcon
            style={{ marginBottom: 20 }} />
          <PublicTable
            ref={tableRef}
            dataSource={sourceData?.items || []}
            loading={isLoop ? false : isLoading}
            columns={columns(tableRef, openHandle, closeHandle)}
            modalSetting={false}
            buttonList={
              <Select
                options={groupList}
                value={group}
                fieldNames={{ label: 'name', value: 'id' }}
                placeholder={'请选择班级'}
                mode={'multiple'}
                style={{minWidth: 220}}
                onChange={(val) => {
                  setGroup(val)
                  getDevicesHandle(val.length > 0 ? {group:val}: null);
                }}
                allowClear
                size='large'/>
            }
            hiddenSearchOperate
            hasRowSelection={checkUserAuth('device', 8)}
            rowSelection={{
              getCheckboxProps: (record) => ({
                disabled: record?.spec?.deviceStatus === 'Terminating'
              }),
              // 判断某些状态下不可选择的提示
              renderCell(checked, record, index, node) {
                if (record?.spec?.deviceStatus === 'Terminating') {
                  return <Tooltip title={'关闭中，暂无法操作！'}>{node}</Tooltip>;
                }
                return node;
              }
            }}
            tableAlertOptionRender={({ selectedRows, onCleanSelected }) => (
              <Space>
                <a
                  onClick={() => {
                    Modal.confirm({
                      okText: '确定',
                      cancelText: '取消',
                      title: '批量关闭',
                      content: '确认要关闭所选服务吗？',
                      onOk: () => {
                        setOptionLoading(true);
                        let optionsList: any = [];
                        let nameList: any = [];
                        selectedRows.forEach((item) => {
                          nameList.push(item?.metadata?.name);
                          let canClose = item?.spec?.deviceStatus === 'default' || item?.spec?.deviceStatus === 'Terminating';
                          !canClose && optionsList.push(DevicesServices.delDevices({
                            metadata: { name: item?.metadata?.name },
                            spec: {}
                          }, { name: item?.metadata?.name }));
                        });
                        Promise.allSettled(optionsList).then(() => {
                          message.success(`实验环境 ${nameList.join(',')} 关闭成功`);
                          setOptionLoading(false);
                          getDevicesHandle({group:group});
                          onCleanSelected();
                        });
                      }
                    });
                  }}
                >
                  批量关闭
                </a>
                <a
                  onClick={() => {
                    Modal.confirm({
                      okText: '确定',
                      cancelText: '取消',
                      title: '批量开启',
                      content: '确认要开启所选服务吗？',
                      onOk: () => {
                        setCurrentDevice(selectedRows);
                        onCleanSelected();
                        setShowOpen(true);
                        getFlavorHandle();
                      }
                    });
                  }}
                >
                  批量开启
                </a>
              </Space>
            )}
          />
        </div>
      </Spin>

      <Modal
        title={<div><span><DeviceSVG style={{ transform: 'scale(1)' }} /></span>启动容器</div>}
        open={showOpen}
        okText={'启动'}
        cancelText={'取消'}
        onOk={() => {
          setSettingLoading(true);

          let optionsList: any = [];
          let nameList: any = [];
          currentDevice.forEach((item) => {
            nameList.push(item?.metadata?.name)
            let canOpen = item?.spec?.deviceStatus === 'default';

            canOpen && optionsList.push(DevicesServices.addDevices({
              metadata: {
                name: item?.metadata?.name
              },
              spec: {
                openHydraUsername: item?.metadata?.name,
                usePublicDataSet: true,
                deviceGpu: type === 1 ? 1 : undefined,
                sandboxName: sandboxName
              }
            }));
          });
          Promise.allSettled(optionsList).then(() => {
            message.success(`实验环境 ${nameList.join(',')} 开启成功`);
            setSettingLoading(false);
            setShowOpen(false);
            getDevicesHandle({group:group});
          });
        }}
        onCancel={() => setShowOpen(false)}
        confirmLoading={settingLoading}
        className={styles.openDevice}
      >
        <div className={styles.title}>处理器</div>
        <Radio.Group className={`${styles.boxRadio}  ${styles.bigRadio}`} style={{ marginBottom: '20px' }}
                     onChange={(e) => setType(e.target.value)} value={type}>
          <Radio value={0}>
            <Radio.Button value={0}>
              CPU 实验室
              <div>
               资源受限时可选，训练速度较慢但成本较低。
              </div>
            </Radio.Button>
          </Radio>
          <Radio value={1}>
            <Radio.Button value={1}>
              GPU 实验室
              <div>
                加速训练，适合大规模数据集和复杂模型。
              </div>
            </Radio.Button>
          </Radio>
        </Radio.Group>
        {
          type === 1 &&
          <>
            <div className={styles.title}>GPU品牌</div>
            <div className={styles.subTitle}>选择GPU品牌，可以在“平台配置”-“GPU支持品牌”中添加新的支持品牌</div>

            <Radio.Group
              onChange={(e) => setGpuResource(e.target.value)}
              value={gpuResource}
              style={{ marginBottom: '20px' }}>
              {
                Object.keys(flavorData?.sumUps?.spec?.gpuResourceSumUp || {})?.map((key) => {
                  let content = flavorData?.sumUps?.spec?.gpuResourceSumUp[key];
                  let allocatable = content.allocatable //可以分配的，如果 allocateable 是0 则表示没有这个显卡
                  let allocated = content.allocated //已经分配的
                  // allocated == allocatable 那么这个gpu 选择应该是灰色的代表没有资源可以用了
                  return allocatable === 0 ? null : <Radio value={key} key={key} disabled={allocated === allocatable}>{key}</Radio>

                })
              }
            </Radio.Group>
          </>
        }


        <div className={styles.title}>学习环境</div>
        <div className={styles.subTitle}>为深度学习实验选择适合的学习环境</div>

        <Radio.Group
          onChange={(e) => setSandboxName(e.target.value)}
          value={sandboxName}
          className={`${styles.boxRadio}`}
          style={{ marginBottom: '20px' }}>
          {
            Object.keys(flavorData?.plugin?.sandboxes || {})?.map((key) =>
              <Radio value={key} key={key}>
                <Radio.Button value={key}>
                  {key}
                </Radio.Button>
              </Radio>)
          }
        </Radio.Group>

      </Modal>
    </BaseComponent>
  );
};

export default Device;
