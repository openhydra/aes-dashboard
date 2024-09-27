
/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { Form, Input, message, Modal, Spin } from 'antd';
import * as styles from './style.less';
import TimeSVG from '@src/assets/images/student/time.svg';
import UserSVG from '@src/assets/images/student/user.svg';
import * as ClassServices from '@src/services/tool/class';
import uploadImg from '@src/assets/images/tool/uploadCourse.png';
import { DeleteOutlined } from '@src/utils/antdIcon';
import AddCourseSVG from '@src/assets/images/teacher/addCourse.svg';
import UploadData from './uploadData';
import stateStorage from '@src/storage/stateStorage';
import dayjs from 'dayjs';
import {levelList, classList} from './constant';
import { checkUserAuth } from '@src/utils';

const { Search } = Input;

const Index = () => {
  const navigate = useNavigate();
  const [form]:any = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [courseList, setCourseList] = useState<any>([]);
  const [sourceCourseList, setSourceCourseList] = useState<any>([]);
  const [active, setActive] = useState<any>(0);
  const [fileList, setFileList] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  const onSearch:any = (value, _e, info) => {
    setCourseList(sourceCourseList.filter((item) => item?.metadata?.name.includes(value)));
  }

  const getCourseListHandle = () => {
    setLoading(true)
    ClassServices.getCourse({}).then((res) => {
      setCourseList(res.items || []);
      setSourceCourseList(res.items || []);
      setLoading(false);
    }).catch(() => setLoading(false))



  }


  const delOptionHandle = (name) => {
    Modal.confirm({
      title: '删除课程',
      content: '确定删除当前课程吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        ClassServices.delCourse({ name: name }).then(() => {
          message.success(`课程 ${name} 删除成功！`);
          getCourseListHandle()
        });
      }
    });

  }

  useEffect(() => {
    getCourseListHandle();

  }, []);


  return (
    <div className={styles.viewClass}>
      <Search
        placeholder="搜索课程"
        onSearch={onSearch}
        size={'large'}
        className={styles.search}
        enterButton />

      <Spin spinning={loading}>
        <div className={styles.title}>课程</div>
        <div className={styles.tagFilter}>
          <div>难度</div>
          <ul>
            {
              levelList?.map((item) => {
                return <li
                  key={item.id}
                  onClick={() => {
                    setActive(active=== item.id ? 0: item.id);
                    setCourseList(active=== item.id? sourceCourseList : sourceCourseList.filter((el) => el?.spec?.level === item.id));
                  }}
                  className={item.id === active ? styles.active : ''}>{item.name}</li>
              })
            }
          </ul>
        </div>
        <div
          className={styles.content}
        >
          {
            checkUserAuth('course', 4) &&
            <div className={styles.upload}
                 onClick={() => {
                   form.resetFields();
                   setFileList([]);
                   setOpen(true);
                 }}>
              <img src={uploadImg} />
              <div>创建课程</div>
            </div>
          }
          {
            courseList?.map((item, index) => {
              return (
                <div
                  key={item?.metadata?.name}
                  className={styles.item}
                  onClick={() => {
                    navigate( `/classDetail/${item?.metadata?.name}/${ index % 5}`);
                  }}>
                  <div className={styles.img}>
                    <img src={classList[index % 5]} />
                  </div>
                  <div className={styles.cardTitle}>{item?.metadata?.name}</div>
                  <div className={styles.tag}>
                    <span>{levelList?.filter((el) => item?.spec?.level === el.id)[0]?.name}</span>
                  </div>
                  <div className={styles.bottom}>
                    <div>
                      <div><UserSVG />{item?.spec?.createdBy}</div>
                      <div><TimeSVG />{dayjs(item?.spec?.lastUpdate).format('YYYY.MM.DD')}</div>
                    </div>
                    {
                      checkUserAuth('course', 16) &&
                      <div onClick={(event) => {
                        event.stopPropagation();
                        delOptionHandle(item?.metadata?.name);
                      }}>
                        <DeleteOutlined
                          style={{ fontSize: 18 }}
                        />
                      </div>
                    }

                  </div>
                </div>
              )
            })
          }
        </div>
      </Spin>


      <Modal
        title={<div><span><AddCourseSVG style={{ transform: 'scale(1)' }} /></span>创建课程</div>}
        open={open}
        onOk={() => {
          setCreateLoading(true);

          form.validateFields().then(async (values) => {

            let formObj = new FormData();
            formObj.append('file', fileList[0]);
            formObj.append('name', form.getFieldValue('name'));
            formObj.append('level', form.getFieldValue('level'));
            formObj.append('sandboxName', form.getFieldValue('sandboxName'));
            formObj.append('createdBy', stateStorage.get('userInfo').name);
            formObj.append('description', form.getFieldValue('description') || '');

            ClassServices.addCourse(formObj).then((res) => {
              if (res?.errMsg) {
                message.error(res?.errMsg);
              } else {
                message.success(`课程 ${form.getFieldValue('name')} 上传成功！`);
              }
              setCreateLoading(false);
              setOpen(false)
              getCourseListHandle();
            }).catch(() => setCreateLoading(false));
          })
        }}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        okText={'确认'}
        cancelText={'取消'}
        width={550}
        confirmLoading={createLoading}
      >
        <Form
          form={form}
          layout="vertical">
          <UploadData form={form} fileList={fileList} setFileList={setFileList} levelList={levelList} />
        </Form>

      </Modal>
    </div>
  )
    ;
};

export default Index;
