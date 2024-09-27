/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import * as styles from './style.less';
import FloatButtonCompontent from '@src/pages/tool/assistant/compontent/FloatButtonCompontent';
import Home from '@src/pages/tool/assistant/home';
import Knowledge from '@src/pages/tool/assistant/knowledge';
import Dialog from '@src/pages/tool/assistant/dialog';
import { ArrowLeftOutlined } from '@src/utils/antdIcon';
import stateStorage from '@src/storage/stateStorage';


const Index: React.FC = () => {
  const [active, setActive] = useState(1);
  const [title, setTitle] = useState('新建对话');

  const [problems, setProblems] = useState<any>({
    problem: null,
    files: null,
    kb: null
  })



  useEffect(() => {
    if(stateStorage.get('dialogActive')) {
      setActive(stateStorage.get('dialogActive'))
    }else{
      stateStorage.set('dialogActive', active);
    }
    return () => stateStorage.del('dialogActive')
  }, []);

  const activeHandle = (val) => {
    stateStorage.set('dialogActive', val);
    setActive(val);
  }

  return (
    <div className={styles.view}>
      {
        active === 1 &&
        <Home setActiveHandle={(val) => activeHandle(val)} setProblemsHandle={setProblems}/>
      }
      {
        (active === 2 || active === 3) &&
        <>
          <div className={styles.header}>
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
            <div className={styles.title}>{title}</div>
          </div>
          <Dialog
            chatTitleCallBack={(value) => setTitle(value)}
            type={active}
            problems={problems}
            setProblems={setProblems}/>
        </>
      }
      {
        active === 4 &&
        <Knowledge />
      }

      <FloatButtonCompontent active={active} setActiveHandle={(val) => activeHandle(val)} />
    </div>
  );
};

export default Index;
