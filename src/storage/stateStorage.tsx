// const GLOBAL_KEY = 'caches-';
const GLOBAL_KEY = '';

/**
 * 判断保存的内容是否过期
 * @param {String} content 保存的字符串
 */
function checkExpire(content: string | any) {
  // 保存时，没有设置过期时间，认为不会过期
  if (!content.expires) {
    return false;
  }

  return new Date().getTime() > content.expires;
}

/**
 * 获取数据
 * @param key
 */
function _get(key: string) {
  let content: any = localStorage.getItem(key);
  if (!content) {
    return null;
  }
  content = JSON.parse(content);
  const expiresd = checkExpire(content);
  if (expiresd) {
    this.del(key);
    return null;
  } else {
    return content;
  }
}

// 用户数据缓存
export default {
  // 设置数据，expires为过期时间，单位为天
  set(key: string, value: string | any, expires?: number | undefined) {
    if (typeof key !== 'string') {
      throw new Error('Property [key] require string type');
    }

    if (expires !== undefined && typeof expires !== 'number') {
      throw new Error('Property [expires] require number type');
    }

    const result: any = {
      value: value
    };
    if (expires) {
      result.expires = new Date().getTime() + 1000 * 3600 * 24 * expires;
    }

    localStorage.setItem(GLOBAL_KEY + key, JSON.stringify(result));
  },
  // 获取数据
  get(key: string) {
    const content = _get(GLOBAL_KEY + key);
    return content?.value;
  },
  // 删除数据
  del(key: string) {
    localStorage.removeItem(GLOBAL_KEY + key);
  },
  // 清空所有数据
  clear() {
    const len = localStorage.length;
    const keys: any = [];
    for (let index = 0; index < len; index++) {
      const key: any = localStorage.key(index);
      if (key.indexOf(GLOBAL_KEY) === 0) {
        keys.push(key);
      }
    }
    keys.forEach((key: any) => localStorage.removeItem(key));
  },
  // 获取所有保存的键值
  keys() {
    const len = GLOBAL_KEY.length;
    const keys: any = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key: any = localStorage.key(index);
      if (key.indexOf(GLOBAL_KEY) === 0) {
        const pureKey = key.slice(len);
        this.get(pureKey) && keys.push(pureKey);
      }
    }

    return keys;
  },
  // 获取数量
  size() {
    return this.keys().length;
  },
  // 是否过期
  isExpire(key: string) {
    const content = localStorage.getItem(GLOBAL_KEY + key);
    // 如果不存在，当做已过期处理
    if (!content) {
      return true;
    }

    return checkExpire(JSON.parse(content));
  }
};
