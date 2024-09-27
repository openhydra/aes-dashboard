import * as _ from 'lodash-es';

interface apiServiceType {
  [x: string]: {
    [y: string]: any;
  };
}


const apiService: apiServiceType = {
  resources: {
    // 登陆
    getLogin: { url: 'coreApi/users/login' },
    /*********************************主页************************************/
    getSummary: { url: 'coreApi/summary/{summaryType}' },

    /*********************************学习工具************************************/
    // 课程

    // 实验环境
    getSandboxes: { url: 'coreApi/sandboxes/{userName}', method: 'GET' },
    // 虚拟助教
    getHomeKnowledge: { url: 'chat/knowledge_bases', method: 'GET' },
    getHomeQuickStart: { url: 'chat/chat_quick_starts', method: 'GET' },

    getHistoryConversations: { url: 'chat/conversations/users/{userId}', method: 'GET' },
    getHistoryDetailConversations: { url: 'chat/conversations/{conversationId}/messages', method: 'GET' },
    delHistoryConversations: { url: 'chat/conversations/{conversationId}', method: 'DELETE' },

    getConversationInfo: { url: 'chat/conversations/{conversationId}', method: 'GET' },

    // 不带附件对话，拿conversationId
    createConversations: { url: 'chat/conversations', method: 'POST' },
    // createChat: { url: 'chat/chats', method: 'POST' },

    // 带附件对话，拿conversationId 以及临时知识库id

    createQuickFileChat: { url: 'chat/quick_file_chat', method: 'POST' },
    // uploadAndCreateFileConversation: { url: 'chat/file_chat/{userId}', method: 'POST' },


    getKBbyUserId: { url: 'chat/knowledge_bases/users/{userId}', method: 'GET' },
    createKB: { url: 'chat/knowledge_bases', method: 'POST' },
    updateKB: { url: 'chat/knowledge_bases/{knowledgeBaseId}', method: 'PATCH' },
    delKB: { url: 'chat/knowledge_bases/{knowledgeBaseId}', method: 'DELETE' },
    getKBDetail: { url: 'chat/knowledge_bases/{knowledgeBaseId}', method: 'GET' },
    uploadKBFile: { url: 'chat/knowledge_bases/{knowledgeBaseId}/upload', method: 'POST' },
    getKBFile: { url: 'chat/knowledge_bases/{knowledgeBaseId}/files', method: 'GET' },
    delKBFile: { url: 'chat/knowledge_bases/{knowledgeBaseId}/files', method: 'DELETE' },
    getModels: { url: 'xinference/models', method: 'GET' },

    /*********************************教学管理************************************/
    // 教学课程管理
    getCourse: { url: 'courses', method: 'GET' },
    addCourse: { url: 'courses', method: 'POST' },
    delCourse: { url: 'courses/{name}', method: 'DELETE' },
    getCourseDetail: { url: 'courses/{name}', method: 'GET' },
    // 数据集
    getDatasets: { url: 'datasets', method: 'GET' },
    addDatasets: { url: 'datasets', method: 'POST' },
    delDatasets: { url: 'datasets/{name}', method: 'DELETE' },
    getDatasetsDetail: { url: 'datasets/{name}', method: 'GET' },

    /*********************************用户管理************************************/
    // 用户账号
    getAccount: { url: 'coreApi/users', method: 'GET' },
    addAccount: { url: 'coreApi/users', method: 'POST' },
    getAccountDetail: { url: 'coreApi/users/{userId}', method: 'GET' },
    delAccount: { url: 'coreApi/users/{userId}', method: 'DELETE' },
    updateAccount: { url: 'coreApi/users/{userId}', method: 'PUT' },
    uploadAccount: { url: 'coreApi/users/upload', method: 'POST' },
    // 角色
    getRoles: { url: 'coreApi/roles', method: 'GET' },
    addRoles: { url: 'coreApi/roles', method: 'POST' },
    getRoleDetail: { url: 'coreApi/roles/{roleId}', method: 'GET' },
    delRole: { url: 'coreApi/roles/{roleId}', method: 'DELETE' },
    updateRole: { url: 'coreApi/roles/{roleId}', method: 'PUT' },
    // 班级
    getGroup: { url: 'coreApi/groups', method: 'GET' },
    getGroupSumCount: { url: 'coreApi/groups/summary/all/count', method: 'GET' },
    addGroup: { url: 'coreApi/groups', method: 'POST' },
    getGroupDetail: { url: 'coreApi/groups/{id}', method: 'GET' },
    delGroup: { url: 'coreApi/groups/{groupId}', method: 'DELETE' },
    updateGroup: { url: 'coreApi/groups/{groupId}', method: 'PUT' },
    getUsersInGroup: { url: 'coreApi/groups/{groupId}/users', method: 'GET' },
    getUsersNotInGroup: { url: 'coreApi/groups/{groupId}/users/not-in-group/list', method: 'GET' },
    addUsersToGroup: { url: 'coreApi/groups/{groupId}/users', method: 'PUT' },
    delUsersInGroup: { url: 'coreApi/groups/{groupId}/users/{userId}', method: 'DELETE' },

    /*********************************设备资源管理************************************/
    // 设备
    getDevices: { url: 'devices', method: 'GET' },
    getDevicesDetail: { url: 'devices/{name}', method: 'GET' },
    addDevices: { url: 'devices', method: 'POST' },
    delDevices: { url: 'devices/{name}', method: 'DELETE' },
    getFlavor: { url: 'coreApi/flavors/{flavorId}', method: 'GET' },

    // 设置
    getSetting: { url: 'extendV1/settings', method: 'GET' },
    updateSetting: { url: 'extendV1/settings/{settingId}', method: 'PATCH' },

    getVersion: { url: 'coreApi/versions/{versionId}', method: 'GET' },
    getLicenses: { url: 'coreApi/licenses/{licenseId}', method: 'GET' },

    // 平台配置/apis/core-api.openhydra.io/v1/flavors/{flavorId}
    // getDefaultSetting: { url: 'coreApi/flavors/{flavorId}', method: 'GET' },

    // 课题
    // getClass: { url: 'courses', method: 'GET' },
    // addClass: { url: 'courses/{id}', method: 'POST' },
    // delClass: { url: 'courses/{id}', method: 'DELETE' },
    // getClassDetail: { url: 'courses/{id}', method: 'GET' },
    // 设置
    // getDefaultSetting: { url: 'settings/default', method: 'GET' },
    putDefaultSetting: { url: 'settings/default', method: 'PUT' },

  },
  setting: {
    prefix: '/apis/open-hydra-server.openhydra.io/v1/',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*'
    },
    timeout: 3600000
  }
};

(function checkData(obj:any) {
  let apiServiceList = Object.values(obj);
  // 去重后的内容
  let deduplicationList: any = Array.from(new Set(apiServiceList.map((i) => i.url)));
  // 相同url的API集合详情
  let someUrlList: any = [];
  deduplicationList.forEach((item) => {
    // 检查到同URL的内容，放入someUrlList即可
    apiServiceList.filter((el) => el.url === item).length > 1 &&
      someUrlList.push(apiServiceList.filter((el) => el.url === item));
  });

  someUrlList.forEach((urlListItem) => {
    if (urlListItem.filter((item) => _.isNil(item.method)).length) {
      // eslint-disable-next-line no-console
      console.clear();
      let msg = 'apiService.resources中存在重复的URL,缺少字段method,请处理！';
      console.error(
        msg,
        urlListItem.filter((item) => _.isNil(item.method))
      );
      throw new Error(msg);
    } else if (
      new Set(urlListItem.map((item) => JSON.stringify([item.url, item.method]))).size !== urlListItem.length
    ) {
      // eslint-disable-next-line no-console
      console.clear();
      let msg = 'apiService.resources中存在重复的api,请修改url或者method,请检查！';
      console.error(msg, urlListItem);
      throw new Error(msg);
    }
  });
})(apiService.resources);

export default apiService;
