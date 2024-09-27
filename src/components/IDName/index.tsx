import React, { ReactNode } from 'react';
import { LinkProps } from 'react-router-dom';
import classnames from 'classnames';
import Name from './Name';
import ID from './ID';
import styles from './index.less';

interface IDNameProps {
  name?: string;
  id?: string;
  nameCopyable?: boolean;
  linkProps?: LinkProps;
  copyable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const IDName: React.FC<IDNameProps> = ({ name, nameCopyable, id, copyable, className, style, ...rest }): ReactNode => {
  if (name && id) {
    return (
      <div className={classnames(styles.idName, className)} style={style}>
        <Name name={name} copyable={nameCopyable} {...rest} />
        <ID id={id} copyable={copyable} {...rest} />
      </div>
    );
  }
  if (name) {
    return <Name name={name} copyable={nameCopyable} {...rest} />;
  }
  if (id) {
    return <ID id={id} copyable={copyable} {...rest} />;
  }
  return '-';
};

export default IDName;
