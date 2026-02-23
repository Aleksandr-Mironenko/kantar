import { notification } from 'antd';
import 'antd/dist/reset.css'
import { useEffect } from 'react';
import { PropsNotification } from "../DTO/DTO"



const close = () => {
  //любые действия при закрытии уведомдения
};

const Notification = ({ title, description }: PropsNotification) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    const key = `open${Date.now()}`;    //кнопки будут нужны в админке

    api.open({
      title,
      description,
      // btn,
      key,
      // duration: 0,   скрыто по умолчанию
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