// import stateStorage from './stateStorage';
// import cookie from '@src/utils/cookie';
// import { get as _get } from 'lodash';
// import { getProjectRoleByPriority } from '@src/services/organization/role';
//
// export const updateUserRoleTokenPolicy = (user, policies, lastMessage) => {
//   let userInfo = {
//     id: user.user.id,
//     userName: user.user.name,
//     token: user.keystone_token,
//     customerName: user.customerName,
//     enterpriseId: user.user.domain.id,
//     enterpriseName: user.user.domain.name,
//     roleList: user.roles.filter((item) => item.name.indexOf('keystone_') === -1),
//     projectList: Object.keys(user.projects).map((key) => ({ ...user.projects[key], id: key })),
//     project: user.project,
//     lastMessageId: lastMessage || 0
//   };
//
//   stateStorage.set('region', user.region);
//   stateStorage.set('userInfo', userInfo);
//   stateStorage.set('lang', 'CN');
//   stateStorage.set('loginType', 'caas');
//
//   const Domain = {
//     name: _get(user, 'user.domain.name', ''),
//     id: _get(user, 'user.domain.id', '')
//   };
//
//   cookie.set('Domain', JSON.stringify(Domain), '', '', '', '');
//
//   if (user?.user?.name === 'administrator') {
//     stateStorage.set('role', 'system_admin');
//   } else {
//     // 筛选出domainRole，不包含 keystone_,不包含 project_,包含 domain_
//     let domainRole = user.roles
//       .map((item) => item.name)
//       .filter((item) => /^(?!.*keystone_)(?!.*project_).*domain_/.test(item))
//       .pop();
//     stateStorage.set('domainRole', domainRole);
//     // 筛选出projectRole，  不包含 keystone_,不包含 domain_,包含 project_
//     let roleList = user.roles
//       .map((item) => item.name)
//       .filter((item) => /^(?!.*keystone_)(?!.*domain_).*project_/.test(item));
//     let role = '';
//     if (roleList.length === 0) {
//       // 在该项目没有被任何方式设置项目身份，手动继承domain的对应身份
//       role = `project_${domainRole.split('_')[1]}`;
//     } else if (roleList.length === 1) {
//       role = roleList.pop();
//     } else if (roleList.length === 2) {
//       // 同时设置了‘全部项目’和指定项目，取权限最高的
//       role = getProjectRoleByPriority(roleList);
//     }
//     stateStorage.set('role', role);
//   }
//
//   stateStorage.set('permissionList', policies?.policies);
// };
//
// export const logout = () => {
//   stateStorage.clear();
//   cookie.removeAll();
// };
//
// export default {
//   updateUserRoleTokenPolicy,
//   logout
// };
