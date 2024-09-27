/**
 * @AUTHOR zhy
 * @DATE 2022/2/10
 * @Description:
 */
import { message } from 'antd';
import * as utils from './utils';
import fetchTimeout from './fetchTimeout';
import stateStorage from '@src/storage/stateStorage';
import axios from 'axios';
import '../mock';
import i18n from '@src/i18n/i18n';

import { RemovePropertyOfNull } from '@src/utils';

/**
 * @description: 移除无效属性，目前只针对对象进行处理
 * @param {*} data
 * @return {*}
 */
function RemoveInvalidData(data) {
  if (data && Object.prototype.toString.call(data) === '[object Object]') {
    data = RemovePropertyOfNull(data);
  }
  return data;
}

const getLogin = (tips) => {
  stateStorage.clear();
  message.destroy();
  message.warning({
    content: tips,
    onClose: () => window.location.pathname = '/login'
  });
};

const GET = async (route: any, body: any, params: any, isMock: boolean | undefined) => {
  body = RemoveInvalidData(body);
  params = RemoveInvalidData(params);

  // eslint-disable-next-line no-use-before-define
  return await useFetch(
    route,
    'get',
    body,
    {
      ...(params || {}),
      noCache: +new Date()
    },
    isMock
  );
};

const POST = async (route: string, body: any, params: null, isMock: boolean | undefined) => {
  body = RemoveInvalidData(body);
  params = RemoveInvalidData(params);
  // eslint-disable-next-line no-use-before-define
  return await useFetch(route, 'post', body, params, isMock);
};
const UPLOAD = async (route: string, body: any, params: null, isMock: boolean | undefined, header?: any) =>
  // eslint-disable-next-line no-use-before-define
  await useFetch(route, 'post', body, params, isMock, header || {}, 'UPLOAD');
const DOWNLOAD = async (route: string, method: string, body: any, params: any, isMock: boolean | undefined) => {
  body = RemoveInvalidData(body);
  params = RemoveInvalidData(params);
  // eslint-disable-next-line no-use-before-define
  return await useFetch(route, method || 'post', body, params, isMock, {}, 'DOWNLOAD');
};

const PUT = async (route: any, body: any, params: null, isMock: boolean) => {
  body = RemoveInvalidData(body);
  params = RemoveInvalidData(params);
  // eslint-disable-next-line no-use-before-define
  return await useFetch(route, 'put', body, params, isMock, {}, 'PUT');
};

const PATCH = async (route: any, body: any, params: null, isMock: boolean) => {
  body = RemoveInvalidData(body);
  params = RemoveInvalidData(params);
  // eslint-disable-next-line no-use-before-define
  return await useFetch(route, 'PATCH', body, params, isMock, {}, 'PUT');
};
const HEAD = async (route: any, body: any, params: null, isMock: boolean) => {
  body = RemoveInvalidData(body);
  params = RemoveInvalidData(params);
  // eslint-disable-next-line no-use-before-define
  return await useFetch(route, 'HEAD', body, params, isMock);
};

const DELETE = async (route: any, query: any, params: null, isMock: boolean) =>
  // eslint-disable-next-line no-use-before-define
  await useFetch(route, 'delete', query, params, isMock);

// const GET_SWR =  (route: any, query: any, params: any,  isMock:boolean, options: any) => {
//     query = RemoveInvalidData(query);
//     params = RemoveInvalidData(params);
//     // eslint-disable-next-line no-use-before-define
//     return useGetFetch(route, query, params, isMock, options);
// };

const useFetch = async (
  route: string,
  method: string,
  body: { [x: string]: string } | undefined,
  params: boolean | null | undefined,
  isMock = false,
  headers = {},
  type?: string
) => {
  if (!route) {
    throw new Error('API Route is undefined');
  }
  // 全路径
  const fullRoute = utils.getFullUrlByUrlKey(route, params);

  // 请求header
  const _headers = utils.setCommonHeaders(route);
  // eslint-disable-next-line no-use-before-define
  let opts = { method, headers: { ..._headers, ...headers }, timeout: getTimeout(route) };

  if (body) {
    switch (type) {
      case 'UPLOAD':
        delete opts.headers['Content-Type'];
        delete opts.headers['Accept'];
        Object.assign(opts, { body: body });
        break;
      case 'PUT':
        if (/^\/api\/sysConfigs\/percentage/.test(fullRoute)) {
          Object.assign(opts, { body: body });
        } else {
          Object.assign(opts, { body: JSON.stringify(body) });
        }
        break;
      default:
        Object.assign(opts, { body: JSON.stringify(body) });
        break;
    }
  }
  if (isMock) {
    const response = axios[opts.method](
        utils.getCurrentUrlByKey(route).setting.prefix +
    utils.getCurrentUrlByKey(route).url.url
    );
    return response.then((res) => res.data);
    // console.error('mock重写了XMLHttpRequest对象暂时被移除,否则会影响联通云文件上传（aws的sdk中使用的是XMLHttpRequest发起的请求）');
  } else {

    const _fetchPromise = (url: string, opts: { method?: string; headers?: any; timeout: any }) =>
      fetchTimeout(fetch(url, { ...opts, credentials: 'same-origin' }), opts.timeout);
    try {
      const response = await _fetchPromise(fullRoute, opts);
      if (type === 'DOWNLOAD') {
        const { status, statusText } = response;
        if (status === 200 || status === 204 || status === 201) {
          return response.blob();
        }
        const msg = `下载失败:${status}-${statusText}`;
        message.error({
          duration: 5,
          content: msg
        });
        return Promise.reject(msg);
      } else if (method === 'HEAD') {
        return response.headers;
      } else if (fullRoute.includes('OS-OAUTH2/access_token')) {
        return response.headers;
      } else {
        let result = await response.text();
        let resType = response.headers.get('content-type');
        if (resType) {
          if (typeof result == 'string' && (result.indexOf('{') == 0|| result.indexOf('[') == 0) ) {
            result = JSON.parse(result);
          }
        }
        if (response.status !== 200 && response.status !== 204 && response.status !== 201 && response.status !== 403 ) {
          let errorTips = {};
          result?.params?.forEach((item, index) => {
            errorTips[index] = item;
          });

          // cmp中返回code----代表报错
          switch (response.status) {
            case 460:
              stateStorage.set('Token', response.headers.get('token'), 0.5);
              break;
            case 401:
              // case 461:
              if (window.location.pathname !== '/login')
                getLogin(result?.error?.message ||  response?.statusText);
              break;
            case 500:
              message.warning({
                content:
                  '错误信息：' + (result?.errMsg || result?.reason || result?.message)
              });
              break;
            default:
              console.error('请求错误信息：', result);

              message.warning({
                content:
                  '错误信息：' + (result?.errMsg || result?.reason || result?.message)
              });

              break;
          }
          return Promise.reject(result);
        } else {
          if(response.status === 403){
            // 没有权限，但是业务上有使用，默认都返回空
            return null;
          }else{
            return result;
          }
        }
      }
    } catch (ex) {
      console.error('错误信息：', ex);
      message.error({
        duration: 5,
        content: '网络错误，请稍后刷新页面再试'
      });
      throw ex;
    }
  }
};

const getTimeout = (route: string) => {
  const conf = utils.getCurrentUrlByKey(route);
  return conf.setting.timeout || 0;
};


export { GET, POST, PUT, DELETE, DOWNLOAD, UPLOAD, PATCH, HEAD };
