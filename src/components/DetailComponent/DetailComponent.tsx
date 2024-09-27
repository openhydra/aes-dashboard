/**
 * @AUTHOR wangshengyun
 * @DATE wangshengyun（2022/05/30）
 * @Description: 详情UI
 */
import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Form, Row } from 'antd';
import styles from '@src/assets/css/commonDetail.less';
import { EditOutlined } from '@src/utils/antdIcon';
import * as _ from 'lodash-es';
import { isNil } from 'lodash-es';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface propsTypes {
  infoData?: Array<
    | {
        title?: string; // 详情信息的分类标题
        children?: any; // 详情内容，不需要循环展示，如：图片
        infoItem?: (
          | {
              name?: string; // 每一项的名称
              value?: any; // 每一项的值 —— 跳转方式1： 如果需要跳转可以传入跳转的内容dom结构，可以多个跳转链接
              hidden?: false; //当前项是否隐藏， 默认不隐藏
              path?: string; //  跳转方式1：当前项需要跳转的URL，只能单个跳转value的内容
              editItem?: {
                // 编辑的form表单项！！！
                key: string; // 编辑的form key
                value: any; // form项
                defaultValue?: any; // 表单项的初始值，组件默认为infoItem中的value
              };
              children?: any; // 按钮、或者逻辑放外面处理
            }
          | any
        )[];
      }
    | false
  >; // 具体详情信息
  isEdit?: boolean; // 是否需要编辑
  submitCallBack?: any; // 提交回调
  cancelCallBack?: any; // 取消回调,
  form?: any;
  isEditHandle?: any; // 是否编辑
}

function DetailComponent(props: propsTypes) {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const { infoData = [], isEdit = false, submitCallBack, cancelCallBack, form = Form.useForm()[0] } = props;
  // 是否处于编辑模式
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const queryIsEdit = searchParams.get('isEdit');
    if (isEdit && queryIsEdit) {
      setEdit(true);
    }
  }, []);

  useEffect(() => {
    props?.isEditHandle && props?.isEditHandle(edit);
  }, [edit]);

  return (
    <div className={styles.commonDetail}>
      {isEdit && !edit && (
        <Button
          type="primary"
          style={{ position: 'absolute', zIndex: 1000 }}
          icon={<EditOutlined />}
          onClick={() => setEdit(true)}
        >
          {i18n.t<any>('编辑')}
        </Button>
      )}
      <Form
        form={form}
        name={'edit'}
        labelCol={{ span: 7 }}
        onFinish={(values) => {
          submitCallBack(values);
          setEdit(false);
        }}
        labelAlign={'left'}
      >
        {isEdit && (
          <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
            {edit && (
              <>
                <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
                  {i18n.t<any>('提交')}
                </Button>
                <Button
                  onClick={() => {
                    setEdit(false);
                    form.resetFields();
                    cancelCallBack && cancelCallBack();
                  }}
                >
                  {i18n.t<any>('取消')}
                </Button>
              </>
            )}
          </Form.Item>
        )}
        {infoData?.map(
          (item: any, index: number) =>
            item && (
              <div key={item?.title + index}>
                <>
                  <div className={styles.commonDetailTitle}>{item?.title}</div>
                  {item?.children || (
                    <div className={styles.commonDetailContent}>
                      {item?.infoItem?.map((el: any, index: number) => {
                        let hidden = isNil(el?.hidden) ? false : el?.hidden;
                        let detailContent = (
                          <Row key={index}>
                            <Col span={7}>{el?.name}:</Col>
                            <Col span={17}>{el?.path ? <Link to={el?.path}>{el?.value}</Link> : (el?.value.toString() || '-')}</Col>
                          </Row>
                        );

                        // 不隐藏，可编辑，点击编辑按钮后，存在editItem项，初始设置值
                        !hidden &&
                          isEdit &&
                          edit &&
                          el?.editItem &&
                          _.isNil(form.getFieldValue(el.editItem.key)) &&
                          form.setFieldsValue({
                            // key: value----  若有默认的值defaultValue，设置默认值，若没有默认值，以传入进来的详情值作为初始编辑值
                            [el.editItem.key]: !isNil(el.editItem.defaultValue)
                              ? el.editItem.defaultValue
                              : el.value === '-'
                              ? ''
                              : el.value
                          });
                        return el?.children ? (
                          el?.children
                        ) : !hidden ? (
                          isEdit && edit && el?.editItem ? (
                            <div key={index}>{el?.editItem.value}</div>
                          ) : (
                            detailContent
                          )
                        ) : null;
                      })}
                    </div>
                  )}
                </>
                {infoData.length - 1 > index && <Divider />}
              </div>
            )
        )}
      </Form>
    </div>
  );
}

export default DetailComponent;
