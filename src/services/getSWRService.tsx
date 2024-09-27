import { useRequest } from 'ahooks';
import * as CommonService from '@src/services/common';
import stateStorage from '@src/storage/stateStorage';
import { notification } from 'antd';
import * as _ from 'lodash-es';
/**
 * @AUTHOR zhy
 * @DATE zhy (2022/12/26)
 * @Description:
 */

/**
 * @desc 获取需要轮询的接口，并做处理
 * */
export const getSWRService = (keys: any) => {
  let userInfo = stateStorage.get('userInfo');
  if (keys?.includes('eventMessages')) {
    const {
      data: sourceData,
      loading: isLoading,
      run: runLoop,
      cancel: cancelLoop
    }: any = useRequest(
      () =>
        CommonService.getEventMessages({
          lastMessageId: userInfo?.lastMessageId || 0
        }).then((res) => {
          if (res.length > 0) {
            userInfo.lastMessageId = res[res.length - 1].id; //userInfo.lastMessageId +1;
            stateStorage.set('userInfo', userInfo);
            let currentSourceData = stateStorage.get('LoopData') || [];

            stateStorage.set('LoopData', [...currentSourceData, ...res]);
          }
          return res;
        }),
      {
        manual: true,
        pollingInterval: 10000
      }
    );

    return { runLoop, cancelLoop, isLoading, sourceData };
  }
};

/**
 * @dec 重写数据返回信息,调用该轮询方法逻辑如下：
 *      1、项目进入的时候会进行调用getSWRService的轮询方法，并将数据放入localStorage中
 *      2、该方法会轮询我们同步、申请等操作，将返回的数据与当前调用的对应上的，弹出提示信息
 *      3、只有在轮询中成功与失败的情况下停止轮询，否则继续轮询
 *      4、当然，其中非成功或者失败的情况下，可将信息通过callback回调返回，并调整对应页面的显示状态等
 * @param {string} type 需要监听轮询的类型，比如：Orchestration申请编排 Synchronize 同步
 * @param {function} t 多语言
 * @param {function} callback 回调
 * @param {number} 申请需要ID 确认当前申请、vm信息
 *
 * */
export const getLoopUnreadMessage = (type, t, callback, id?: number) => {
  let timer: any = setInterval(() => {
    let unreadMsg = stateStorage.get('LoopData');
    if (unreadMsg && unreadMsg.length > 0) {
      unreadMsg.forEach((msgItem, index) => {
        // msgItem?.eventObject 存在 表示 vm列表中的同步  否则是 申请里面的同步
        let currentItemId = msgItem?.eventObject ? JSON.parse(msgItem?.eventObject).id : msgItem.sourceId;
        if (_.isNil(id) ? msgItem?.type === type : msgItem?.type === type && id === currentItemId) {
          let midData = _.cloneDeep(unreadMsg);
          // 删除当前轮询的信息
          midData.splice(index, 1);
          stateStorage.set('LoopData', midData);

          // 回调
          callback(msgItem);

          // 提示信息
          // getMessageType(t, msgItem);

          // 只有在轮询中成功与失败的情况下停止轮询，否则继续轮询
          if (msgItem.statusCode === 'Success' || msgItem.statusCode === 'Failed') {
            clearInterval(timer);
          }
        }
      });
    }
  }, 1000);
};

/**
 * @desc 设置轮询的serviceKey
 * */
export const setLoopService = (keys) => {
  stateStorage.set('swrService', Array.from(new Set(keys.concat(stateStorage.get('swrService') || []))));
  return getSWRService(keys);
};
