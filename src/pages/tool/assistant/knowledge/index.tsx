/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import * as styles from './style.less';
import {Tabs } from 'antd';
import { ArrowLeftOutlined } from '@src/utils/antdIcon';
import KgTitlePng from '@src/assets/images/tool/knowledge/kg_title.png';
import CommonKnowledge from '@src/pages/tool/assistant/knowledge/common';
import MineKnowledge from '@src/pages/tool/assistant/knowledge/mine';
import stateStorage from '@src/storage/stateStorage';
const Knowledge: React.FC = () => {
  const [active, setActive] = useState('1');
  const items = [
    {
      key: '1',
      label: '公共知识库',
      children: active === '1' && <CommonKnowledge />,
    },
    {
      key: '2',
      label: '我的知识库',
      children: active === '2' && <MineKnowledge />,
    }];

  useEffect(() => {
    setActive(stateStorage.get('kbActive') || '1')
    return () => {
      stateStorage.del('kbActive');
    }
  }, []);

  return (
    <div className={styles.view}>
      <div className={styles.contentBg}>
        {/*<Search*/}
        {/*  placeholder="搜索课程"*/}
        {/*  size={'large'}*/}
        {/*  className={styles.search}*/}
        {/*  enterButton />*/}
        <a
          style={{ verticalAlign: 'middle', marginRight: '12px' }}
          onClick={() => {
            history.go(-1);
          }}
          className={styles.back}
        >
          <ArrowLeftOutlined className={styles.svg} />
          <span>返回</span>
        </a>

        <img src={KgTitlePng} className={styles.title} />
        <div className={styles.info}>通过向量化模型处理文本数据，实现大模型深度语义理解和智能信息检索
        </div>
      </div>
      <div className={styles.content}>
        <Tabs activeKey={active} onChange={(key)=>setActive(key)} items={items} />
      </div>
    </div>
  );
};

export default Knowledge;
