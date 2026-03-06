"use client"
import { toCorrectUserAcc, TypeAcc, CommentUserType } from '../DTO/DTO'
import { useEffect, useState } from 'react'
import styles from './UserProfileClient.module.scss'

export default function UserProfileClient({ searchParams }: { searchParams: { id: string, idUserProps: toCorrectUserAcc } }) {
  const [comment, setComment] = useState<string>('')
  const [comments, setComments] = useState<CommentUserType[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const typeAcc = (type: string): string => {
    return type === "noAcc" ? "Без договора" :
      type === "request" ? "Запрос на подписание договора" :
        type === "private" ? "Есть договор (частное лицо)" :
          type === "OOO" ? "Есть договор (ООО)" :
            type === "IP" ? "Есть договор (ИП)" : ""
  }
  const targetUser = () => {
    if (searchParams.idUserProps.passport) return "частного лица"
    if (searchParams.idUserProps.fio_gd_OOO) return "ООО"
    if (searchParams.idUserProps.fio_IP) return "ИП"
    return "noAcc"
  }

  const targetUserConst = targetUser()

  const dateCreateOrder = (date: string) => {
    const qweqwe = new Date(date).toLocaleString()
    const aaa = qweqwe.split(",")
    const bbb = aaa[0].split(".")
    return `${bbb[0]}.${bbb[1]}.${bbb[2]} в ${aaa[1]} `
  }

  const clientName = searchParams.idUserProps.type_acc === "noAcc" || searchParams.idUserProps.type_acc === "private" || searchParams.idUserProps.type_acc === "request" ?
    searchParams.idUserProps.name :
    searchParams.idUserProps.type_acc === "OOO" ?
      searchParams.idUserProps.name_OOO :
      searchParams.idUserProps.type_acc === "IP" ?
        searchParams.idUserProps.fio_IP : null

  const getComment = async (id?: string) => {
    if (!id) return; // безопасная проверка
    const request = await fetch(
      "/api/admin/admin-panel-poling/users/comment-In_user/get",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id
        }),
      }
    );

    if (!request.ok) {
      throw new Error("Ошибка получения комментариев");
    }
    const response = await request.json();
    setComments(response);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      getComment(searchParams.id);
    }, 5000);
    return () => clearTimeout(timerId);
  }, [searchParams.id]);

  const commentAction = async (type: string, props: string | object) => {
    const request = await fetch("/api/admin/admin-panel-poling/users/comment-In_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type, props
      })
    })

    if (!request.ok) {
      throw new Error(`Ошибка действий с комментарием ${type}`)
    }

    const response = await request.json();
    console.log(response)
    if (type === "add") { setComment("") }
    getComment(searchParams.id)
  }


  const commentsMap = (comments ?? []).map((el: { id: string, user_id: string, author_id: string, text: string, created_at: string }) =>
  (<li style={{ borderBottom: "1px solid black", borderRadius: "30px" }} key={el.id} >
    <p style={{ display: "flex", margin: "10px 0", alignItems: "center" }}>
      <span
        style={{ color: "gray", paddingTop: "5px", paddingLeft: "10px", fontSize: "10px", borderRadius: "30px 0 ", borderTop: "1px solid black" }}>
        {dateCreateOrder(el.created_at)}
        :
      </span>

      {editingCommentId === el.id
        &&

        <textarea
          style={{
            resize: "vertical",     // менять высоту
            minHeight: "60px",
            width: "100%",
            margin: "10px 0"
          }}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      }
      {editingCommentId === el.id
        ?
        <>

          <button className={styles.closeButton}
            onClick={() => {
              commentAction("update", { commentId: el.id, newText: newComment })
              setEditingCommentId(null)
            }}>
            ✓
          </button>
        </>
        :
        <>
          <span style={{ paddingLeft: "10px", textDecoration: "underline", whiteSpace: "pre-wrap", wordWrap: "break-word", }}>{(el.text)}</span>
          <span>
            <button className={styles.closeButton}
              onClick={() => {
                setEditingCommentId(el.id)
                setNewComment(el.text) // загружаем текст комментария для редактирования
              }}>
              🖉
            </button>
          </span>
        </>}
      <span>
        <button className={styles.closeButton}
          onClick={() => commentAction("del", { commentId: el.id })} >
          ×
        </button>
      </span>
    </p>
  </li >
  )
  )


  return (
    <div style={{ margin: "2vh", padding: "3vh", borderRadius: "10px", background: 'rgba(255, 255, 255, 0.7)' }}>
      <h1  ><div style={{ display: "inline-block" }}>Имя клиента:</div> <div style={{ display: "inline-block" }}>{clientName}</div></h1>
      {clientName !== searchParams.idUserProps.name && <p> Представитель клиента: {searchParams.idUserProps.name} </p>}
      <p>Создан: <b>{dateCreateOrder(searchParams.idUserProps.created_at as string)}</b></p>
      {/* <p>id пользователя: <b>{searchParams.idUserProps.id}</b></p> */}


      <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap", justifyContent: "start" }}>
        <div>
          <div style={{ display: "inline-block", margin: "1vh", padding: "1vh", border: "1px solid #000000", borderRadius: "10px", background: 'rgba(255, 255, 255, 0.7)' }}>
            <p><b>Контактная информация</b></p>
            <p>Email представителя:   <b>{searchParams.idUserProps.email}</b> </p>
            <p style={{ display: "flex", flexWrap: "wrap" }}><span>Телефон представителя: </span><b >{searchParams.idUserProps.phone}</b> </p>
            <p>Заключен ли договор с клиентом: <b>{searchParams.idUserProps.is_dogovor ? "да" : "нет"}</b></p>
            <p>Клиент или указан адресатом: <b>{searchParams.idUserProps.is_client ? "клиент" : "адресат"}</b></p>
          </div >


        </div>
        <div style={{ display: "inline-block", margin: "1vh", padding: "1vh", border: "1px solid #000000", borderRadius: "10px", background: 'rgba(255, 255, 255, 0.7)' }}>
          <p><b>Комментарий клиента:</b></p>
          <p style={{ color: "red", fontWeight: "900" }}>{searchParams.idUserProps.comment}</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap", justifyContent: "start" }}>
        <div style={{ display: "inline-block", margin: "1vh", padding: "1vh", border: "1px solid #000000", borderRadius: "10px", background: 'rgba(255, 255, 255, 0.7)' }}>
          <p><strong>Тип аккаунта клиента:</strong><b style={{ textDecoration: "underline" }}> {typeAcc(searchParams.idUserProps.type_acc as TypeAcc)}</b></p>
          {
            searchParams.idUserProps.type_acc === "private" &&
            <>
              <p>Паспорт клиента: <b>{searchParams.idUserProps.passport}</b></p>
              <p>СНИЛС клиента: <b>{searchParams.idUserProps.snils}</b></p>
            </>
          }
          {
            searchParams.idUserProps.type_acc === "OOO" &&
            <>
              <p>ФИО руководителя OOO: <b>{searchParams.idUserProps.fio_gd_OOO}</b></p>
              <p>Название ООО: <b>{searchParams.idUserProps.name_OOO}</b></p>
              <p>Адрес регистрации: <b>{searchParams.idUserProps.oficial_adress_OOO}</b></p>
              <p>Адрес фактический: <b>{searchParams.idUserProps.actual_address_OOO} </b></p>
              <p>ИНН: <b>{searchParams.idUserProps.inn_OOO}</b></p>
              <p>КПП: <b>{searchParams.idUserProps.kpp_OOO}</b></p>
              <p>ОГРН: <b>{searchParams.idUserProps.ogrn_OOO}</b></p>
              <p>Расчетный счет: <b>{searchParams.idUserProps.rs_OOO}</b></p>
              <p>БИК: <b>{searchParams.idUserProps.bic_OOO}</b></p>
              <p>Корр. счет: <b>{searchParams.idUserProps.corr_score_OOO}</b></p>
            </>
          }

          {
            searchParams.idUserProps.type_acc === "IP" &&
            <>
              <p>ФИО ИП: <b>{searchParams.idUserProps.fio_IP}</b></p>
              <p>Адрес регистрации: <b>{searchParams.idUserProps.actual_address_IP}</b></p>
              <p>ИНН: <b>{searchParams.idUserProps.inn_IP}</b></p>
              <p>ОГРН ИП: <b>{searchParams.idUserProps.ogrn_IP}</b></p>
              <p>Расчетный счет: <b>{searchParams.idUserProps.rs_IP}</b></p>
              <p>БИК: <b>{searchParams.idUserProps.bic_IP}</b></p>
              <p>Корр. счет: <b>{searchParams.idUserProps.corr_score_IP}</b></p>
            </>
          }

          {
            searchParams.idUserProps.type_acc === "request" &&
            <>
              <p>Клиент желает заключить договор в качестве: <b>{targetUserConst}</b>  </p>
              <p style={{ marginTop: "20px" }}>
                <b>Клиент указал данные для заключения договора:</b>
              </p>
              {targetUserConst === "частного лица" &&
                <>
                  <p>Паспорт клиента: <b>{searchParams.idUserProps.passport}</b></p>
                  <p>СНИЛС клиента: <b>{searchParams.idUserProps.snils}</b></p>
                </>
              }
              {targetUserConst === "ООО" &&
                <>
                  <p>ФИО ген директора: <b>{searchParams.idUserProps.fio_gd_OOO}</b></p>
                  <p>Название ООО: <b>{searchParams.idUserProps.name_OOO}</b></p>
                  <p>Адрес регистрации: <b>{searchParams.idUserProps.oficial_adress_OOO}</b></p>
                  <p>Адрес фактический: <b>{searchParams.idUserProps.actual_address_OOO}</b></p>
                  <p>ИНН: <b>{searchParams.idUserProps.inn_OOO}</b></p>
                  <p>КПП: <b>{searchParams.idUserProps.kpp_OOO}</b></p>
                  <p>ОГРН: <b>{searchParams.idUserProps.ogrn_OOO}</b></p>
                  <p>Расчетный счет: <b>{searchParams.idUserProps.rs_OOO}</b></p>
                  <p>БИК: <b>{searchParams.idUserProps.bic_OOO}</b></p>
                  <p>Корр. счет: <b>{searchParams.idUserProps.corr_score_OOO}</b></p>
                </>
              }
              {targetUserConst === "ИП" &&
                <>
                  <p>ФИО ИП: <b>{searchParams.idUserProps.fio_IP}</b></p>
                  <p>Адрес регистрации: <b>{searchParams.idUserProps.actual_address_IP}</b></p>
                  <p>ИНН: <b>{searchParams.idUserProps.inn_IP}</b></p>
                  <p>ОГРН ИП: <b>{searchParams.idUserProps.ogrn_IP}</b></p>
                  <p>Расчетный счет: <b>{searchParams.idUserProps.rs_IP}</b></p>
                  <p>БИК: <b>{searchParams.idUserProps.bic_IP}</b></p>
                  <p>Корр. счет: <b>{searchParams.idUserProps.corr_score_IP}</b></p>
                </>
              }
            </>
          }

          {
            searchParams.idUserProps.type_acc === "noAcc" &&
            <p><b>Клиент не заключил договор </b></p>
          }

          {
            targetUserConst === "ООО" || targetUserConst === "ИП" || targetUserConst === "частного лица" &&
            <>
              <p>Реферальный код пользователя: <b>{searchParams.idUserProps.ref_code}</b></p>
              <p>Количество использований реферального кода пользователя: <b>{searchParams.idUserProps.count_refcode_use}</b></p>
              <p>Cкидка пользователя: <b>{searchParams.idUserProps.discount}</b></p>
            </>
          }
        </div>


        <div style={{ display: "inline-block", margin: "1vh", padding: "1vh", border: "1px solid #000000", borderRadius: "10px", background: 'rgba(255, 255, 255, 0.7)' }}>
          <p>
            <b>Служебные отметки о пользователе:</b>
          </p>
          <div style={{ display: "flex" }}> <textarea

            style={{ padding: "5px 10px", borderRadius: "10px", resize: "vertical", minHeight: "60px", width: "100%" }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setComment((e.target as HTMLInputElement).value)
              }
            }}
          />
            <button className={styles.closeButton} style={{ border: "none", padding: "5px 10px", backgroundColor: "transparent" }}
              onClick={() => commentAction("add", { userId: searchParams.idUserProps.id, text: comment, authorId: "937d1ef3-f9e8-4d4c-9a12-afcfabec996a" })}>❱❱❱</button>
          </div>
          <ol style={{ listStyleType: "none" }}>{commentsMap}</ol>
        </div>
      </div>
    </div >
  )
}
