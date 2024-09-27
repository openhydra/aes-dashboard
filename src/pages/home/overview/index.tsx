
/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import { Button, Card, Radio, Spin, Tooltip } from 'antd';
import {SyncOutlined} from '@src/utils/antdIcon';
import * as styles from './style.less';
import * as echarts from 'echarts';
import LinkSVG from '@src/assets/images/home/link.svg';
import { getSummary } from '@src/services/home';
import { useNavigate } from 'react-router-dom';
import 'echarts-liquidfill';
import * as DevicesServices from '@src/services/device/device';
import NoData from '@src/components/NoData/NoData';
import dayjs from 'dayjs';
import LoadingImg from '@src/assets/images/static/Loading.gif';

let cpu_chart = null;
let memory_chart = null;
const Overview = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState<any>([]);
  const [deviceList, setDeviceList] = useState<any>([]);
  const [flavorData, setFlavorData] = useState<any>({});
  const [cpuActive, setCpuActive] = useState<any>(0);
  const [memoryActive, setMemoryActive] = useState<any>(0);
  const [summary, setSummary] = useState<any>(null);


  let waterColors = [
    // 单位、百分比、内部填充1、内部填充2、内部填充3、水色底1、水色上2、外圈
    ['#8492A6', '#1B86E9', '#E0EEFC', '#D4E8FA', '#B1D6F9', '#6CDEFC', '#429BF7', '#D4E8FA'],
    ['#7b42d2', '#9040bc', '#e2e7ff', '#a59efa', '#a59efa', '#9c94fb', '#6545ec', '#e2e7ff'],
    ['#fc3040', '#fc3040', '#E5EBFF', '#d3cefa', '#8640c5', '#7a43d4', '#da3568', '#a59efa'],
    ['#800004', '#610003', '#ffe7e2', '#ffcfc6', '#feb7aa', '#ff1a21', '#990005', '#ffcfc6'],
    // ['#ffbfaa', '#ffdfd4', '#ffdfd4', '#ff7b5a', '#ff5232', '#d11507', '#a51b0b', '#ff7b5a']
  ]
  const redrawChart = (newOption, myChart, myDom) =>{
    if (myChart) {
      // 销毁旧的图表实例
      myChart.dispose();

      // 重新初始化新的实例
      myChart = echarts.init(myDom);

      // 设置新的配置项
      myChart.setOption(newOption);
    }
  }


  const getCPUChart = (res) => {
    if(res){
      let cpu_dom: any = document.getElementById('cpu');
      if(cpu_dom){
        cpu_chart = echarts.init(cpu_dom);

        let totalCpuAllocatable = res.totalCpuAllocatable;
        let totalCpuRequestAllocated = res.totalCpuRequestAllocated;
        let totalCpuLimitAllocated = res.totalCpuLimitAllocated;
        // // 水球内部数据--蓝色
        let value =(totalCpuLimitAllocated/totalCpuAllocatable);

        let color = waterColors[0];
        if(value * 100 <= 50) color = waterColors[0]
        if(value * 100 > 50 && value * 100 < 81) color = waterColors[1]
        if(value * 100 > 80 && value * 100 <= 100) color = waterColors[2]
        if(value * 100 > 100) color = waterColors[3]
        let cpuOption = cpuActive === 0 ? {
          color: ["#5D92CF","#D3E0F0"],
          tooltip: {
            trigger: 'item'
          },
          legend: false,
          title: {
            text: '{a|' + ((totalCpuRequestAllocated/totalCpuAllocatable) *100).toFixed(2) + '%}\n' + '{b|资源占用率}',
            x: 'center',
            y: 'center',
            textStyle: {
              rich: {
                a: {
                  fontSize: 22,
                  color: '#000',
                  fontWeight: '600',
                },
                b: {
                  fontSize: 14,
                  color: '#C4C4C4',
                  fontWeight: '600',
                  padding: [10, 0, 0, 0],
                },
              }
            }
          },
          series: [
            {
              name: 'CPU分配情况',
              type: 'pie',
              radius: ['70%', '90%'],
              avoidLabelOverlap: false,
              padAngle: 1,
              itemStyle: {
                borderRadius: 10
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: 40,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: totalCpuRequestAllocated, name: '已分配的 CPU' },
                { value: totalCpuAllocatable - totalCpuRequestAllocated, name: '未分配的 CPU' },
              ]
            }
          ]
        } : {
          // 圆环内部文字
          title: [
            {
              text: '资源占用率',
              left: '50%',
              top: "55%",
              textAlign: 'center',
              textStyle: {
                fontSize: '14',
                color: color[0],//'#8492A6',
                textAlign: 'center',
              },
            },
            {
              text: (value * 100).toFixed(2) + '%',
              left: '50%',
              top: '33%',
              textAlign: 'center',
              textStyle: {
                fontSize: 28,
                color: color[1]
              },
            }
          ],
          series: [{
            type: 'liquidFill',
            radius: '88%',
            z: 6,
            center: ['50%', '50%'],
            amplitude: 6,
            backgroundStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  {
                    offset: 0,
                    color: color[2],
                  },
                  {
                    offset: 0.75,
                    color: color[3]
                  },
                  {
                    offset: 1,
                    color: color[4]
                  },
                ],
                globalCoord: false,
              },
            },
            color: [
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: color[5]
                  },
                  {
                    offset: 0,
                    color: color[6]
                  },
                ],
                globalCoord: false,
              },
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: color[5]
                  },
                  {
                    offset: 0,
                    color: color[6]
                  },
                ],
                globalCoord: false,
              },
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: color[5]
                  },
                  {
                    offset: 0,
                    color: color[6]
                  },
                ],
                globalCoord: false,
              },
            ],
            data: [value.toFixed(2) + 0.02,
              {
                value: value.toFixed(2) - 0.01,
                direction: 'left',
              },
              value.toFixed(2) - 0.01,
            ],
            label: {
              normal: {
                formatter: '',
              }
            },
            outline: {
              show: true,
              itemStyle: {
                borderWidth: 0,
              },
              borderDistance: 0,
            }
          },
            {
              //外发光
              type: 'pie',
              z: 1,
              zlevel: -1,
              radius: ['89%', '92%'],
              center: ['50%', '50%'],
              hoverAnimation: false,
              clockWise: false,
              itemStyle: {
                normal: {
                  borderWidth: 20,
                  color: color[7],
                },
              },
              label: {
                show: false,
              },
              data: [100],
            },
          ]
        };
        redrawChart(cpuOption, cpu_chart, cpu_dom);
      }
    }

  }
  const getMemoryChart = (res) => {
    if(res){
      let memory_dom: any = document.getElementById('memory');
      if(memory_dom){
        memory_chart = echarts.init(memory_dom);

        let totalRamAllocatable = res.totalRamAllocatable;
        let totalRamRequestAllocated = res.totalRamRequestAllocated;
        let totalRamLimitAllocated = res.totalRamLimitAllocated;
        // // 水球内部数据--蓝色
        let value = (totalRamLimitAllocated/totalRamAllocatable);

        let Ram_color = waterColors[0];
        if(value * 100 <= 50) Ram_color = waterColors[0];
        if(value * 100 > 50 && value * 100 < 81) Ram_color = waterColors[1];
        if(value * 100 > 80 && value * 100 <= 100) Ram_color = waterColors[2];
        if(value * 100 > 100) Ram_color = waterColors[3]

        let memoryOption = memoryActive === 0 ? {
          color: ["#3EDB44","#ccf3cd"],
          tooltip: {
            trigger: 'item'
          },
          legend: false,
          title: {
            text: '{a|' + ((totalRamRequestAllocated/totalRamAllocatable) * 100).toFixed(2) + '%}\n' + '{b|资源占用率}',
            x: 'center',
            y: 'center',
            textStyle: {
              rich: {
                a: {
                  fontSize: 22,
                  color: '#000',
                  fontWeight: '600',
                },
                b: {
                  fontSize: 14,
                  color: '#C4C4C4',
                  fontWeight: '600',
                  padding: [10, 0, 0, 0],
                },
              }
            }
          },
          series: [
            {
              name: '内存使用情况',
              type: 'pie',
              radius: ['70%', '90%'],
              avoidLabelOverlap: false,
              padAngle: 1,
              itemStyle: {
                borderRadius: 10
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: 40,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: totalRamRequestAllocated, name: '已用内存' },
                { value: totalRamAllocatable - totalRamRequestAllocated, name: '未用内存' },
              ]
            }
          ]
        } : {
          // 圆环内部文字
          title: [
            {
              text: '资源占用率',
              left: '50%',
              top: "55%",
              textAlign: 'center',
              textStyle: {
                fontSize: '14',
                color: Ram_color[0],//'#8492A6',
                textAlign: 'center',
              },
            },
            {
              text: (value * 100).toFixed(2) + '%',
              left: '50%',
              top: '33%',
              textAlign: 'center',
              textStyle: {
                fontSize: 28,
                color: Ram_color[1]
              },
            }
          ],
          series: [{
            type: 'liquidFill',
            radius: '88%',
            z: 6,
            center: ['50%', '50%'],
            amplitude: 6,
            backgroundStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  {
                    offset: 0,
                    color: Ram_color[2],
                  },
                  {
                    offset: 0.75,
                    color: Ram_color[3]
                  },
                  {
                    offset: 1,
                    color: Ram_color[4]
                  },
                ],
                globalCoord: false,
              },
            },
            color: [
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: Ram_color[5]
                  },
                  {
                    offset: 0,
                    color: Ram_color[6]
                  },
                ],
                globalCoord: false,
              },
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: Ram_color[5]
                  },
                  {
                    offset: 0,
                    color: Ram_color[6]
                  },
                ],
                globalCoord: false,
              },
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: Ram_color[5]
                  },
                  {
                    offset: 0,
                    color: Ram_color[6]
                  },
                ],
                globalCoord: false,
              },
            ],
            data: [value.toFixed(2) + 0.02,
              {
                value: value.toFixed(2) - 0.01,
                direction: 'left',
              },
              value.toFixed(2) - 0.01,
            ],
            label: {
              normal: {
                formatter: '',
              }
            },
            outline: {
              show: true,
              itemStyle: {
                borderWidth: 0,
              },
              borderDistance: 0,
            }
          },
            {
              //外发光
              type: 'pie',
              z: 1,
              zlevel: -1,
              radius: ['89%', '92%'],
              center: ['50%', '50%'],
              hoverAnimation: false,
              clockWise: false,
              itemStyle: {
                normal: {
                  borderWidth: 20,
                  color: Ram_color[7],
                },
              },
              label: {
                show: false,
              },
              data: [100],
            },
          ]
        };
        redrawChart(memoryOption, memory_chart, memory_dom);


      }
    }
  }

  const getInitChart = () => {
    let nodeChart_dom: any = document.getElementById('nodeChart');

    Promise.allSettled([
      getSummary({summaryType: 'default'}),
      DevicesServices.getDevices({}),
      DevicesServices.getFlavor({flavorId:'default'})
    ]).then(([summaryData, device, flavor]) => {

      if(summaryData.status === 'fulfilled'){
        let res = summaryData.value;
        setSummary(res);
        if(nodeChart_dom){
          let nodeChart_chart = echarts.init(nodeChart_dom);
          let nodeOption = {
            color: ["#5B46F6","#d3cefa"],
            tooltip: {
              trigger: 'item'
            },
            legend: false,
            title: {
              text: '{a|' + ((res?.totalNodesCanUse/res?.totalNodes) * 100).toFixed(2) + '%}\n' + '{b|节点可用率}',
              x: 'center',
              y: 'center',
              textStyle: {
                rich: {
                  a: {
                    fontSize: 22,
                    color: '#000',
                    fontWeight: '600',
                  },
                  b: {
                    fontSize: 14,
                    color: '#C4C4C4',
                    fontWeight: '600',
                    padding: [10, 0, 0, 0],
                  },
                }
              }
            },
            series: [
              {
                name: '节点使用情况',
                type: 'pie',
                radius: ['70%', '90%'],
                avoidLabelOverlap: false,
                padAngle: 1,
                itemStyle: {
                  borderRadius: 10
                },
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: false,
                    fontSize: 40,
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: [
                  { value: res?.totalNodes - res?.totalNodesCanUse, name: '已用节点数' },
                  { value: res?.totalNodesCanUse, name: '可用节点数' },
                ]
              }
            ]
          };
          redrawChart(nodeOption, nodeChart_chart, nodeChart_dom);
        }
        getCPUChart(res);
        getMemoryChart(res);
        //  GPU 分配情况
        let colors = [
          ["#3EDB44","#ccf3cd"],
          ["#5B46F6","#d3cefa"],
          ["#E06E9C","#FDE1F9"],
          ["#6750A4","#F3F1F8"],
          ["#5D92CF","#E5EBFF"],
          ["#C59D01","#FFF5ED"],
        ]

        Object.keys(res?.gpuResourceSumUp).forEach((key, index) => {
          let time = setInterval(() => {
            let key_dom: any = document.getElementById(key);
            if(key_dom){
              clearInterval(time);
              let key_chart = echarts.init(key_dom);
              let key_allocated = res?.gpuResourceSumUp[key]?.allocated;
              let key_allocatable = res?.gpuResourceSumUp[key]?.allocatable;
              let key_name =  key.split('.com/gpu')[0].toUpperCase();
              let keyOption = {
                color: colors[index],
                tooltip: {
                  trigger: 'item'
                },
                legend: false,
                title: {
                  text: '{c| '+ key_name +'} \n {a|' + (key_allocatable === 0 ? 0: Number(((key_allocated/key_allocatable) * 100).toFixed(2))) + '%}\n' + '{b|资源占用率}',
                  x: 'center',
                  y: 'center',
                  textStyle: {
                    rich: {
                      a: {
                        fontSize: 30,
                        color: '#000',
                        fontWeight: '600',
                        padding: [5, 0, 0, 0],
                      },
                      b: {
                        fontSize: 14,
                        color: '#C4C4C4',
                        fontWeight: '600',
                        padding: [10, 0, 0, 0],
                      },
                      c: {
                        fontSize: 14,
                        color: colors[index][0],
                        fontWeight: '600',
                      }
                    }
                  }
                },
                series: [
                  {
                    name: `${key_name}分配情况`,
                    type: 'pie',
                    radius: ['70%', '90%'],
                    avoidLabelOverlap: false,
                    padAngle: 1,
                    itemStyle: {
                      borderRadius: 10
                    },
                    label: {
                      show: false,
                      position: 'center'
                    },
                    emphasis: {
                      label: {
                        show: false,
                        fontSize: 40,
                        fontWeight: 'bold'
                      }
                    },
                    labelLine: {
                      show: false
                    },
                    data: [
                      { value: key_allocated, name: '已分配实例' },
                      { value: key_allocatable-key_allocated, name: '未分配实例' },
                    ]
                  }
                ]
              };
              redrawChart(keyOption, key_chart, key_dom);
            }
          }, 500)
        })
      }
      if(device.status === 'fulfilled'){
        device?.value?.items =  device?.value?.items?.filter((el, index) => el.spec.deviceStatus ==='Running') || [];
        setDeviceList(device?.value?.items);
      }
      if(flavor.status === 'fulfilled'){
        setFlavorData(flavor?.value)
      }
      setLoading(false);
    })
  }

  useEffect(() => {
    setLoading(true)
    getInitChart();
  }, []);
  useEffect(() => {
    getCPUChart(summary);
  }, [cpuActive]);

  useEffect(() => {
    getMemoryChart(summary);
  }, [memoryActive]);

  return (
    <div className={styles.view}>
      <Spin spinning={loading}>
        <div className={styles.viewContent}>

        <div className={styles.title}>
        <span className={styles.bg}>
          运行中的实验环境
          <div>
            {/*CPU占用 <strong>6 / 24</strong> &nbsp;*/}
            GPU占用 <strong>{flavorData?.sumUps?.spec?.gpuAllocated} / {flavorData?.sumUps?.spec?.gpuAllocatable}</strong>
          </div>
        </span>
          <span onClick={() => navigate('/device')}>查看设备管理 <LinkSVG /></span>
        </div>

        <div className={styles.running}>
          {
            deviceList.length > 0 ?
              deviceList.map((item) => {
                return (
                  <div className={styles.items} key={item?.metadata?.name}>
                    <div className={styles.top}>
                      <ul>
                        <li>
                          <span>账号</span>
                          <span>{item?.metadata?.name}</span>
                        </li>
                        {/*<li>*/}
                        {/*  <span>角色</span>*/}
                        {/*  <span>{item?.spec?.role}</span>*/}
                        {/*</li>*/}
                      </ul>
                      <div className={styles[item?.spec?.deviceType]}>{item?.spec?.deviceType}</div>
                    </div>
                    <ul>
                      <li>
                        <span>容器类型</span>
                        <span>{item?.spec?.deviceType + ' '+ item?.spec?.deviceNamespace}</span>
                      </li>
                      <li>
                        <span>环境名称</span>
                        <span>{item?.spec?.sandboxName}</span>
                      </li>
                      <li>
                        <span>快速跳转</span>
                        <div style={{minHeight: 50}}>
                          {
                            item?.spec?.sandboxURLs?.split(',').map((url) => {
                              return <a href={url} target="_blank" rel="noop" key={url}>{url}</a>;
                            })
                          }
                        </div>
                      </li>
                      <li>
                        <span>启动时间 </span>
                        <div className={styles.time}>
                          <span>{dayjs(item?.metadata?.creationTimestamp).format('YYYY/MM/DD   HH:mm:ss')}</span>
                          <span>已运行 {((new Date().getTime() - dayjs(item?.metadata?.creationTimestamp))/(1000*60*60)).toFixed(1)}h</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                )
              }):
              <div className={styles.noData}>
                <NoData />
              </div>
          }
        </div>

        <div className={styles.title}>
        <span>计算资源使用情况
          <Button onClick={() => getInitChart()} type="link" loading={false} style={{ color: '#5B46F6', fontSize: 16 }} icon={<SyncOutlined />}>
            刷新
          </Button>
        </span>
        </div>

        <div className={styles.resource}>
          <div className={styles.used}>
            <Card
              className={styles.card}
              actions={[
                <div className={styles.canUsed}>
                  <div>可用节点数</div>
                  <div>{summary?.totalNodesCanUse}</div>
                </div>,
                <div className={styles.all}>
                  <div>总节点数</div>
                  <div>{summary?.totalNodes}</div>
                </div>
              ]}
            >
              <Card.Meta
                title="节点使用情况"
                description={
                  <div id={'nodeChart'} className={styles.chart}></div>
                }
              />
            </Card>
            <Card
              className={styles.card}
              actions={[
                <div className={styles.canUsed}>
                  {
                    cpuActive === 0 ?
                      <Tooltip title={(summary?.totalCpuRequestAllocated || 0) + summary?.totalCpuUnit}>
                        <div>已分配的 CPU</div>
                        <div>{(summary?.totalCpuRequestAllocatedRaft || 0) + '个'}</div>
                      </Tooltip> :
                      <Tooltip title={(summary?.totalCpuLimitAllocated || 0) + summary?.totalCpuUnit}>
                        <div>超分配的 CPU</div>
                        <div>{(summary?.totalCpuLimitAllocatedRaft || 0) + '个'}</div>
                      </Tooltip>
                  }

                </div>,
                <Tooltip title={(summary?.totalCpuAllocatable || 0) + summary?.totalCpuUnit} className={styles.all}>
                  <div>CPU 总数</div>
                  <div>{(summary?.totalCpuAllocatableRaft || 0) + '个'}</div>
                </Tooltip>
              ]}
            >
              <Card.Meta
                title={
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>CPU分配情况</span>
                    <Radio.Group
                      defaultValue={0}
                      buttonStyle="solid"
                      size={'small'}
                      onChange={(e) => {
                        setCpuActive(e.target.value);
                      }}>
                      <Radio.Button value={0}>启动分配率</Radio.Button>
                      <Radio.Button value={1}>超分分配率</Radio.Button>
                    </Radio.Group>
                  </div>}
                description={
                  <div id={'cpu'} className={styles.chart}></div>
                }
              />
            </Card>
            <Card
              className={styles.card}
              actions={[
                <div className={styles.canUsed}>
                  {
                    memoryActive === 0 ?
                      <Tooltip title={(summary?.totalRamRequestAllocated || 0) + summary?.totalRamUnit}>
                        <div>已用内存</div>
                        <div>{(summary?.totalRamRequestAllocatedRaft || 0) + 'G'}</div>
                      </Tooltip> :
                      <Tooltip title={(summary?.totalRamLimitAllocated || 0) + summary?.totalRamUnit}>
                        <div>超分配内存</div>
                        <div>{(summary?.totalRamLimitAllocatedRaft || 0) + 'G'}</div>
                      </Tooltip>
                  }
                </div>,
                <Tooltip title={(summary?.totalRamAllocatable || 0) + summary?.totalRamUnit} className={styles.all}>
                  <div>内存总大小</div>
                  <div>{(summary?.totalRamAllocatableRaft || 0) + 'G'}</div>
                </Tooltip>
              ]}
            >
              <Card.Meta
                title={
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>内存使用情况</span>
                    <Radio.Group
                      defaultValue={0}
                      buttonStyle="solid"
                      size={'small'}
                      onChange={(e) => {
                        setMemoryActive(e.target.value);
                      }}>
                      <Radio.Button value={0}>启动分配率</Radio.Button>
                      <Radio.Button value={1}>超分分配率</Radio.Button>
                    </Radio.Group>
                  </div>}
                description={
                  <div id={'memory'} className={styles.chart}></div>
                }
              />
            </Card>
          </div>
          <div style={{ padding: '0px 40px 20px 40px' }}>
            <Card
              style={{
                width: (Object.keys(summary?.gpuResourceSumUp  || {}).length < 4 ? 33.4 * Object.keys(summary?.gpuResourceSumUp  || {}).length : 100)+'%',
                background: '#FBFBFB',
                borderRadius: 20,
                boxShadow: '5.265px 5.265px 20.385px 0px rgba(0, 0, 0, 0.05)'
              }}
              actions={[
                <div className={styles.whole}>
                  {
                    Object.keys(summary?.gpuResourceSumUp  || {})?.map((key) => {
                      return (
                        <div key={key} className={styles.action}>
                          <div className={styles.canUsed}>
                            <div>已分配实例</div>
                            <div>{summary?.gpuResourceSumUp[key]?.allocated}</div>
                          </div>
                          <i></i>
                          <div className={styles.all}>
                            <div>总实例数</div>
                            <div>{summary?.gpuResourceSumUp[key]?.allocatable || 0}</div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              ]}
            >
              <Card.Meta
                title="GPU分配情况"
                description={
                  <div className={styles.whole}>
                    {
                      Object.keys(summary?.gpuResourceSumUp || {})?.map((key) => {
                        return (
                          <div id={key} key={key} className={styles.chart}></div>
                        )
                      })
                    }
                  </div>
                }
              />
            </Card>
          </div>
        </div>



        <div className={styles.setting}>
          <div className={styles.content}>
            <div className={styles.title}>
              <span>配置信息</span>
              <span onClick={() => navigate('/setting')}>查看平台配置 <LinkSVG /></span>
            </div>
            <div className={styles.detail}>
              <div>
                <div className={styles.title}>学习环境配置信息</div>
                <ul>
                  <li>
                    <div>设备使用CPU数量</div>
                    <div><strong>{summary?.openHydraConfig?.default_cpu_per_device/1000 || 0}</strong> 个</div>
                  </li>
                  <i></i>
                  <li>
                    <div>设备使用GPU数量</div>
                    <div><strong>{summary?.openHydraConfig?.default_gpu_per_device || 0}</strong> 个</div>
                  </li>
                  <i></i>
                  <li>
                    <div>设备使用RAM数量</div>
                    <div><strong>{summary?.openHydraConfig?.default_ram_per_device || 0}</strong> M</div>
                  </li>
                </ul>
              </div>
              <div>
                <div className={styles.title}>节点计算配置信息</div>
                <ul>
                  <li>
                    <div>CPU超分比</div>
                    <div><strong>1 : {summary?.openHydraConfig?.cpu_over_commit_rate || 0}</strong></div>
                  </li>
                  <i></i>
                  <li>
                    <div>内存超分比</div>
                    <div><strong>1 : {summary?.openHydraConfig?.memory_over_commit_rate || 0}</strong></div>
                  </li>
                  <i></i>
                  <li>
                    <div>GPU切分</div>
                    <div className={styles.gpu}>
                      {
                        Object.keys(summary?.gpuResourceShare || {})?.map((key) => {
                          return <div key={key}><strong>1:{summary?.gpuResourceShare[key]}</strong> {key?.split('.com/gpu')[0].toUpperCase()}</div>;
                        })
                      }
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Spin>
    </div>
  );
};

export default Overview;
