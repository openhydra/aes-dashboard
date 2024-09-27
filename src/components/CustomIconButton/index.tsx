/**
 * Author: shi lei
 * Date: 2023-02-10
 * Description: 通用icon操作按钮
 *
 */
import React from 'react';
import { Button, Tooltip } from 'antd';

import * as styles from './style.less';

interface IProps {
  title?: string; // 悬浮title
  toolTipStyles?: any; // toolTip样式
  toolTipProps?: any; // toolTip props
  loading?: boolean; // loading
  buttonText?: string | React.ReactNode; // 按钮文字
  icon?: React.ReactNode; // button icon
  buttonClassName?: any; // 按钮样式
  buttonProps?: any; // 按钮 props
  onClick?: (params) => void; // 点击事件
}

const CustomIconButton = (props: IProps) => {
  const {
    title,
    loading = false,
    buttonText,
    icon,
    toolTipProps,
    buttonProps,
    toolTipStyles,
    buttonClassName = '',
    onClick
  } = props;
  return (
    <Tooltip {...toolTipProps} title={title} style={toolTipStyles}>
      <Button
        type="link"
        {...buttonProps}
        className={[styles.customIconButton, buttonClassName].join(' ')}
        onClick={onClick}
        icon={icon}
        loading={loading}
      >
        {buttonText}
      </Button>
    </Tooltip>
  );
};
export default CustomIconButton;
