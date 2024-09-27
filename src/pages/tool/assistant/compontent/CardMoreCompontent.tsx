/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React from 'react';
import * as styles from '../style.less';
import { Dropdown, FloatButton } from 'antd';

import HomeSVG from '@src/assets/images/tool/assistant/home.svg';
import KnowledgeSVG from '@src/assets/images/tool/assistant/knowledge.svg';
import DialogSVG from '@src/assets/images/tool/assistant/dialog.svg';
import MoreDialogSVG from '@src/assets/images/tool/assistant/moreDialog.svg';
import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@src/utils/antdIcon';


const CardMoreCompontent = ({ data, moreOptionHandle, del, edit}) => {
  const items:any = [
    edit && {
      key: 'edit',
      icon: <EditOutlined style={{ fontSize: 16 }} />,
      label:'编辑'
    },
    del && {
      key: 'del',
      icon:
        <DeleteOutlined
          style={{ fontSize: 16 }}
        />,
      label:'删除'
    }
  ]
  return (
    <Dropdown
      menu={{
        items,
        onClick: (event) => {
          event.domEvent.stopPropagation();
          moreOptionHandle(event.key, data);
        }
      }}
      placement="bottomLeft"
      arrow>
      <EllipsisOutlined style={{ cursor: 'pointer', fontSize: 20 }} />
    </Dropdown>
  );
};

export default CardMoreCompontent;
