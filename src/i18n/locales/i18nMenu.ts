import { LocalItems } from './locales';

/**
 * @AUTHOR zhy
 * @DATE zhy (2022/07/25)
 * @Description:
 */

const MenuObject: LocalItems = [
  /*----所有服务--菜单----*/
  {
    zh: '资源管理',
    tw: '資源管理',
    en: 'Resource management',
    title: 'menu_IaaS_resource'
  },
  {
    zh: '总览',
    tw: '總覽',
    en: 'Overview',
    title: 'menu_1_overview'
  },
  {
    zh: '仪表盘',
    tw: '儀錶盤',
    en: 'Dashboard',
    title: 'menu_0_dashboard'
  },
  {
    zh: '资源总览',
    tw: '資源總覽',
    en: 'Resource overview',
    title: 'resource_overview'
  },
  {
    zh: '资源池总览',
    tw: '資源池總覽',
    en: 'Overview of Resource Pools',
    title: 'resource_pool_overview'
  },
  {
    zh: '软件总览',
    tw: '軟件總覽',
    en: 'Software overview',
    title: 'software_overview'
  },
  {
    zh: '标签查询',
    tw: '標籤查詢',
    en: 'Tag query',
    title: 'menu_2_tag_query'
  },
  {
    zh: '申请管理',
    tw: '申請管理',
    en: 'Application management',
    title: 'menu_request_manage'
  },
  {
    zh: '新建申请',
    tw: '新建申請',
    en: 'New application',
    title: 'request_newrequest'
  },
  {
    zh: '我的申请',
    tw: '我的申請',
    en: 'My application',
    title: 'request_myrequest'
  },
  {
    zh: '所有申请',
    tw: '所有申請',
    en: 'All applications',
    title: 'request_allrequest'
  },
  {
    zh: '我的审批',
    tw: '我的審批',
    en: 'My approval',
    title: 'request_myapproval'
  },
  {
    zh: '计算资源',
    tw: '計算資源',
    en: 'Computing resources',
    title: 'menu_computing_resource'
  },
  {
    zh: '主机集合',
    tw: '主機集合',
    en: 'Host collection',
    title: 'resource_host_aggregate'
  },
  {
    zh: '主机集群',
    tw: '主機集群',
    en: 'Host cluster',
    title: 'host_cluster'
  },
  {
    zh: '主机',
    tw: '主機',
    en: 'Host',
    title: 'host'
  },
  {
    zh: '实例类型',
    tw: '實例類型',
    en: 'Instance type',
    title: 'flavor'
  },
  {
    zh: '裸机',
    tw: '裸機',
    en: 'Bare metal',
    title: 'baremetal'
  },
  {
    zh: '虚拟机集群',
    tw: '虛擬機集群',
    en: 'Virtual machine cluster',
    title: 'vm_cluster'
  },
  {
    zh: '虚拟机',
    tw: '虛擬機',
    en: 'Virtual machine',
    title: 'vm'
  },
  {
    zh: '镜像',
    tw: '鏡像',
    en: 'Image',
    title: 'image'
  },
  {
    zh: '密钥',
    tw: '密鑰',
    en: 'Key pairs',
    title: 'keypairs'
  },
  {
    zh: '存储资源',
    tw: '存儲資源',
    en: 'Storage resources',
    title: 'menu_storage_resource'
  },
  {
    zh: '存储',
    tw: '存儲',
    en: 'Storage',
    title: 'storage'
  },
  {
    zh: '数据卷',
    tw: '數據卷',
    en: 'Data volume',
    title: 'volume'
  },
  {
    zh: '快照',
    tw: '快照',
    en: 'Snapshot',
    title: 'snapshoot'
  },
  {
    zh: '对象存储',
    tw: '對象存儲',
    en: 'Object storage',
    title: 'objectStorage'
  },
  {
    zh: '网络资源',
    tw: '網絡資源',
    en: 'Internet resources',
    title: 'menu_1_network_resource'
  },
  {
    zh: '网络',
    tw: '網絡',
    en: 'Network',
    title: 'network'
  },
  {
    zh: '路由',
    tw: '路由',
    en: 'Routing',
    title: 'router'
  },
  {
    zh: '防火墙',
    tw: '防火牆',
    en: 'Firewall',
    title: 'firewall'
  },
  {
    zh: '安全组',
    tw: '安全組',
    en: 'Security group',
    title: 'securityGroup'
  },
  {
    zh: '负载均衡',
    tw: '負載均衡',
    en: 'Load balancing',
    title: 'lbaas_service_tab_title'
  },
  {
    zh: '浮动 IP',
    tw: '浮動 IP',
    en: 'Floating IP',
    title: 'floatingIp'
  },
  {
    zh: '证书',
    tw: '證書',
    en: 'Certificate',
    title: 'certificate'
  },
  {
    zh: '网卡',
    tw: '網卡',
    en: 'Network card',
    title: 'virtualEthernetCard'
  },
  {
    zh: '容器资源',
    tw: '容器資源',
    en: 'Container resources',
    title: 'resource_container'
  },
  {
    zh: '节点',
    tw: '節點',
    en: 'Node',
    title: 'node'
  },
  {
    zh: 'Helm模板',
    tw: 'Helm模板',
    en: 'Helm Template',
    title: 'helm_chart'
  },
  {
    zh: '负载',
    tw: '負載',
    en: 'Load',
    title: 'workload'
  },
  {
    zh: 'Pod',
    tw: 'Pod',
    en: 'Pod',
    title: 'resource_pod'
  },
  {
    zh: '容器服务',
    tw: '容器服務',
    en: 'Container service',
    title: 'service'
  },
  {
    zh: '访问入口',
    tw: '訪問入口',
    en: 'Access entrance',
    title: 'kube_ingress'
  },
  {
    zh: '镜像仓库',
    tw: '鏡像倉庫',
    en: 'Image repository',
    title: 'image_repository'
  },
  {
    zh: 'Secret',
    tw: 'Secret',
    en: 'Secret',
    title: 'resource_container_secret'
  },
  {
    zh: 'ConfigMap',
    tw: 'ConfigMap',
    en: 'ConfigMap',
    title: 'resource_container_config_map_title'
  },
  {
    zh: '命名空间',
    tw: '命名空間',
    en: 'Namespaces',
    title: 'resource_container_namespace'
  },
  {
    zh: '关系型数据库',
    tw: '關係型數據庫',
    en: 'Relational database',
    title: 'db_service'
  },
  {
    zh: 'RDS',
    tw: 'RDS',
    en: 'RDS',
    title: 'RDS'
  },
  {
    zh: '增值服务',
    tw: '增值服務',
    en: 'Value-added services',
    title: 'menu_value_added_services'
  },
  {
    zh: '回收站',
    tw: '回收站',
    en: 'Recycle bin',
    title: 'recycle'
  },
  {
    zh: '编排服务',
    tw: '編排服務',
    en: 'Orchestration Services',
    title: 'service_vm_software'
  },
  {
    zh: '定时任务',
    tw: '定時任務',
    en: 'Timed task',
    title: 'service_schedule'
  },
  {
    zh: '平台管理',
    tw: '平台管理',
    en: 'Platform management',
    title: 'menu_0_config'
  },
  {
    zh: '资源池',
    tw: '資源池',
    en: 'Resource pool',
    title: 'resource_pool'
  },
  {
    zh: '计算资源池',
    tw: '計算資源池',
    en: 'Computing resource pool',
    title: 'computing_pool'
  },
  {
    zh: '存储资源池',
    tw: '存儲資源池',
    en: 'Storage resource pool',
    title: 'storage_pool'
  },
  {
    zh: '网络资源池',
    tw: '網絡資源池',
    en: 'Network resource pool',
    title: 'network_pool'
  },
  {
    zh: '云环境',
    tw: '雲環境',
    en: 'Cloud environment',
    title: 'menu_cloud_environment'
  },
  {
    zh: '区域',
    tw: '區域',
    en: 'Area',
    title: 'organization_region_management'
  },
  {
    zh: '云账户',
    tw: '云账户',
    en: 'Cloud account',
    title: 'oss_server'
  },
  {
    zh: '镜像服务器',
    tw: '鏡像服務器',
    en: 'Image server',
    title: 'image_server'
  },
  {
    zh: 'Helm仓库',
    tw: 'Helm倉庫',
    en: 'Helm warehouse',
    title: 'helm_repository'
  },
  {
    zh: '软件管理',
    tw: '軟件管理',
    en: 'Software management',
    title: 'menu_software_manage_title'
  },
  {
    zh: '操作系统',
    tw: '操作系統',
    en: 'Operating system',
    title: 'os'
  },
  {
    zh: '软件服务器',
    tw: '軟件服務器',
    en: 'Software server',
    title: 'software_server'
  },
  {
    zh: '软件',
    tw: '軟件',
    en: 'Software',
    title: 'software'
  },
  {
    zh: '软件连接',
    tw: '軟件連接',
    en: 'Software connection',
    title: 'software_link'
  },
  {
    zh: '脚本',
    tw: '腳本',
    en: 'Script',
    title: 'script'
  },
  {
    zh: '系统配置',
    tw: '系統配置',
    en: 'System Configuration',
    title: 'menu_1_sys_config'
  },
  {
    zh: '调度策略',
    tw: '調度策略',
    en: 'Scheduling strategy',
    title: 'schedule'
  },
  {
    zh: '自扩展策略',
    tw: '自擴展策略',
    en: 'Self-scaling strategy',
    title: 'autoscaling_policy'
  },
  {
    zh: '标签',
    tw: '標籤',
    en: 'Label',
    title: 'tag'
  },
  {
    zh: '参数配置',
    tw: '參數配置',
    en: 'Parameter configuration',
    title: 'systemConfig'
  },
  {
    zh: '用户操作文档',
    tw: '用戶操作文檔',
    en: 'User Action Documentation',
    title: 'operationDocuments'
  },
  {
    zh: '运营管理',
    tw: '運營管理',
    en: 'Operation management',
    title: 'menu_0_ops'
  },
  {
    zh: '组织',
    tw: '組織',
    en: 'Organize',
    title: 'menu_0_organization'
  },
  {
    zh: '企业',
    tw: '企業',
    en: 'Enterprise',
    title: 'organization_enterprise_management'
  },
  {
    zh: '我的企业',
    tw: '我的企業',
    en: 'My Business',
    title: 'my_enterprise'
  },
  {
    zh: '用户',
    tw: '用戶',
    en: 'User',
    title: 'organization_user_management'
  },
  {
    zh: '项目用户',
    tw: '項目用戶',
    en: 'Department User',
    title: 'department_user'
  },
  {
    zh: '项目',
    tw: '項目',
    en: 'Department',
    title: 'organization_department_management'
  },
  {
    zh: '我的项目',
    tw: '我的項目',
    en: 'My Department',
    title: 'my_department'
  },
  {
    zh: '我的项目', // 原项目
    tw: '我的項目',
    en: 'My Project',
    title: 'my_project'
  },
  {
    zh: '项目', // 原项目
    tw: '項目',
    en: 'Project',
    title: 'organization_project_management'
  },
  {
    zh: '环境',
    tw: '環境',
    en: 'Environment',
    title: 'environment_management'
  },
  {
    zh: '职位',
    tw: '職位',
    en: 'Position',
    title: 'organization_position_management'
  },
  {
    zh: '角色',
    tw: '角色',
    en: 'Role',
    title: 'organization_role_management'
  },
  {
    zh: '服务',
    tw: '服務',
    en: 'Serve',
    title: 'menu_0_request'
  },
  {
    zh: '我的工单',
    tw: '我的工單',
    en: 'My ticket',
    title: 'request_myticket'
  },
  {
    zh: '审批流程',
    tw: '審批流程',
    en: 'Approval Process',
    title: 'workflow'
  },
  {
    zh: '服务目录',
    tw: '服務目錄',
    en: 'Service catalog',
    title: 'menu_1_catalog'
  },
  {
    zh: '审计',
    tw: '審計',
    en: 'Audit',
    title: 'audit_tab_title'
  },
  {
    zh: '任务',
    tw: '任務',
    en: 'Task',
    title: 'task_tab_title'
  },
  {
    zh: '登录日志',
    tw: '登錄日誌',
    en: 'Login log',
    title: 'login_records_tab_title'
  },
  {
    zh: '计量',
    tw: '計量',
    en: 'Metering',
    title: 'metering_tab_title'
  },
  {
    zh: '计量统计',
    tw: '計量統計',
    en: 'Measurement statistics',
    title: 'metering_report'
  },
  {
    zh: '计量日历史',
    tw: '計量日曆史',
    en: 'Metering day history',
    title: 'metering_history'
  },
  {
    zh: '计量月历史',
    tw: '計量月曆史',
    en: 'Metering Month History',
    title: 'metering_history_monthly'
  },
  {
    zh: '计费',
    tw: '計費',
    en: 'Billing',
    title: 'billing_title'
  },
  {
    zh: '成本总览',
    tw: '成本總覽',
    en: 'Cost Overview',
    title: 'billing_overview'
  },
  {
    zh: '资源单价',
    tw: '資源單價',
    en: 'Resource unit price',
    title: 'billing_price'
  },
  {
    zh: '账户总览',
    tw: '賬戶總覽',
    en: 'Account Overview',
    title: 'billing_account'
  },
  {
    zh: '费用账单',
    tw: '費用賬單',
    en: 'Expense bill',
    title: 'billing_invoice'
  },
  {
    zh: '收支明细',
    tw: '收支明細',
    en: 'Income and Expenditure Details',
    title: 'billing_payment'
  },
  {
    zh: '集成账单',
    tw: '集成賬單',
    en: 'Integrated billing',
    title: 'billing_integration'
  },
  {
    zh: '运维管理',
    tw: '運維管理',
    en: 'Operation and maintenance',
    title: 'menu_0_services'
  },
  {
    zh: '监控',
    tw: '監控',
    en: 'Monitor',
    title: 'menu_monitor'
  },
  {
    zh: '监控概览',
    tw: '監控概覽',
    en: 'Monitoring overview',
    title: 'menu_monitor_overview'
  },
  {
    zh: '监控配置',
    tw: '監控配置',
    en: 'Monitoring configuration',
    title: 'monitor_config'
  },
  {
    zh: '优化建议',
    tw: '優化建議',
    en: 'Optimization suggestions',
    title: 'monitor_optimization'
  },
  {
    zh: '告警',
    tw: '告警',
    en: 'Alarm',
    title: 'menu_alarm'
  },
  {
    zh: '当前告警',
    tw: '當前告警',
    en: 'Current alert',
    title: 'menu_happening'
  },
  {
    zh: '历史告警',
    tw: '歷史告警',
    en: 'Historical alarms',
    title: 'menu_history'
  },
  {
    zh: '告警规则',
    tw: '告警規則',
    en: 'Alert rules',
    title: 'menu_rule'
  },
  {
    zh: '作业管理',
    tw: '作業管理',
    en: 'Job management',
    title: 'menu_0_automation_title'
  },
  {
    zh: '批量作业',
    tw: '批量作業',
    en: 'Batch job',
    title: 'menu_1_batch_opt_title'
  },
  {
    zh: '批量上传',
    tw: '批量上傳',
    en: 'Bulk upload',
    title: 'batch_job_title'
  },
  {
    zh: '所有任务',
    tw: '所有任務',
    en: 'All tasks',
    title: 'batch_job_all_title'
  },
  {
    zh: '我的任务',
    tw: '我的任務',
    en: 'My tasks',
    title: 'batch_job_my_title'
  },
  // 角色翻译
  {
    zh: 'system_admin',
    tw: '系統管理員',
    en: 'System administrator',
    title: 'system_admin'
  },
  {
    zh: 'domain_admin',
    tw: '企業租戶管理員',
    en: 'Enterprise Tenant Administrator',
    title: 'domain_admin'
  },
  {
    zh: 'project_admin',
    tw: '項目管理員',
    en: 'Department administrator',
    title: 'project_admin'
  },
  {
    zh: 'project_member',
    tw: '終端用戶',
    en: 'End user',
    title: 'project_member'
  },
  {
    zh: 'domain_reader',
    tw: '審計員',
    en: 'Auditor',
    title: 'domain_reader'
  },
  {
    zh: '无权限',
    tw: '無權限',
    en: 'No permissions',
    title: 'domain_none'
  },
  {
    zh: '云专线服务',
    tw: '雲專線服務',
    en: 'CloudbondService',
    title: 'cloudBond_service'
  },
  {
    zh: '云联网资源',
    tw: '雲聯網資源',
    en: 'CloudbondResources',
    title: 'cloud_bond'
  },
  {
    zh: '云联网',
    tw: '雲聯網',
    en: 'Cloudbond',
    title: 'cloud_bond_server'
  }
];
export default MenuObject;
