import ReactMarkdown from 'react-markdown'
import {Avatar} from 'antd';
import stateStorage from '@src/storage/stateStorage';
import React from 'react';
import * as styles from '../style.less';
import { filter } from 'lodash-es';

interface Props {
  content: string
}
const UserConversations = (props: Props) => {
  const { content, conversationInfo } = props

  const customRenderers = {
    // 自定义 h1 标签的渲染
    // h1: ({ node, ...props }) => <h1 style={{ color: 'blue' }} {...props} />,
    // 可以自定义其他元素...
  };
  return (
    <div
      className={styles.userConversation}
    >
      <div>
        <div className={styles.content}>
          <ReactMarkdown components={customRenderers}>
            {content}
          </ReactMarkdown>
        </div>
        {
          conversationInfo?.chat_type === 'file_chat' &&
          <div className={styles.file}>
            {conversationInfo?.temp_file_name}
          </div>
        }

      </div>

      <Avatar style={{
        backgroundColor: '#f56a00',
        fontSize: 20,
        fontWeight: 500,
        cursor: 'pointer',
        verticalAlign: 'middle',
        marginLeft: 24
      }} size="large">
        {stateStorage.get('userInfo')?.name?.substring(0, 1).toUpperCase() || 'admin'}
      </Avatar>
    </div>
  )
}

export default UserConversations;
