/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET, POST, DELETE, PATCH, UPLOAD } from '@src/fetchUtil/fetchUtil';


export const getHomeKnowledge = (params:any) =>
  GET('getHomeKnowledge', null, params, false);

export const getHomeQuickStart = (params:any) =>
  GET('getHomeQuickStart', null, params, false);

export const getHistoryConversations = (params:any) =>
  GET('getHistoryConversations', null, params, false);

export const getHistoryDetailConversations = (params:any) =>
  GET('getHistoryDetailConversations', null, params, false);

export const delHistoryConversations = (params:any) =>
  DELETE('delHistoryConversations', null, params, false);


/*****************************************************************************/
export const getConversationInfo = (params:any) =>
  GET('getConversationInfo', null, params, false);



export const createConversations = (body:any) =>
  POST('createConversations', body, null, false);

export const createQuickFileChat = (body:any) =>
  POST('createQuickFileChat', body, null, false);



export const createKB = (body:any) =>
  POST('createKB', body, null, false);

export const updateKB = (body:any, params:any) =>
  PATCH('updateKB', body, params, false);

export const delKB = (params:any) =>
  DELETE('delKB', null, params, false);

export const getKBDetail = (params:any) =>
  GET('getKBDetail', null, params, false);

export const getKBFile = (params:any) =>
  GET('getKBFile', null, params, false);

export const uploadKBFile = (body:any, params:any) =>
  UPLOAD('uploadKBFile', body, params, false);

export const delKBFile = (body:any, params:any) =>
  DELETE('delKBFile', body, params, false);

export const getKBbyUserId = (params:any) =>
  GET('getKBbyUserId', null, params, false);

export const getModels = (params:any) =>
  GET('getModels', null, params, false);





