/**
 * @AUTHOR zhy
 * @DATE zhy (2022/2/8)
 * @Description:
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import i18nObject from './locales/i18nData';
import i18nMenu from './locales/i18nMenu';
import i18nCode from './locales/i18nCode';
import { LocalItems } from './locales/locales';
import stateStorage from '@src/storage/stateStorage';
import * as _ from 'lodash-es';
import { debounce } from 'lodash-es';
import md5 from 'js-md5';
// 语言资源集合
let _i18nData: LocalItems = i18nObject.concat(i18nCode);
let _i18nDataByTitle: LocalItems = i18nMenu;
let i18nAllData: LocalItems = _i18nData.concat(_i18nDataByTitle);

/**
 * @desc 多语言重复筛查----只需要判断zh
 * @param {object} data 多语言翻译集合
 * */
(function checkData(data) {
  let errorObj: any = [];
  for (let index = 0; index < data.length; index++) {
    let i18n_item = data[index] || {};
    // 只需要判断中文不重复，中文翻译在英文中可同
    data.filter((el: any) => el.zh === i18n_item.zh).length > 1 && errorObj.push(i18n_item.zh);
  }
  errorObj = [...new Set(errorObj)].map((item) => ({ type: 'zh', val: item }));
  if (errorObj.length) {
    // eslint-disable-next-line
    console.clear();
    console.error('国际化存在重复数据！,请处理！', errorObj);
    // eslint-disable-next-line
    console.table(errorObj);
  }
})(_i18nData);

/**
 * @desc 多语言重复筛查云平台info data----判断title
 * @param {object} data 云平台info data-多语言翻译集合
 * */
(function checkVendorInfoData(data) {
  let errorObj: any = [];
  for (let index = 0; index < data.length; index++) {
    let i18n_item = data[index] || {};

    // 只需要判断title不重复
    data.filter((el: any) => el.title === i18n_item.title).length > 1 &&
      i18n_item.title &&
      errorObj.push(i18n_item.title);
  }
  errorObj = [...new Set(errorObj)].map((item) => ({ type: 'title', val: item }));
  if (errorObj.length) {
    console.error('数据国际化存在重复title数据！,请处理！', errorObj);
    // eslint-disable-next-line
    console.table(errorObj);
  }
})(_i18nDataByTitle);

let i18nData: object = {};
for (let index = 0; index < i18nAllData.length; index++) {
  let item = i18nAllData[index];
  if (item?.title) {
    let key: any = item?.title;
    i18nData[key] = item;
  }
  let key = item.zh;
  if (key) {
    i18nData[key] = item;
  } else {
    // eslint-disable-next-line
    console.clear();
    throw new Error('国际化中存在缺少key为zh的对象,请检查确认！');
  }
}

// i18n 配置
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
i18n.use(initReactI18next).init({
  resources: {},
  fallbackLng: 'CN',
  interpolation: {
    escapeValue: false
  },
  defaultNS: 'translations'
});

let unTrans = new Set();
// const appId = '20221212001494426';
// const appKey = 'eirewxoC3_j8sEPnUJp8'; // 密钥

const appId = '20230329001619811';
const appKey = 'Zpz64WzHt1l5RQVYRexA'; // 密钥
const salt = Math.random().toString().split('.')[1];

/**
 * 英语首字母大写
 * @param str
 * @returns
 */
function firstUpperCase(str) {
  return str?.substring(0, 1).toUpperCase() + str?.substring(1);
}

/**
 * 调用百度翻译API进行翻译
 * @param q 待翻译文本
 * 每月100万字符免费， QPS 为 10。
 * 如果接口提示“54004，账户余额不足”， 请再注册一个账号：
 *      如何使用通用翻译API？
            使用您的百度账号登录百度翻译开放平台；
            注册成为开发者，获得 APPID ；
            进行开发者认证；
 *      https://fanyi-api.baidu.com/doc/21
 */
const getTrans = async (q) => {
  const str = appId + q + salt + appKey;
  const sign = md5(str);
  // let [cht, en]: any = [];
  let [cht, en]: any = await Promise.allSettled(
    ['cht', 'en'].map((lang) =>
      fetch(`/baidu-trans?q=${encodeURI(q)}&sign=${sign}&from=zh&to=${lang}&salt=${salt}&appid=${appId}`)
        .then((response) => response.json())
        .then((data) => {
          // 账户余额不足
          if (data?.error_code === '54004' || data?.error_code === '54001' || data?.error_code === '52003') {
            return null;
          }
          return data.trans_result[0]?.dst || '-';
        })
    )
  );
  cht = cht.status === 'fulfilled' ? cht.value : '-';
  en = en.status === 'fulfilled' ? firstUpperCase(en.value) : '-';

  // 简单处理一下限流的问题
  if (cht === '-' || en === '-') {
    return getTrans(q);
  }
  return {
    zh: q,
    tw: cht,
    en
  };
};

const logUntrans = debounce(async () => {
  let res = await Promise.all(Array.from(unTrans).map((key) => getTrans(key)));
  // 影响开发控制台信息-暂时注释
  // console.clear();
  console.error('国际化中存在未翻译的数据！,请处理！');
  // eslint-disable-next-line
  console.log(JSON.stringify(res, null, 4).replace(/"/g, "'"));
}, 2000);

i18n.t = (key: string, dataObj = {}) => {
  let lang = stateStorage.get('lang') || 'CN';
  lang =
    {
      EN: 'en',
      CN: 'zh',
      TW: 'tw'
    }[lang] || 'zh';
  let val;
  if (i18nData[key]) {
    val = i18nData[key][lang];
  } else {
    // 国际化翻译过滤当前key是否为title中内容 - 即是否为后端返回的key
    let MenuItem = Object.values(i18nData)?.filter((el: any) =>
      typeof el.title === 'string' ? el.title === key : (el.title || []).includes(key)
    );
    let obj = MenuItem.length === 0 ? {} : MenuItem[0];
    val = obj[lang];
  }

  // 当处于开发环境并且key中含有中文时
  // 当前<==项目==>中未有翻译
  if (process.env.NODE_ENV === 'development' && _.isNil(val) && /[\u4E00-\u9FA5]+/g.test(key)) {
    unTrans.add(key);
    logUntrans();
  }

  val = val || key;
  let keys = Object.keys(dataObj);
  if (keys.length) {
    for (let _key in keys) {
      let objKey = keys[_key];
      let r = RegExp(`\\$\{${objKey}\\}`, 'g');
      val = val.replace(r, dataObj[objKey]);
    }
  }

  return val;
};

export default i18n;
