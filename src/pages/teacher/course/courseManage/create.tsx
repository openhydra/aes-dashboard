// /**
//  * @AUTHOR zhy
//  * @DATE zhy (2024/01/02)
//  * @Description:
//  */
// import React from 'react';
// import {Form, Input, Upload} from 'antd';
// import {InboxOutlined} from "@src/utils/antdIcon";
// const { Dragger } = Upload;
//
// const CreateAccount = (props) => {
//   const {fileList, setFileList} = props;
//
//   const fileProps = {
//     maxCount: 1,
//     accept: '.zip,.rar',
//     onRemove: () => {
//       setFileList(null);
//     },
//     beforeUpload: (file) => {
//       setFileList([file]);
//       return false;
//     },
//     fileList
//   };
//   return (
//     <Form.Item shouldUpdate={() => true} noStyle>
//       {({  }) => (
//         <>
//           <Form.Item label={'课程名称'} rules={[{ required: true, message: '请输入课程资源名称'}]} name="name">
//             <Input placeholder={'请输入课程资源名称'}  size='large'/>
//           </Form.Item>
//           <Form.Item label={'课程介绍'} rules={[{ required: true, message: '添加课程资源描述' }]} name={'description'}>
//             <Input.TextArea
//               showCount
//               maxLength={100}
//               style={{ height: 80, resize: 'none' }}
//               placeholder={'添加课程资源描述'}
//             />
//           </Form.Item>
//           <Form.Item
//             label={'选择相关课程资源'}
//             name={'file'}
//             rules={[{ required: true, message: '请选择文件' }]}>
//
//             <Dragger {...fileProps}>
//               <p className="ant-upload-drag-icon">
//                 <InboxOutlined />
//               </p>
//               <p className="ant-upload-text">点击上传，或拖拽文件至此处</p>
//               <p className="ant-upload-hint" style={{margin: 0}}>最多支持上传1个文件，支持.zip格式</p>
//             </Dragger>
//           </Form.Item>
//         </>
//       )}
//     </Form.Item>
//   );
// };
// export default CreateAccount;
