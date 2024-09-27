/** 
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
