import React, { ReactNode, MouseEvent } from 'react';
import { Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

interface Props {
  value?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  className?: string;
  children?: ReactNode;
  copyable?: {
    text: string;
    icon?: ReactNode;
    tooltips?: string | [string, string];
  };
  iconClassName?: string;
  isLightIcon?: boolean;
  onlyIcon?: boolean;
  tooltips?: string | [string, string];
}

const { Paragraph } = Typography;

function Copy({
  value = '',
  onClick,
  className,
  children,
  copyable,
  iconClassName,
  isLightIcon,
  onlyIcon = false,
  tooltips = '',
  ...restProps
}: Props) {
  const copy = copyable || {
    text: value || '',
    ...(isLightIcon && { icon: <CopyOutlined style={{ color: 'white' }} className={iconClassName} /> }),
    ...(tooltips ? { tooltips: [tooltips, '复制成功'] } : {})
  };

  return value !== '' && value !== '-' ? (
    <Paragraph className={className} onClick={onClick} copyable={copy} {...restProps}>
      {onlyIcon ? '' : children || value}
    </Paragraph>
  ) : null;
}

export default Copy;
