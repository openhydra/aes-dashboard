/**
 * @AUTHOR zhy
 * @DATE zhy (2023/01/11)
 * @Description: 文件下载 默认展示形式：图标+文字； 可展示仅图标、仅文字
 */
import { downLoadFile } from '@src/services/common';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, MenuProps, message } from 'antd';
import React, { useState } from 'react';
import { DownloadOutlined } from '@src/utils/antdIcon';

interface propsTypes {
  onlyIcon?: boolean; // 仅展示图标
  onlyText?: boolean; // 仅展示文字
  buttonType?: any; // 按钮类型，对应antd的按钮type
  downloadKey: string; // 下载需要传入后端接口端key
  params?: any; // 下载参数
  buttonTitle?: any; // 按钮文字
  defaultType?: string; // 下载类型''
  propsParams?: any; // 官方参数
}

const DownloadFiles = (props: propsTypes) => {
  const t: any = useTranslation().i18n.t;
  const {
    onlyIcon = false,
    onlyText = false,
    buttonType = 'primary',
    downloadKey,
    buttonTitle = t('下载列表'),
    params,
    defaultType = null,
    propsParams
  } = props;
  const [loading, setLoading] = useState<boolean>(false);

  // 下载对应类型
  const exportTypeData = {
    xlsx: 'excel',
    pdf: 'pdf',
    html: 'html'
  };

  // 下载保存对应类型
  const saveTypes = {
    xls: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pdf: 'application/pdf',
    html: 'application/html'
  };

  /**
   * @desc 保存blob数据到本地
   * @param {string} type 文件类型
   * */
  const downloadFiles = async (type) => {
    if (params) {
      delete params.pageSize;
      delete params.pageNo;
    }
    setLoading(true);
    try {
      let data = await downLoadFile(params, { exportType: exportTypeData[type], resourceType: downloadKey });
      if (!data) {
        console.error('请检查数据是否存在！');
        return false;
      }
      let blob = new Blob([data], {
        type: saveTypes[type]
      });
      let objectUrl = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.download = `${downloadKey + dayjs(new Date()).format('YYYY-MM-DD')}.${type}`;
      a.href = objectUrl;
      a.click();
      a.remove();
      message.success(t('下载成功'));
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  // 下载菜单
  const items: MenuProps['items'] = [
    {
      key: 'Excel',
      label: <span onClick={() => downloadFiles('xlsx')}>Excel</span>
    },
    {
      key: 'PDF',
      label: <span onClick={() => downloadFiles('pdf')}>PDF</span>
    },
    {
      key: 'HTML',
      label: <span onClick={() => downloadFiles('html')}>HTML</span>
    }
  ];

  return (
    <>
      {defaultType ? (
        <Button
          type={buttonType}
          loading={loading}
          icon={!onlyText && <DownloadOutlined />}
          {...propsParams}
          onClick={() => downloadFiles(defaultType)}
        >
          {!onlyIcon && <span>{buttonTitle}</span>}
        </Button>
      ) : (
        <Dropdown menu={{ items }} placement="bottom" arrow>
          {
            <Button type={buttonType} loading={loading} icon={!onlyText && <DownloadOutlined />} {...propsParams}>
              {!onlyIcon && <span>{buttonTitle}</span>}
            </Button>
          }
        </Dropdown>
      )}
    </>
  );
};

export default DownloadFiles;
