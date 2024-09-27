/**
 * @AUTHOR zhy
 * @DATE 2021/12/23
 * @Description:
 */

import React from 'react';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

function NoData(props: { description?: string }) {
  const t: any = useTranslation().i18n.t;
  const { description = '暂无数据' } = props;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t(description)} />
    </div>
  );
}
export default NoData;
