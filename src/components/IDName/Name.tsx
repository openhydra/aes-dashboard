import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Tooltip } from 'antd';
import Copy from '@src/components/Copy';
import styles from './index.less';

interface NameProps {
  name?: string;
  copyable?: boolean;
  linkProps?: LinkProps;
}

const Name: React.FC<NameProps> = ({ name, copyable = false, linkProps }) => {
  if (!name) {
    return null;
  }

  const nameDom = (
    <Tooltip placement="bottom" title={name || '-'} className={styles.tip}>
      {name || '-'}
    </Tooltip>
  );

  if (linkProps?.to) {
    const nameLink = (
      <Tooltip placement="bottom" title={name || '-'} className={styles.tip}>
        <Link {...linkProps}>{name || '-'}</Link>
      </Tooltip>
    );

    return (
      <div className={styles.name}>
        {copyable ? (
          <Copy className={styles.copy} value={name}>
            {nameLink}
          </Copy>
        ) : (
          nameLink
        )}
      </div>
    );
  }

  if (copyable) {
    return (
      <div className={styles.name}>
        <Copy className={styles.copy} value={name}>
          {nameDom}
        </Copy>
      </div>
    );
  }

  return <div className={styles.name}>{nameDom}</div>;
};

export default Name;
