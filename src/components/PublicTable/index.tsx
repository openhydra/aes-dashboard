/**
 * @AUTHOR wangshengyun
 * @DATE wangshengyun（2022/05/24)
 * @Description 公共Table组件
 */
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, Modal, Select, Space, ConfigProvider } from 'antd';
import {PlusCircleFilled} from '@src/utils/antdIcon';
import * as styles from './style.less';
import { RootContext } from '@src/frame/rootContext';
import ActionObj from '@src/frame/getNewReducer';
import * as _ from 'lodash-es';
import DownloadFiles from '@src/components/DownloadFiles/downloadFiles';
import { useDebounce } from '@src/utils';
import zhCNIntl from 'antd/lib/locale/zh_CN';

// 全局state
const pageState = ActionObj.TableColumnsFilter;

// 创建 - 弹框
interface modalSettingType {
  creatButtonName?: any; // 创建按钮文字
  isNavigate?: boolean; // 创建是弹窗还是跳转
  navigator?: (values: any) => void; // 创建跳转的函数
  handleFormValueChange?: (values: any, form: any) => void; // 新增弹窗表单值改变回调方法
  onSubmit?: (values: any) => void; // 新增表单确认按钮回调
  onBeforeOpen?: (values: any) => void; //弹窗打开之前的回调
  handleModalClose?: (values: any) => void; //弹窗关闭时的回调
  initialValues?: any; // 创建表单默认值
  modalStyle?: any; // modal样式
  FormItems?: React.ElementType; // 表单项
  createLoading?: boolean; // 创建接口返回loading状态
  moreAction?: React.ElementType; // 头部更多操作
  modalTitle: string; // 新增弹窗title
  modalWidth: number | string; // 新增弹窗宽度
  formName: string; // 表单name
  layoutConfig?: object; // 表单布局
  showButton?: boolean; // 是否显示按钮
}

// 删除 - 弹框
interface deleteModalSettingType {
  title: string; // 删除弹窗title
  content: string | React.ReactNode | any; // 删除弹窗内容
  deleteForm?: any; // 删除form
  deleteKey?: string; // 删除弹窗需要展示值所对应的key
  deleteRun: (params: any) => void; // 删除接口回调
}

// 全局搜索
interface paramsType {
  pageNo: number; // page
  pageSize: number; // pageSize
  nameSearch: string; // 全局搜索参数
}

// PublicTable 参数
type PublicTableProps = {
  downloadKey?: string; // 下载table 的resourceType值
  downloadParams?: any; // 下载table 的外部参数值
  dataSource?: any; // table数据
  loading: boolean; // 请求table数据接口返回的load状态
  customRowKey?: any; // 自定义table rowKey
  columns: any; // table列数据
  total?: any; // table数据总条数
  hasRowSelection?: boolean; // 表格是否支持多选
  rowSelection?: any; // 表格行配置项
  hiddenSearchOperate?: boolean; // 隐藏搜索操作
  hiddenDownloadOperate?: boolean; //隐藏下载操作 !!下载依赖downloadKey值,不传downloadKey时隐藏下载操作！！
  hiddenToolbar?: boolean; //隐藏整个toolbar
  searchName?: string | any[]; // 用于搜索条件中的搜索名称
  paramsCallback?: (params: any) => void; // 当前列表搜索数据，用于外部下载、获取当前页搜索参数
  uploadItem?: any; // 上传按钮
  columnsState?: any; // columns 状态的设置

  updateTable?: (params: paramsType) => void; // table数据接口更新方法
  modalSetting?: modalSettingType; // 创建弹窗参数
  buttonList?: any; //自定义操作
  deleteModalSetting?: deleteModalSettingType; // 删除弹窗参数
  tableAlertOptionRender?: any; // 选中表格项后表格上方提示框右侧的操作按钮（JSX或者false）
  [params: string]: any;
};
const PublicTable = forwardRef((props: PublicTableProps, ref: any) => {

  const {
    dataSource,
    loading,
    columns,
    modalSetting,
    buttonList,
    deleteModalSetting,
    total,
    customRowKey = 'id',
    tableAlertOptionRender,
    hasRowSelection = false,
    rowSelection = {},
    hiddenSearchOperate = false,
    hiddenDownloadOperate = false,
    hiddenToolbar = false,
    downloadKey,
    downloadParams = {},
    searchName,
    uploadItem,
    columnsState,
    updateTable,
    paramsCallback
  } = props;
  const {
    creatButtonName,
    handleFormValueChange,
    okText,
    onSubmit,
    onBeforeOpen,
    handleModalClose,
    initialValues = {},
    FormItems = () => {},
    createLoading = false,
    modalTitle,
    modalStyle,
    modalWidth,
    formName,
    layoutConfig = {},
    isNavigate = false,
    moreAction = null,
    navigator = () => {}
  }: any = modalSetting || {};

  // 是否显示创建按钮。
  // 不传modalSetting或者modalSetting.showButton传false均可隐藏该按钮
  // 但有的地方（比如<==项目==>列表）需要隐藏该按钮，从其他地方唤起创建弹框
  const showButton = modalSetting?.showButton !== undefined ? modalSetting?.showButton : !!modalSetting;

  // table 删除列表参数
  const { title, content, deleteKey, deleteRun, deleteForm } = deleteModalSetting || {};
  const [form] = Form.useForm();
  const [deleteContent, setDeleteContent] = useState(typeof content !== 'function' ? content : '');
  const [deleteConfirmLoading, setDeleteConfirmLoading] = useState(false);
  // 默认搜索条件
  const [paginationSetting, setPaginationSetting] = useState<any>({ pageNo: 1, pageSize: 10 });
  // 新增弹框的隐藏显示状态
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (visible && handleFormValueChange) {
      form.setFieldsValue(initialValues);
      handleFormValueChange(initialValues, form);
    }
  }, [visible]);
  // 删除弹框的隐藏显示状态
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectItem, setSelectItem] = useState<any>({});
  const [defaultSearchKey, setDefaultSearchKey] = useState(null);
  const [columnsStateMap, setColumnsStateMap] = useState<any>({
    regionId: {
      show: false
    },
    ...columnsState
  });

  // 获取全局的数据
  const { dispatch } = useContext(RootContext);

  /**
   * @desc 更新表格数据
   * * */
  const updateTableData = useDebounce(() => {
    paramsCallback && paramsCallback(paginationSetting);
    updateTable && updateTable(paginationSetting);
  }, 400);

  /**
   * @desc 创建按钮的触发事件
   * */
  const createBtnHandle = () => {
    setVisible(true);
  };

  const handleCancel = (isUpdate = false) => {
    setIsModalVisible(false);
    setDeleteConfirmLoading(false);
    if (isUpdate) {
      updateTableData();
    }
    if (deleteForm) {
      deleteForm.resetFields();
    }
  };
  const handleDelete = async () => {
    deleteForm && (await deleteForm.validateFields());
    setDeleteConfirmLoading(true);
    deleteRun && deleteRun(selectItem); //这里回调只透传选中的对象，不做具体的数据解构组织
  };

  useImperativeHandle(ref, () => ({
    openDeleteModal: (selectValue: any) => {
      if (deleteKey) {
        setDeleteContent(content + selectValue[deleteKey]);
      }
      return setSelectItem(selectValue), setIsModalVisible(true);
    },
    openCreateModal: (selectValue: any) => {
      setVisible(true);
    },
    closeDeleteModal: (isUpdate) => handleCancel(isUpdate),
    closeCreateModal: (isUpdate = false) => {
      setVisible(false);
      if (isUpdate) {
        updateTableData();
      }
    }
  }));

  useEffect(() => {
    if (dataSource?.length === 0 && paginationSetting.pageNo > 1) {
      setPaginationSetting({
        pageNo: paginationSetting.pageNo - 1,
        pageSize: paginationSetting.pageSize
      });
    }
  }, [dataSource]);

  /**
   * @desc 分页操作事件
   * @param {number} page 当前页码
   * @param {number} pageSize 每页展示数量
   * */
  const paginationChangeHandle = (page: number, pageSize: number) => {
    setPaginationSetting({ pageNo: page, pageSize: pageSize });
  };

  const searchItems = () => {
    if (typeof searchName === 'string') {
      return [
        {
          value: 'searchContent',
          label: searchName ? searchName : '-'
        }
      ];
    } else {
      let searchAry: any[] = [];
      searchName?.forEach((item: { [keyName: string]: string }) => {
        let key = Object.keys(item)[0];
        searchAry.push({
          value: key,
          label:item[key] || '-'
        });
      });
      return searchAry;
    }
  };

  /**
   * @desc 搜索input框的键入的触发事件
   * */
  const searchInputEnterHandle = (e) => {
    // 输入框内的内容
    let value = typeof e === 'object' ? e.target.value : e;
    setPaginationSetting({
      ...paginationSetting,
      pageNo: 1,
      pageSize: 10,
      [_.isNil(defaultSearchKey) ? searchItems()[0].value : defaultSearchKey]: value
    });
  };

  useEffect(() => {
    // 首次进入每个页面的时候清空原来过滤筛选条件, 设置当前记忆 table key
    pageState && dispatch(pageState.filterCondition({}));
  }, []);

  useEffect(() => {
    updateTableData && updateTableData();
  }, [paginationSetting]);

  return (
    <div className={styles.component_content} id="table_component">
      <div className={styles.tableComponent}>
        <ConfigProvider locale={zhCNIntl}>
        <ProTable
          columns={columns.filter((i) => i)}
          dataSource={dataSource}
          loading={loading}
          rowSelection={hasRowSelection && { ...rowSelection }}
          options={{
            fullScreen: false,
            reload: false,
            setting: !hiddenToolbar && !hiddenDownloadOperate && !buttonList ? true : false,
            density: false
          }}
          columnsState={{
            value: columnsStateMap,
            onChange: setColumnsStateMap
          }}
          rowKey={(record: any) =>
            typeof customRowKey === 'string'
              ? record[customRowKey]
              : customRowKey.reduce((pre, item) => {
                  let str = pre + record[item];
                  return str;
                }, '')
          }
          scroll={{ x: 1000, y: 'calc(~"100% - 100px")' }}
          search={false}
          form={{
            ignoreRules: false
          }}
          dateFormatter="string"
          onChange={({ current: pageNum, pageSize }, filters: any) => {
            setPaginationSetting({
              pageNo: pageNum,
              pageSize,
              searchContent: paginationSetting?.searchContent,
              ...filters
            });
          }}
          headerTitle={
            <Space>
              {moreAction}
              {!hiddenSearchOperate && !hiddenToolbar && (
                <Space.Compact>
                  <Select
                    defaultValue={searchItems()[0]?.value}
                    style={{ width: '35%' }}
                    dropdownMatchSelectWidth={false}
                    options={searchItems()}
                    onSelect={(val) => setDefaultSearchKey(val)}
                  />
                  <Input.Search
                    style={{ width: '65%' }}
                    placeholder={'请输入名称'}
                    onKeyUp={searchInputEnterHandle}
                    onSearch={searchInputEnterHandle}
                    allowClear
                  />
                </Space.Compact>
              )}
            </Space>
          }
          toolBarRender={
            !hiddenToolbar
              ? (): any => (
                  <>
                    {buttonList ? buttonList : null}
                    {showButton && (
                      <Button
                        type="primary"
                        key="primary"
                        className={styles.addBtn}
                        size={'large'}
                        icon={<PlusCircleFilled  style={{fontSize: 22}}/>}
                        onClick={() => {
                          if (isNavigate) {
                            navigator();
                          } else {
                            onBeforeOpen && onBeforeOpen();
                            createBtnHandle();
                          }
                        }}
                      >
                        {creatButtonName || '创建'}
                      </Button>
                    )}
                    {uploadItem ? uploadItem : null}
                    {!hiddenDownloadOperate && downloadKey && (
                      <DownloadFiles
                        buttonType={'ghost'}
                        params={{ ...paginationSetting, ...downloadParams }}
                        onlyIcon
                        downloadKey={downloadKey}
                      />
                    )}
                  </>
                )
              : false
          }
          pagination={{
            pageSize: paginationSetting.pageSize,
            current: paginationSetting.pageNo,
            onChange: paginationChangeHandle,
            total: (() => total || dataSource.total || dataSource[0]?.pagination?.total || dataSource.length || 0)(),
            pageSizeOptions: [5, 10, 20],
            showSizeChanger: true,
            showQuickJumper: false
          }}
          tableAlertRender={
            rowSelection.type !== 'radio'
              ? ({ selectedRowKeys, selectedRows, onCleanSelected }) => (
                  <Space>
                    <span>
                      已选 {selectedRowKeys.length} 项
                      <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                        取消选择
                      </a>
                    </span>
                  </Space>
                )
              : false
          }
          tableAlertOptionRender={tableAlertOptionRender}
        />
        </ConfigProvider>
      </div>
      <Modal
        title={modalTitle}
        centered
        open={visible}
        closable={!createLoading}
        style={modalStyle || {}}
        destroyOnClose
        onOk={() =>
          form.validateFields().then(async (values) => {
            onSubmit && onSubmit(values);
          })
        }
        onCancel={() => (handleModalClose && handleModalClose(form), setVisible(false))}
        confirmLoading={createLoading}
        okText={okText || '确定'}
        cancelButtonProps={{disabled:createLoading}}
        cancelText={'取消'}
        width={modalWidth || 650}
      >
        <Form
          form={form}
          layout="vertical"
          {...{
            labelWrap: true,
            labelCol: { span: 6 },
            wrapperCol: { offset: 1, span: 15 },
            ...layoutConfig
          }}
          name={formName}
          preserve={false}
          onValuesChange={(values) => handleFormValueChange && handleFormValueChange(values, form)}
          initialValues={initialValues}
        >
          {FormItems(form)}
        </Form>
      </Modal>
      <Modal
        className={styles.deleteModalStyle}
        title={title}
        centered
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          handleCancel();
        }}
        okButtonProps={{ danger: true, type: 'primary' }}
        confirmLoading={deleteConfirmLoading}
        okText={'确定'}
        cancelText={'取消'}
      >
        {typeof content === 'function' ? content(selectItem) : deleteContent}
      </Modal>
    </div>
  );
});

export default PublicTable;
