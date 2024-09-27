/**
 * @AUTHOR zhy
 * @DATE zhy (2022/12/27)
 * @Description:  各种常用正则
 */

/**
 * @desc email/邮箱校验  来源参考：https://www.jianshu.com/p/b6e2f279d33f
 * @param {string} value
 * @returns {boolean}
 */
export function checkEmail(value) {
  return /^(\w+|\w+\.\w+)@[\da-z\\.-]+\.([a-z]{2,6}|[\u2E80-\u9FFF]{2,3})$/.test(value);
}

/**
 * @desc 检验电话号码
 * @param {string} value
 * @returns {boolean}
 */
export function checkPhone(value) {
  return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value);
}

/**
 * @desc 检验添加用户的登陆密码   密码需要包含数字、字母、特殊字符，且长度为8-20位
 * @param {string} value
 * @returns {boolean}
 */
export function checkPassword(value) {
  return /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^(0-9a-zA-Z)]).{8,20}$/.test(value);
}

/**
 * @desc 检验添加用户的登陆密码   密码需要包含数字、字母、且长度最少为7位
 * @param {string} value
 * @returns {boolean}
 */
export function checkKeystonePassword(value) {
  let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>~`\-=_+\\\[\];'/]{6,20}$/;
  return reg.test(value);
  // let number = /[0-9]+/;
  // let letter = /[a-zA-Z]+/;
  // let haveNumber = number.test(value);
  // let haveLetter = letter.test(value);
  //
  // if (haveNumber && haveLetter && value.length > 6) {
  //   return true;
  // } else {
  //   return false;
  // }
}
