import React, { ReactNode } from 'react';
import { Tooltip } from 'antd';
import Copy from '@src/components/Copy';
import styles from './index.less';

interface IDProps {
  copyable?: boolean;
  id?: string;
}

export default function ID({ copyable = true, id }: IDProps): ReactNode {
  if (!id) {
    return null;
  }

  const idDom = (
    <Tooltip placement="bottom" title={id} className={styles.tip}>
      {id}
    </Tooltip>
  );

  if (copyable) {
    return (
      <div className={styles.id}>
        <Copy className={styles.copy} value={id}>
          {idDom}
        </Copy>
      </div>
    );
  }
  return <div className={styles.id}>{idDom}</div>;
}
