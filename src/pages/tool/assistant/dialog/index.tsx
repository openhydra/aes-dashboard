/**
 * @AUTHOR zhy
 * @DATE zhy (2023/12/28)
 * @Description:
 */
import React, { useEffect, useState, useRef } from 'react';
import * as styles from './style.less';
import ArrowSvg from '@src/assets/images/tool/assistant/arrow.svg';
import InputDialogCompontent from '@src/pages/tool/assistant/compontent/InputDialogCompontent';
import HistoryCompontent from '@src/pages/tool/assistant/compontent/HistoryCompontent';
import UserConversations from '@src/pages/tool/assistant/compontent/UserConversations';
import AIConversations from '@src/pages/tool/assistant/compontent/AIConversations';
import stateStorage from '@src/storage/stateStorage';
import * as AssistantServices from '@src/services/tool/assistant';
import {fetchEventSource} from "@microsoft/fetch-event-source";
import { Form, message, Spin, Upload } from 'antd';


class RetriableError extends Error {}
class FatalError extends Error {}

const Dialog = ({type, chatTitleCallBack, problems, setProblems}) => {
  const stopText = '已停止生成';
  const [form]: any = Form.useForm();
  const chatContainerRef = useRef<any>(null);
  const signalRef = useRef(null)
  const [chatTypes, setChatTypes] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [autoScroll, setAutoScroll] = useState({
    type: true,
    options: ''
  });
  const [conversationInfo, setConversationInfo] = useState<any>(null);
  const [conversations, setConversations] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [canSendMessage, setCanSendMessage] = useState(true);

  const [kbList, setKbList] = useState<any>(null);
  const [kBValue, setKBValue] = useState<any>(null);
  /**
   * @desc 上传文件之前判断
   * */
  const beforeUpload = (file) => {
    const isFile =
      file.type === 'text/plain' ||
      file.type === 'application/pdf' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === ''
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isFile) {
      message.error('只能上传.txt, .docx, .md, .pdf文件!')
    } else if (!isLt10M) {
      message.error(`上传的文件${file.name}必须小于10MB!`)
    }

    if(((isFile && isLt10M) || Upload.LIST_IGNORE) === true){
      setConversations([]);
      setConversationInfo(null);
    }
    return (isFile && isLt10M) || Upload.LIST_IGNORE
  }

  const fileProps: any = {
    name: 'files',
    maxCount: 1,
    action: `chat/file_chat/${stateStorage.get('userInfo').id}`,
    listType: 'picture',
    accept: '.txt, .docx, .md, .pdf',
    fileList: fileList,
    beforeUpload: beforeUpload,
    data: { user_id:  stateStorage.get('userInfo').id },
    headers: {
      'Authorization': 'Bearer ' + stateStorage.get('token'),
    },
    onChange(info) {
      if(info.file.status === "uploading"){
        setFileList(info.fileList);
        chatTitleCallBack('新建对话');
      }
      if (info.file.response) {
        if(info.file.status === 'error') {
          setFileList([]);
          message.error(info.file.response.message);
        }
        if(info.file.status === 'done'){
          chatTitleCallBack(info.file.response.name);
          setFileList(info.fileList);
          setConversationInfo(info.file.response)
          info.fileList.length > 0 && setChatTypes('file_chat')
        }
      }
    }
  }



  /**
   * @desc 发送对话接口请求
   * @param {string}  message problem 内容
   * @param {object}  chat_info  conversationInfo
   * */
  const createChatHandle = async (message, chat_info) => {
    let chat_type = chat_info?.chat_type || chatTypes;
    // 对话期间，不可发送
    setCanSendMessage(false);
    // 每次发送新的提问，对话内容添加一条
    setConversations((pre:any) => {
      return [...pre, {
        answer: '<span className='+styles.loading+'></span>',
        problem: message,
        docs:''
      }]
    })
    // 接口请求参数
    let params = {
      query: message,
      conversation_id: conversationInfo?.id || chat_info?.id,
      stream: true,
      model: form.getFieldValue('model'),
      history_len: form.getFieldValue('history_len'),
      temperature: form.getFieldValue('temperature'),

      top_k: type===3 ? form.getFieldValue('top_k') : undefined,
      score_threshold: type===3 ? form.getFieldValue('score_threshold'): undefined,
      kb_name: type===3 ? kBValue?.kb_name: undefined,
      knowledge_id : conversationInfo?.temp_kb_id || chat_info?.temp_kb_id || undefined
    }

    let isClose = false;
    const controller = (signalRef.current = new AbortController())
    controller.signal?.addEventListener('abort', () => {
      setCanSendMessage(true);
      setConversations((pre) => {
        const copy:any = [...pre]
        const len = copy.length
        copy[len - 1].answer = result + (isClose ? '' : ('<span style="color: #fc5834; margin-left: 10px">' + stopText + '</span>'))
        return copy;
      });
    })

    let result = '';
    let docs='';
    let url = '';
    if(chat_type === 'llm_chat'){
      url = 'chat/chats';
    }else if(chat_type === 'file_chat'){
      url = 'chat/file_chat';
    }else{
      url = `chat/knowledge_bases/${kBValue?.kb_id}/kb_chat`
    }


    await fetchEventSource(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + stateStorage.get('token'),
      },
      method: 'POST',
      body: JSON.stringify(params),
      openWhenHidden: true,
      signal: controller.signal,
      async onopen(response) {
        if (response.ok) {
          if (response.headers.get('content-type').includes('text/event-stream')) {
            return
          } else {
            const data = await response?.json()
            const { msg = '服务器错误，请检查服务器！' } = data
            message.error(msg)
            controller.abort()
            throw new FatalError()
          }
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          message.error('服务器错误，请检查服务器！')
          controller.abort()
          throw new FatalError()
        } else {
          message.error('服务器错误，请检查服务器！')
          controller.abort()
          throw new RetriableError()
        }
      },
      async onmessage(res){

        if(res?.event==''){
          if(res?.data){
            const streamContent = JSON.parse(res?.data);
            result += streamContent?.answer || (streamContent?.choices && streamContent?.choices[0]?.delta?.content) || ''

            docs += streamContent?.docs || '';

            const tempNode = '<span className='+styles.loading+'></span>';
            // result += tempNode
            //进行连接正常的操作
            setConversations((pre) => {
              const copy:any = [...pre]
              const len = copy.length
              copy[len - 1].answer = result + tempNode
              copy[len - 1].docs = docs
              copy[len - 1] = copy[len - 1]
              return copy
            })
          }
          // }
        }
      },
      onclose() {//正常结束的回调
        isClose=true;
        controller.abort() //关闭连接
        // setTimeout(() => {
        //   let newData = cloneDeep(getConversations());
        //   let data:any = newData[newData.length-1]
        //   data.is_start = initDialog;
        //   data.app_id = sourceData.id;
        // })
      },
      onerror(err) {
        message.error('服务器错误，请检查服务器！')
        controller.abort()
        return 2000
      },
    })
  }

  /**
   * @desc 创建一个不带文件的新对话，拿conversationId
   * @param {string}  value problem 内容
   * */
  const createConversationsHandle = (value, chat_type) => {
    AssistantServices.createConversations({
      chat_type: chat_type || chatTypes,//'llm_chat',
      name: value,
      user_id: stateStorage.get('userInfo').id
    }).then(async (res) => {
      setLoading(false);
      setConversationInfo(res);
      chatTitleCallBack(res?.name);
      await createChatHandle(value, res);
    })
  }


  /**
   * @desc 创建一个带文件的新对话，跳转过来的处理//// 拿conversationId
   * @param {string}  value problem 内容
   * */
  const createFileConversationsHandle = (files) => {
    AssistantServices.createQuickFileChat({
      temp_file_name: files[0],
      user_id: stateStorage.get('userInfo').id
    }).then(async (res) => {
      setLoading(false);
      setConversationInfo(res);
      chatTitleCallBack(res?.name);
      await createChatHandle(problems?.problem, res);
      setProblems({
        problem: null,
        files:null
      })
    })
  }
  /**
   * @desc 发送对话
   * @param {string}  value problem 内容
   * */
  const sendChatHandle = async (value) => {
    setAutoScroll({
      type: true,
      options: ''
    });
    setFileList([]);
    conversationInfo?.id ? await createChatHandle(value, conversationInfo) : createConversationsHandle(value)
  }
  /**
   * @desc 停止生成
   * */
  const stopBuild = () => {
    signalRef.current.abort();
  }

  /**
   * @desc 获取对话信息详情
   * @param {string}  conversationId  对话ID
   * */
  const getConversationInfoHandle = (conversationId, conversation_content) => {
    AssistantServices.getConversationInfo({conversationId}).then((res) => {
      // 是否从首页跳转过来，清空记录，并发送对话
      if(problems?.problem){
        if(res?.chat_type === 'file_chat'){
          // 最近对话是文件的，需要重新开启对话
          setConversations([]);
          createConversationsHandle(problems?.problem, 'llm_chat')
        }else{
          setLoading(false);
          setConversationInfo(res);
          setConversations(conversation_content);
          createChatHandle(problems?.problem, res);
        }
        setProblems({problem: null});
      }else{
        setConversationInfo(res);
        // 对话内容
        setConversations(conversation_content);
        setLoading(false);
      }
      setAutoScroll({
        type: true,
        options: ''
      })
    })
  }

  /**
   * @desc 获取历史记录详情
   * @param {string}  id  对话ID === conversationId
   * */
  const getHistoryDetailHandle = (id) => {
    setLoading(true);
    AssistantServices.getHistoryDetailConversations({conversationId: id}).then((res) => {
      let array = [];
      res.forEach((item) => {
        array.push({
          problem: item.query,
          answer: item.response
        })
      });
      setFileList([]);
      getConversationInfoHandle(id, array);
    })
  }

  /**
   * @desc 查看历史对话，若有存在历史
   * @param {string}  chatType  对话类型 多轮对话/llm_chat,file_chat  知识库对话/kb_chat
   * */
  const getInitConversations = (chatType) => {
    setLoading(true);
    AssistantServices.getHistoryConversations({userId: stateStorage.get('userInfo').id, chatType: chatType}).then((res) => {
      // 初始化判断是否是从首页跳转过来的
      if(problems?.problem){
        if(problems?.files){
          // 从首页跳转过来 有文件，创建新的对话 file_chat
          createFileConversationsHandle(problems?.files);
        }else{
          // 没有文件，判断是否有历史 llm_chat
          if(typeof res === "object" && res?.length >0){
            // 查看历史详情，并开启对话
            getHistoryDetailHandle(res[0]?.id)
          }else{
            // 没有历史，开启新对话
            createConversationsHandle(problems?.problem, 'llm_chat');
            setProblems({problem: null})
          }
        }
      }else{
        if(typeof res === "object" && res?.length > 0) {
          chatTitleCallBack(res[0]?.name || '新建对话');
          getHistoryDetailHandle(res[0]?.id);
        }else{
          setLoading(false);
        }
      }


    }).catch(() => setLoading(false))
  }




 /**
  * @desc 触发置顶、置底操作
  * @param {string} key top/bottom
  * */
  const scrollMoveHandle = (key) => {
    if(key === 'top'){
      setAutoScroll({
        type: false,
        options: 'top'
      });
    }else{
      !autoScroll.type &&
      setAutoScroll({
        type: true,
        options: 'bottom'
      });
    }
  }


  useEffect(() => {
    if(autoScroll.type){
      chatContainerRef?.current?.scrollTop =  chatContainerRef?.current?.scrollHeight - chatContainerRef?.current?.clientHeight;
    }else if(!autoScroll.type && autoScroll.options==='top'){
      chatContainerRef?.current?.scrollTop = 0;
    }
    const handleScroll = (e) => {
      if(e.wheelDelta > 0){
        setAutoScroll({
          type: false,
          options: ''
        });
      }else{
        setIsAtBottom(chatContainerRef?.current?.scrollHeight - chatContainerRef?.current?.scrollTop === chatContainerRef?.current?.clientHeight);
      }
    };
    window.addEventListener('wheel', handleScroll, false);
  }, [conversations, autoScroll]);

  useEffect(() => {
    if (isAtBottom) {
      setAutoScroll({
        type: true,
        options: ''
      });
    }
  }, [isAtBottom]);


  /**
   * @desc 获取知识库
   * */
  const getKBListHandle = () => {
    AssistantServices.getKBbyUserId({userId: stateStorage.get('userInfo').id, appendKB: 'publicKB,groupedKB'}).then((res) => {
      setKbList(res);
      let kb = problems?.kb ? problems?.kb : (res?.length > 0 ? res[0] : [])
      setKBValue(kb)
    })
  }

  useEffect(() => {
    chatTitleCallBack('');
    setFileList([]);
    setConversations([]);
    setConversationInfo(null);
    if(type === 2){
      if(problems?.files) {
        setChatTypes('file_chat');
      }else{
        setChatTypes('llm_chat');
      }
      getInitConversations('llm_chat,file_chat');
    }else if(type === 3){
      getKBListHandle();
      setChatTypes('kb_chat');
      getInitConversations('kb_chat');
    }
  }, [type]);



  return (
    <Spin spinning={loading} style={{position: 'fixed'}}>
      <div className={styles.view}>
          <div className={`${styles.content}  ${open ? styles.showCon : styles.closeCon}`}>

            <HistoryCompontent
              type={type}
              open={open}
              className={styles.historyList}
              conversationInfo={conversationInfo}
              chatTitleCallBack={chatTitleCallBack}
              historyDetailCallBack={(info) => {
                getHistoryDetailHandle(info?.id);
              }}/>

            <div className={styles.dialog}>
              {
                conversations.length > 0 ?
                  <div
                    ref={chatContainerRef}
                    className={`${styles.dialog_content} ${fileList.length > 0 ? styles.dialog_file_content : ''}`}>
                    {
                      conversations.map((item, index) => {
                        return <span key={index}>
                          <UserConversations content={item?.problem} conversationInfo={conversationInfo}/>
                          <AIConversations content={item?.answer} docs={item?.docs}/>
                        </span>;
                      })
                    }
                  </div> :
                  <div className={styles.empty}>
                    <div className={styles.emptyContent}>
                      你好！我是你的AI教学助教。你可以问我任何与教学最佳实践或学校工作相关的问题。<br />
                      你的问题越具体，我的回答就会越好。我今天能如何帮助你？
                    </div>
                  </div>
              }

              <div className={styles.transit}></div>
              <InputDialogCompontent
                form={form}
                type={type}
                fileProps={fileProps}
                sendChatHandle={sendChatHandle}
                stopChatHandle={() => stopBuild()}
                canSendMessage={canSendMessage}
                scrollMove={(key) => scrollMoveHandle(key)}
                kbList={kbList}
                kBValue={kBValue}
                setKBValue={(val) => setKBValue(val)}
                createNewConversations={() => {
                  // 创建一个新对话，默认均是不带文件的
                  setChatTypes(type===2 ? 'llm_chat' : 'kb_chat');
                  setFileList([]);
                  setConversations([]);
                  setConversationInfo(null);
                }} />
            </div>
          </div>

          <div className={`${styles.arrowHistory} ${open ? styles.close : styles.open}`} onClick={() => setOpen(!open)}>
            <ArrowSvg />
          </div>
      </div>
    </Spin>
  )
    ;
};

export default Dialog;
