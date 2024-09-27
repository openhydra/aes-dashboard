import ReactMarkdown from 'react-markdown'
import {Avatar, Collapse} from 'antd';
import stateStorage from '@src/storage/stateStorage';
import React from 'react';
import * as styles from '../style.less';
import HomeSVG from '@src/assets/images/tool/assistant/home.svg';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism'
import gfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'

interface Props {
  content: string
}
const UserConversations = (props: Props) => {
  const { content, docs } = props;

  const customRenderers = {
    // 自定义 h1 标签的渲染
    // h1: ({ node, ...props }) => <h1 style={{ color: 'blue' }} {...props} />,


    // 可以自定义其他元素...

    code: ({ children = [], inline, className, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      return (
      <SyntaxHighlighter
        language={match?.[1]}
        showLineNumbers={true}
        style={coldarkCold as any}
        PreTag='div'
        className='syntax-hight-wrapper'
        {...props}
      >
        {children as string[]}
      </SyntaxHighlighter>
    )
    },
    table: ({ children }) => {
      return (
        <div className="overflow-x-auto w-full scrollBar-light">
          <table className="whitespace-nowrap">{children}</table>
        </div>
      );
    }
  };


  return (
    <div
      className={styles.aiConversation}
    >
      <Avatar src={<HomeSVG style={{transform: 'scale(0.8)'}}/>}
              style={{background: 'linear-gradient(90deg, #5A1FE8 16.4%, #193BE3 100%)', marginRight: 24}}
              size="large">
        {stateStorage.get('userInfo')?.name?.substring(0, 1) || 'admin'}
      </Avatar>
      <div className={styles.content}>
        <ReactMarkdown
          remarkPlugins={[gfm, remarkMath]}
          rehypePlugins={[rehypeRaw]}
          unwrapDisallowed={true}
          components={customRenderers}>
          {content}
        </ReactMarkdown>
        {
          docs &&
          <Collapse
            size="small"
            style={{marginTop: 20}}
            items={[
              {
                key: '1',
                label: <div style={{display: 'flex', alignItems:'center'}}> <span className={'ml-[5px]'}>知识库匹配结果</span></div>,
                children: <ReactMarkdown
                  remarkPlugins={[gfm, remarkMath]}
                  rehypePlugins={[rehypeRaw]}
                  unwrapDisallowed={true}
                  components={customRenderers}
                >
                  {docs}
                </ReactMarkdown> }]}
          />
        }

      </div>

    </div>
  )
}

export default UserConversations;
