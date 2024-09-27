/**
 * Author: neiluoluo nie.luoluo@99cloud.net
 * Date: 2022-07-22 16:16:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-01 15:17:08
 * Description: 是|否 展示
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckOutlined, CloseOutlined } from '@src/utils/antdIcon';

/**
 * @description:
 * @param {object} props
 * @param {boolean} props.status TRUE|FALSE
 * @param {boolean} props.isIcon TRUE|FALSE 默认false
 * @return {*}
 */
const YesOrNo = (props: { status: boolean; isIcon?: boolean }) => {
  const { i18n } = useTranslation();
  let { status, isIcon } = props;
  return isIcon ? (
    !status ? (
      <CloseOutlined style={{ color: '#c71313' }} />
    ) : (
      <CheckOutlined style={{ color: '#479f46' }} />
    )
  ) : (
    <span>{i18n.t<any>(status ? '是' : '否')}</span>
  );
};
export default YesOrNo;
