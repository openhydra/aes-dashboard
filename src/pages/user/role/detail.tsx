/**
 * @AUTHOR zhy
 * @DATE zhy (2024/01/2)
 * @Description:
 */
import React, {useEffect,  useState} from 'react';
import BaseComponent from '@src/components/BaseComponent';
import * as styles from '../style.less';
import { Button, Checkbox, Collapse, message, Input, Space, Tree, Spin } from 'antd';
import {jurisdiction, getListByTree, check_indeterminate, check_checked} from "@src/pages/user/role/constant";
import * as _ from 'lodash-es';
import * as RoleServices from '@src/services/user/role';
import { useLocation } from 'react-router-dom';
import LoadingImg from '@src/assets/images/static/Loading.gif';
import { checkUserAuth } from '@src/utils';


const RoleDetail: React.FC = () => {
  const location = useLocation();
  const [sourceData, setSourceData] = useState<any>({});
  const [editParams, setEditParams] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [defaultActiveKey, setDefaultActiveKey] = useState<string[]>([]);
  const [checkedList, setCheckedList] = useState<any>({});
  const [collapseItems, setCollapseItems] = useState<any[]>([]);
  const allData = getListByTree(jurisdiction);

  const getItemsHandle = (data) => {
    let result: any[] = [];
    data.forEach((item) => {
      defaultActiveKey.push(item.key)
      setDefaultActiveKey(defaultActiveKey);
      let list = {
        key: item.key,
        label:
          <Checkbox
            disabled={!edit}
            indeterminate={check_indeterminate(edit ? editParams.checkedList : checkedList, item.key)}
            checked={check_checked(edit ? editParams.checkedList : checkedList, item.key)}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              if (e.target.checked) {
                // 全部选中
                let arrayKeys = [];
                allData.forEach((el) => {
                  if (el.key.startsWith(item.key) && el.key!==item.key) arrayKeys.push(el.key);
                });
                editParams.checkedList[item.key] = arrayKeys;
                setEditParams(_.cloneDeep((editParams)));
              } else {
                if(edit)
                // 全部取消
                delete editParams.checkedList[item.key];
                setEditParams(_.cloneDeep((editParams)));
              }
            }}>
            <div onClick={(e) => e.stopPropagation()}>{item.title}</div>
          </Checkbox>,
        children: <div style={{ marginLeft: 20, marginBottom: 16 }}>
        <Tree
            checkable
            disabled={!edit}
            defaultExpandAll={true}
            checkedKeys={edit? editParams.checkedList[item.key] : checkedList[item.key]}
            treeData={item.children}
            onCheck={(checkedKeys, e) =>  {
              editParams.checkedList[item.key] = checkedKeys
              setEditParams(_.cloneDeep((editParams)));
            }}
          />
        </div>
      }
      result.push(list);
    })
    return result;
  }

  const fatherChecked = (funcResult) => {
    let result = {};
    Object.keys(funcResult).forEach((key) => {
      // 子集全面
      if(allData.filter((el) => el.key === key)[0].children.length === funcResult[key].length){
        funcResult[key].push(key);
      }
      let newKeys = key.split('-');
      if(_.isNil(result[newKeys[0]])){
        result[newKeys[0]] = funcResult[key];
      }else{
        result[newKeys[0]] = result[newKeys[0]].concat(funcResult[key])
      }
    })
    setCheckedList(_.cloneDeep(result))
    editParams.checkedList = result;
    setEditParams(_.cloneDeep(editParams));
  }

  const getInitCheckedListHandle = (permission) => {
    let modalResult:any = {};
    let funcResult:any = {};
    allData.forEach((item) => {

      // 当前key ===> [, , ,]
      let keyArray = item.key.split('-');

      // 当前key[]的最后一项
      let lastKey = keyArray[keyArray.length - 1];

      //判断最后一项为数字，说明最后一项为功能权限
      if(/^[+-]?\d+(\.\d+)?$/.test(lastKey)){
        // 当前功能模块的Key
        let currentKey = keyArray[keyArray.length - 2];

        _.isNil(funcResult[keyArray.slice(0, keyArray.length-1).join('-')]) && (funcResult[keyArray.slice(0, keyArray.length-1).join('-')] = []);
        // 系统返回的权限 & 当前功能权限 === 当前功能权限  ////表明当前功能有权限！！！
        if((permission[currentKey] & Number(lastKey)) === Number(lastKey)){
          modalResult[keyArray[0]].push(item.key);
          funcResult[keyArray.slice(0, keyArray.length-1).join('-')].push(item.key);
        }
      }else{
        // 当前根key
        _.isNil(modalResult[keyArray[0]]) && (modalResult[keyArray[0]] = []);

      }
    })
    // console.log(modalResult, funcResult)
    fatherChecked(funcResult)
    // setCheckedList(_.cloneDeep(modalResult))
  }


  const getDetailRoleHandle = () => {
    setLoading(true);
    RoleServices.getRoleDetail({roleId:location?.state?.id}).then((res) => {
      setLoading(false);
      setSourceData(res);
      getInitCheckedListHandle(res.permission);
    }).catch(() =>
      setLoading(false))
  }

  const submitUpdate = () => {
    setLoading(true);
    let permission = {};
    Object.keys(editParams.checkedList).forEach((key) => {
      editParams.checkedList[key].forEach((item) => {
        let keyArray = item.split('-');
        let currentKey = keyArray[keyArray.length - 2];
        //判断为数字
        if(/^[+-]?\d+(\.\d+)?$/.test(keyArray[keyArray.length - 1])){
          _.isNil(permission[currentKey]) && (permission[currentKey] = 0);
          permission[currentKey] = permission[currentKey] | keyArray[keyArray.length - 1];
        }
      })
    })
    let params = {
      name: editParams.name,
      description: editParams.description,
      id: location?.state?.id,
      permission
    }
    RoleServices.updateRole(params, {roleId: location?.state?.id}).then((res) => {
      if(res?.errMsg){
        message.error(res?.errMsg);
      }else {
        message.success(`角色 ${editParams.name} 编辑成功！`);
      }
      getDetailRoleHandle();
      setEditParams({});
      setEdit(false);
    })
  }

  useEffect(() => {
    getDetailRoleHandle()
  }, []);

  useEffect(() => {
    setCollapseItems(getItemsHandle(jurisdiction));
  }, [editParams.checkedList, edit]);


  return (
    <Spin spinning={loading}>
      <BaseComponent
        pageName={'角色详情'}
        showBreadcrumb={true}
        buttonList={
          checkUserAuth('role', 8) && (
            edit ?
              <Space>
                <Button onClick={() => {
                  setEdit(false);
                  sourceData.checkedList = checkedList;
                  setEditParams(_.cloneDeep(sourceData));
                }}>取消</Button>
                <Button
                  type={'primary'}
                  onClick={() => submitUpdate()}>提交</Button>
              </Space> :
              (sourceData?.name !== 'aes-admin' && <Button
                type={'primary'}
                onClick={() => {
                  setEdit(true);
                  sourceData.checkedList = checkedList;
                  setEditParams(_.cloneDeep(sourceData));
                }}>编辑</Button>)
          )
        }
      >
        <div className={styles.Info}>
          <div className={styles.title}>基础信息</div>
          <ul>
            <li>
              <span>角色名称</span>
              {
                edit ?
                  <Input
                    defaultValue={editParams?.name}
                    size={'large'}
                    onChange={(e) => {
                      editParams.name = e.target.value;
                      setEditParams(_.cloneDeep(editParams));
                    }}/> :
                  <span>{sourceData?.name}</span>
              }

            </li>
            <li>
              <span>角色描述</span>
              {
                edit ?
                  <Input
                    defaultValue={editParams?.description}
                    size={'large'}
                    onChange={(e) => {
                      editParams.description = e.target.value;
                      setEditParams(_.cloneDeep(editParams));
                    }}/> :
                  <span>{sourceData?.description || '-'}</span>
              }
            </li>
          </ul>
        </div>

        <div className={styles.Info} style={{height: 'calc(100vh - 425px)', overflowY:'auto'}}>
          <div className={styles.title}>角色权限</div>
          {
            collapseItems.length > 0 &&
            <Collapse
              defaultActiveKey={defaultActiveKey}
              onChange={() => {}}
              collapsible={"disabled"}
              expandIcon={() => false}
              expandIconPosition={'end'}
              items={collapseItems}
              style={{ overflow: 'auto', minHeight: 200, paddingRight:'10px', maxHeight: 'calc(100% - 42px)'}}
            />
          }
        </div>
      </BaseComponent>
    </Spin>
  );
};

export default RoleDetail;
