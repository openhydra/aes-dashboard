/**
 * @AUTHOR zhy
 * @DATE 2022/2/7
 * @Description:
 */
import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
const NotExist = () => {
  let navigate = useNavigate();
  return (
    <>
      <Result
        extra={
          <Button
            type="primary"
            onClick={() => {
              navigate('/');
            }}
          >
            返回主页
          </Button>
        }
        status="404"
        subTitle="对不起，您访问的页面不存在。"
        title="404"
      />
    </>
  );
};

export default NotExist;
