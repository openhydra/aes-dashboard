/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React from 'react';
import * as styles from '../style.less';
import { FloatButton } from 'antd';

import HomeSVG from '@src/assets/images/tool/assistant/home.svg';
import KnowledgeSVG from '@src/assets/images/tool/assistant/knowledge.svg';
import DialogSVG from '@src/assets/images/tool/assistant/dialog.svg';
import MoreDialogSVG from '@src/assets/images/tool/assistant/moreDialog.svg';

interface FloatButtonCompontentProps {
  active?: number;
  setActiveHandle?: any;
}

const FloatButtonCompontent = ({ active, setActiveHandle }:FloatButtonCompontentProps) => {

  return (
    <FloatButton.Group
      shape="square"
      className={styles.floatBtn}>
      <FloatButton
        className={active === 1 ? styles.activeColor : ''}
        icon={<HomeSVG />}
        tooltip={() => '虚拟助教首页'}
        onClick={() => setActiveHandle(1)} />
      <FloatButton
        className={active === 2 ? styles.activeColor : ''}
        icon={<MoreDialogSVG />}
        tooltip={() => '多功能对话'}
        onClick={() => setActiveHandle(2)} />
      <FloatButton
        className={active === 3 ? styles.activeColor : ''}
        icon={<DialogSVG />}
        tooltip={() => '知识库对话'}
        onClick={() => setActiveHandle(3)} />
      <FloatButton
        className={active === 4 ? styles.activeColor : ''}
        icon={<KnowledgeSVG />}
        tooltip={() => '知识库'}
        onClick={() => setActiveHandle(4)} />
    </FloatButton.Group>
  );
};

export default FloatButtonCompontent;
