/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/02)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, Collapse, Form, Input, Tree } from 'antd';
import {jurisdiction, getListByTree, check_indeterminate, check_checked} from "@src/pages/user/role/constant";

import * as styles from '../style.less';
import * as _ from 'lodash-es';

const CreateRole = ({form}) => {
  const [checkedList, setCheckedList] = useState<any>({});
  const [collapseItems, setCollapseItems] = useState<any[]>([]);


  const getItemsHandle = (data) => {
    let result: any[] = [];
    data.forEach((item) => {
      let list = {
        key: item.title,
        label:
          <Checkbox
            indeterminate={check_indeterminate(checkedList, item.key)}
            checked={check_checked(checkedList, item.key)}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              let allData = getListByTree(jurisdiction);
              if (e.target.checked) {
                // 全部选中
                let arrayKeys = [];
                allData.forEach((el) => {
                  if (el.key.startsWith(item.key) && el.key!==item.key) arrayKeys.push(el.key);
                });
                checkedList[item.key] = arrayKeys;
                setCheckedList(_.cloneDeep(checkedList));
              } else {
                // 全部取消
                delete checkedList[item.key];
                setCheckedList(_.cloneDeep(checkedList));
              }
            }}>
            <div onClick={(e) => e.stopPropagation()}>{item.title}</div>
          </Checkbox>,
        children: <div style={{ marginLeft: 20, marginBottom: 16 }}>
          <Tree
            checkable
            defaultExpandAll={true}
            checkedKeys={checkedList[item.key]}
            treeData={item.children}
            onCheck={(checkedKeys, e) =>  {
              checkedList[item.key] = checkedKeys
              setCheckedList(_.cloneDeep(checkedList))
            }}
          />
        </div>
      };
      result.push(list);
    });
    return result;
  };

  useEffect(() => {
    setCollapseItems(getItemsHandle(jurisdiction));
    form.setFieldsValue({permission: checkedList});
  }, [checkedList]);


  return (
    <Form.Item shouldUpdate={() => true} noStyle>
      {({}) => (
        <>
          <Form.Item label={'角色名称'} rules={[{ required: true, message: '请输入账号' }]} name="name">
            <Input placeholder={'请输入角色名称'} size="large" />
          </Form.Item>
          <Form.Item label={'描述'} rules={[{ required: false, message: '' }]} name={'description'}>
            <Input.TextArea
              showCount
              maxLength={100}
              style={{ height: 80, resize: 'none' }}
              placeholder={'请输入对此角色的描述，如权限、职责等'}
            />
          </Form.Item>
          <Form.Item
            label={'访问权限'}
            rules={[
              { required: true, message: '请选择' }
            ]}
            name="permission">
            <div>
              {
                collapseItems.length > 0 &&
                <Collapse
                  expandIconPosition={'end'}
                  items={collapseItems}
                  className={styles.itemBox}
                />
              }
            </div>
          </Form.Item>

        </>
      )}
    </Form.Item>
  );
};
export default CreateRole;
