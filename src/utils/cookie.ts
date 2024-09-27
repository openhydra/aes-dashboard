// import { isArray } from 'lodash';
//
// export default class cookie {
//   static getTokenDomain = () => {
//     // eslint-disable-next-line no-restricted-globals
//     const { hostname } = location;
//     // cpcs portal 的token和官网共用
//     if (hostname.includes('console.')) {
//       return hostname.replace('console.', '');
//     }
//     return hostname;
//   };
//
//   static get = (sKey) =>
//     decodeURIComponent(
//       document.cookie.replace(
//         new RegExp(`(?:(?:^|.*;)\\s*${encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&')}\\s*\\=\\s*([^;]*).*$)|^.*$`),
//         '$1'
//       )
//     ) || null;
//
//   static set = (sKey, sValue, vEnd: any, sPath: any = '/', sDomain: any, bSecure: any) => {
//     let domain = sDomain;
//     // X-Auth-Token 放在一级域名与官网共用
//     if (sKey === 'X-Auth-Token') {
//       domain = cookie.getTokenDomain();
//     }
//
//     // eslint-disable-next-line no-useless-escape
//     if (!sKey || /^(?:expires|max\-age|path|secure)$/i.test(sKey)) {
//       return false;
//     }
//     let sExpires = '';
//     if (vEnd) {
//       switch (vEnd.constructor) {
//         case Number:
//           sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : `; max-age=${vEnd}`;
//           break;
//         case String:
//           sExpires = `; expires=${vEnd}`;
//           break;
//         case Date:
//           sExpires = `; expires=${vEnd.toUTCString()}`;
//           break;
//         default:
//           break;
//       }
//     }
//     document.cookie = `${encodeURIComponent(sKey)}=${encodeURIComponent(sValue)}${sExpires}${
//       domain ? `; domain=${domain}` : ''
//     }${sPath ? `; path=${sPath}` : ''}${bSecure ? '; secure' : ''}`;
//     return true;
//   };
//
//   static remove = (sKey, sPath = '/', sDomain) => {
//     if (!sKey || !cookie.has(sKey)) {
//       return false;
//     }
//     document.cookie = `${encodeURIComponent(sKey)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${
//       sDomain ? `; domain=${sDomain}` : ''
//     }${sPath ? `; path=${sPath}` : ''}`;
//     return true;
//   };
//
//   static removeAll = () => {
//     const keys: any = document.cookie.match(/[^ =;]+(?==)/g);
//     if (isArray(keys)) {
//       keys.forEach((key) => {
//         let domain;
//         // X-Auth-Token 放在一级域名, 删除时，需要带上域名
//         if (key === 'X-Auth-Token') {
//           domain = cookie.getTokenDomain();
//         }
//         cookie.remove(key, '/', domain);
//       });
//     }
//   };
//
//   static has = (sKey) =>
//     new RegExp(`(?:^|;\\s*)${encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&')}\\s*\\=`).test(document.cookie);
// }
