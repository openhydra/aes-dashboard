/**
 * @AUTHOR zhy
 * @DATE 2022/2/10
 * @Description:
 */
import conf from '@src/config';
import * as _ from 'lodash-es';
import stateStorage from '@src/storage/stateStorage';
/**
 * @desc 根据urlKey获取请求的URL
 *
 * @urlKey {string} 请求url 的 key 由开发者自定义，不可重复
 *
 * @return {obj} 请求url 以及请求的headers的一些设置
 * */
export const getCurrentUrlByKey = (urlKey: string): object | any => {
  const url: { [url: string]: any } = conf.apiServiceConf.resources[urlKey];

  if (_.isNil(url)) {
    return null;
  }

  // 判断调用key是否存在
  const setting = Object.assign({}, conf.apiServiceConf.setting);
  if (_.isNil(setting)) {
    throw new Error(`No setting config for route ${urlKey}`);
  }

  return Object.assign({}, { url }, { setting });
};

/**
 * @desc 根据urlKey获取请求的URL
 *
 * @params {obj} 请求参数
 *
 * @urlKey {string} 请求url 的 key 由开发者自定义，不可重复
 *
 * @return {obj} 请求url拼装结果
 * */
export const getFullUrlByUrlKey = (urlKey: string, params: any): string => {
  const urlConfig: any = getCurrentUrlByKey(urlKey);

  if (_.isNil(urlConfig)) {
    throw new Error(`No restful service config for route ${urlKey}`);
  }

  let url = urlConfig.url.url;

  if (params) {
    const list: any = [];

    if (url.includes('{')) {
      url = url.replace(/{[a-z|A-Z]+}/g, function (match) {
        let keyParam = match.replace('{', '').replace('}', '');
        if (!_.isNil(params[keyParam])) {
          let newContent = params[keyParam];
          delete params[keyParam];
          return newContent;
        }
      });
      if (Object.keys(params).length > 0) {
        for (const key in params) {
          const str = `${key}=${params[key]}`;
          list.push(str);
        }
        const data = list.join('&');
        url = `${url}?${data}`;
      }
    } else {
      for (const key in params) {
        if(Array.isArray(params[key])){
          params[key].forEach((item) => {
            const str = `${key}=${item}`;
            list.push(str);
          })
        }else{
          const str = `${key}=${params[key]}`;
          list.push(str);
        }

      }
      const data = list.join('&');
      url = `${url}?${data}`;
    }
  }
  const prefix = conf.apiServiceConf.setting.prefix;
  // const serviceHostConf = conf.apiServiceConf.serviceHost;
  if (url.startsWith('coreApi') || url.startsWith('chat') || url.startsWith('xinference')) {
    return `/${url}`;
  }else if (url.startsWith('extendV1')) {
    return `${prefix.split('/v1')[0]}/${url}`;
  }else {
    return `${prefix}${url}`;
  }
};

export const setCommonHeaders = (urlKey: string) => {
  const headers = getCurrentUrlByKey(urlKey).setting.headers;

  const token = stateStorage.get('token');
  if (token) {
    Object.assign(headers, { 'Authorization': 'Bearer ' + token });
  }

  return headers;
};
