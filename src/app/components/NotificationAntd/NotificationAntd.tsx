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
    const btn = (
      <Space>
        <Button type="link" size="small" onClick={() => api.destroy()}>
          Заакрыть все
        </Button>
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>{/*добавить функцию*/}
          Принять
        </Button>
      </Space>
    );
    api.open({
      message: titleAlert,
      description: message,
      btn,
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