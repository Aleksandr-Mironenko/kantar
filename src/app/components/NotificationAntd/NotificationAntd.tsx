import { Button, notification, Space } from 'antd';
import 'antd/dist/reset.css'
import { useEffect } from 'react';
import { PropsNotification } from "../DTO/DTO"



const close = () => {
  console.log(
    'Уведомление было закрыто.',
  );
};

const Notification = ({ titleAlert, message }: PropsNotification) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    const key = `open${Date.now()}`;
    // const btn = (
    //   <Space>
    //     <Button
    //       type="link"
    //       size="small"
    //       style={{ backgroundColor: '#ff0d01', borderColor: '#ff0d01', color: 'white' }}
    //       onClick={() => api.destroy()}>
    //       Закрыть все
    //     </Button>
    //     <Button
    //       type="primary"
    //       size="small"
    //       style={{ backgroundColor: '#e31e24', borderColor: '#e31e24', color: 'white' }}
    //       onClick={() => api.destroy(key)}>{/*добавить функцию*/}
    //       Принять
    //     </Button>
    //   </Space >
    // );
    api.open({
      message: titleAlert,
      description: message,
      // btn,
      key,
      // duration: 0,
      onClose: close,
    });
  };


  useEffect(() => { openNotification() }, [])

  return (
    <>
      {contextHolder}
    </>
  );
};

export default Notification;