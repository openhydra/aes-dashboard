// /**
//  * @Author: jay shi
//  * @Date: 2023/3/3
//  * @Desc: 指定模块下载
//  * */
// import * as InvoiceServices from '@src/services/billings/invoice';
// import * as BatchUploadServices from '@src/services/batchUpload/index';
// import * as MeteringServices from '@src/services/metering/meteringExport';
// import { saveToLocal } from '@src/utils';
//
// const downloadCustomFiles = (type: string, params?: any, name?: string, callback?: () => void) => {
//   switch (type) {
//     case 'invoice':
//       InvoiceServices.downloadInvoiceExport(params).then((data) => {
//         saveToLocal({ data: data, type: 'xls', name: name }, callback);
//       });
//       break;
//     case 'payment':
//       InvoiceServices.downloadPaymentExport(params).then((data) => {
//         saveToLocal({ data: data, type: 'xls', name: name }, callback);
//       });
//       break;
//     case 'template':
//       BatchUploadServices.downloadExport(params).then((data) => {
//         saveToLocal({ data: data, type: 'xls', name: name }, callback);
//       });
//       break;
//     case 'meteringDaily':
//       MeteringServices.dailyDownloadExport(params).then((data) => {
//         saveToLocal({ data: data, type: 'xls', name: name }, callback);
//       });
//       break;
//     case 'meteringMonthly':
//       MeteringServices.monthlyDownloadExport(params).then((data) => {
//         saveToLocal({ data: data, type: 'xls', name: name }, callback);
//       });
//       break;
//     case 'meteringSummary':
//       MeteringServices.summaryDownloadExport(params).then((data) => {
//         saveToLocal({ data: data, type: 'xls', name: name }, callback);
//       });
//       break;
//     case 'overviewByType':
//       MeteringServices.summaryDownloadExport(params).then((data) => {
//         saveToLocal({ data: data, type: 'xls', name: name }, callback);
//       });
//       break;
//     default:
//       break;
//   }
// };
//
// export { downloadCustomFiles };
