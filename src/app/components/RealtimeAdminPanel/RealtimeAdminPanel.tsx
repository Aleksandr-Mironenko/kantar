'use client'
import { useEffect, useRef, useState } from "react";
import styles from "./RealtimeAdminPanel.module.scss";
import { TableOrdersRecord, TableOrdersRecordWithEvent, WSMessage } from "../DTO/DTO";

export default function RealtimeAdminPanel() {
  const [orders, setOrders] = useState<TableOrdersRecord[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  function applyBatch(batch: TableOrdersRecordWithEvent[]) {
    setOrders(prev => {
      let next = [...prev]

      for (const change of batch) {
        switch (change.eventType) {
          case 'INSERT':
            next.push(change)
            break

          case 'UPDATE':
            next = next.map(o =>
              o.sender_id === change.sender_id ? { ...o, ...change } : o
            )
            break

          case 'DELETE':
            next = next.filter(o => o.sender_id !== change.sender_id)
            break
        }
      }

      return next
    })
  }

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001')
    wsRef.current = ws

    ws.onopen = () => {
      console.log('✅ WS connected')
    }

    ws.onmessage = event => {
      const message: WSMessage = JSON.parse(event.data)

      switch (message.type) {
        case 'orders_full':
          setOrders(message.data)
          break

        case 'orders_batch':
          applyBatch(message.data)
          break
      }
    }

    ws.onclose = () => {
      console.log('❌ WS disconnected')
    }

    return () => ws.close()
  }, [])

  const message = orders.map(el => {
    return (
      <li key={el.id}>
        <p>{el.address_from_id}</p>,
        <p>{el.address_where_id}</p>,
        <p>{el.discount_this_send}</p>,
        <p>{el.email_from}</p>,
        <p>{el.email_where}</p>,
        <p>{el.heft_full}</p>,
        <p>{el.is_individual}</p>,
        <p>{el.is_paid}</p>,
        <p>{el.name_from}</p>,
        <p>{el.name_where}</p>,
        <p>{el.phone_from}</p>,
        <p>{el.phone_where}</p>,
        <p>{el.price_full}</p>,
        <p>{el.recipient_id}</p>,
        <p>{el.sender_id}</p>,
        <p>{el.status}</p>
      </li>
    )
  })

  return (
    <section className={styles.adminpages} id="adminpages">
      <h2 className={styles.adminpages__title}>Админ панель</h2>
      <div className={styles.adminpages__block}>
        <div className={styles.adminpages__block}>{/*блок  в котором будет 2 кномки переключения между новыми заказами и запросами на договор/*/}

        </div>
        <div className={styles.adminpages__block}>{/*в этом блоке будут все заказы*/}
          {message}
        </div>
      </div>

      <div className={styles.adminpages__list}>{/*блок создать заказ*/}
        {/* <div className={styles.adminpages__item}>15 лет опыта</div>
        <div className={styles.adminpages__item}>Страхование груза</div>
        <div className={styles.adminpages__item}>Доставка точно в срок</div>
        <div className={styles.adminpages__item}>Крупная собственная сеть</div> */}
      </div>
      <div className={styles.adminpages__list}>{/*блок новые заказы*/}
        {/* <div className={styles.adminpages__item}>15 лет опыта</div>
        <div className={styles.adminpages__item}>Страхование груза</div>
        <div className={styles.adminpages__item}>Доставка точно в срок</div>
        <div className={styles.adminpages__item}>Крупная собственная сеть</div> */}
      </div>
      <div className={styles.adminpages__list}>{/*блок все заказы*/}
        {/* <div className={styles.adminpages__item}>15 лет опыта</div>
        <div className={styles.adminpages__item}>Страхование груза</div>
        <div className={styles.adminpages__item}>Доставка точно в срок</div>
        <div className={styles.adminpages__item}>Крупная собственная сеть</div> */}
      </div>
      <div className={styles.adminpages__list}>{/*услуги редактирование просмотр и тд*/}
        {/* <div className={styles.adminpages__item}>15 лет опыта</div>
        <div className={styles.adminpages__item}>Страхование груза</div>
        <div className={styles.adminpages__item}>Доставка точно в срок</div>
        <div className={styles.adminpages__item}>Крупная собственная сеть</div> */}
      </div>

    </section>
  );
}