/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import { Dropdown, Form, Modal, message, Spin } from 'antd';
import UploadData from './uploadData';
import * as CourseServices from '@src/services/teacher/course';
import {EllipsisOutlined, DeleteOutlined} from "@src/utils/antdIcon";
import * as styles from "./style.less";
import AddCourseSVG from "@src/assets/images/teacher/addCourse.svg";
import uploadImg from "@src/assets/images/teacher/upload.png";
import fileImg from "@src/assets/images/teacher/file.png";
import dayjs from 'dayjs';
import UserSVG from '@src/assets/images/student/user.svg';
import LoadingImg from '@src/assets/images/static/Loading.gif';

const Resource: React.FC = () => {
  const [form]:any = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [courseList, setCourseList] = useState<any>([]);
  const [currentCourse, setCurrentCourse] = useState<any>([]);
  const [fileList, setFileList] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  const getCourseListHandle = () => {
    setLoading(true)
    CourseServices.getCourse({}).then((res) => {
      setCourseList(res.items || []);
      setLoading(false);
    }).catch(() => setLoading(false))
  }

  const moreOptionHandle = () => {
    CourseServices.delCourse({ name: currentCourse.metadata.name }).then(() => {
      message.success('删除成功');
      getCourseListHandle()
    });
  }

  useEffect(() => {
    getCourseListHandle();
  }, []);

  const items:any = [
    {
      key: 'del',
      icon:
        <DeleteOutlined
          style={{ fontSize: 16 }}
        />,
      label:'删除'
    }
  ]



  return (
    <div className={styles.view}>
      <Spin spinning={loading}>
      {/*<Button*/}
      {/*  type="primary"*/}
      {/*  key="primary"*/}
      {/*  className={globals.addBtn}*/}
      {/*  style={{position: "absolute", right: 0, top: 8}}*/}
      {/*  size={'large'}*/}
      {/*  icon={<PlusCircleFilled  style={{fontSize: 22}}/>}*/}
      {/*  onClick={() => {*/}
      {/*    setOpen(true);*/}
      {/*  }}*/}
      {/*>*/}
      {/*  上传课程资源*/}
      {/*</Button>*/}

      <div className={styles.content}>
        <div className={styles.upload}
             onClick={() => {
               form.resetFields();
               setFileList([])
               setOpen(true);
             }}>
          <img src={uploadImg} />
          <div>上传课程资源</div>
        </div>
        {
          courseList?.map((item) => {
            return <div className={styles.item} key={item?.spec?.lastUpdate}>
              <div className={styles.option}>
                <Dropdown
                  menu={{
                    items,
                    onClick: moreOptionHandle
                  }}
                  placement="bottomLeft"
                  onOpenChange={() => {
                    setCurrentCourse(item)
                  }}
                  arrow>
                  <EllipsisOutlined style={{ fontSize: 20 }} />
                </Dropdown>
              </div>
              <img src={fileImg} />
              <div className={styles.title}>{item?.metadata?.name}</div>
              <div className={styles.describe}>{item?.spec?.description || '-'}</div>
              <div className={styles.bottom}>
                <div><UserSVG />{item?.spec?.createdBy}</div>
                {/*<span>{(item?.spec?.size / 1024).toFixed(2)}M</span>*/}
                <span>{dayjs(item?.spec?.lastUpdate).format('YYYY/MM/DD')}</span>
              </div>
            </div>;
          })
        }
      </div>


      <Modal
        title={<div><span><AddCourseSVG style={{ transform: 'scale(1)' }} /></span>上传课程资源</div>}
        open={open}
        onOk={() => {
          setCreateLoading(true);
          let formObj = new FormData();
          formObj.append('file', fileList[0]);
          formObj.append('name', form.getFieldValue('name'));
          formObj.append('description', form.getFieldValue('description') || '');

          CourseServices.addCourse(formObj).then(() => {
            message.success('创建成功');
            setCreateLoading(false);
            setOpen(false)
            getCourseListHandle();
          }).catch(() => setCreateLoading(false));
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
          <UploadData form={form} fileList={fileList} setFileList={setFileList}/>
        </Form>
      </Modal>
      </Spin>
    </div>
  );
};

export default Resource;
