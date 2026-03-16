"use client"
import { toCorrectUserAcc, TypeAcc, CommentUserType, FileObj } from '../DTO/DTO'
import { useEffect, useState } from 'react'
import styles from './UserProfileClient.module.scss'
import DownloadFile from '../Helpers/DownloadFile'

export default function UserProfileClient({ searchParams }: { searchParams: { id: string, idUserProps: toCorrectUserAcc } }) {
  const [comment, setComment] = useState<string>('')
  const [comments, setComments] = useState<CommentUserType[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const [files, setFiles] = useState<{ filename: string, signedUrl: string }[]>([]);
  const [addFileInOrganizer, setAddFileInUser] = useState<boolean>(false)
  const [filesUserOrganizer, setFilesUserOrganizer] = useState<FileObj[] | []>([{ file: null, id: 0 }]); //файлы
  const [showFilesUserOrganizer, setShowFilesUserOrganizer] = useState<boolean>(false) //открыты ли файлы флаг

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


  const getFiles = async () => {

    const request = await fetch("/api/client/search-files-in-user",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: searchParams.idUserProps.id
        }),
      }
    );

    if (!request.ok) {
      throw new Error("Ошибка получения комментариев");
    }
    const response = await request.json();
    console.log(response.filesUser)
    setFiles(response.filesUser)

  };
  useEffect(() => {
    getFiles()
  }, [])

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
  function getFileType(path: string) {
    const cleanPath = path.split('?')[0];
    const ext = cleanPath.split('.').pop()?.toLowerCase();
    const waybill = cleanPath.split('-').at(-2)?.toLowerCase();
    if (!ext) return 'unknown';

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
      return 'image'
    }
    else if (waybill === "waybill" && ext === 'pdf') {
      return 'waybill'
    }
    else if (ext === 'pdf') {
      return 'pdf'
    }
    else if (['doc', 'docx'].includes(ext)) {
      return 'doc'
    }
    else if (['xls', 'xlsx'].includes(ext)) {
      return 'xls'
    };
    return 'text';
  }

  const mapFilesOrganizer = Array.isArray(files) ?
    files.map((el, index) => {
      const type = getFileType(el.signedUrl);
      return (
        <li key={el.signedUrl}
          className={styles.files__item}>
          {type === 'image' ? (
            <div className={styles.files__file}
            >
              {/* <Image  //возможность просмотра
                  src={el}
                  alt=""
                  width={1300}
                  height={1200}
                  style={{ objectFit: 'contain' }}
                /> */}
              <a
                href={el.signedUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                {index + 1}. ИЗОБРАЖЕНИЕ {el.filename}
              </a>
            </div>

          ) : //type === 'pdf' ? (  //возможность просмотра
            //   <div style={{ display: "flex", flexDirection: "row" }}>
            //     {/* добавить hover */}
            //     <iframe
            //       src={el}
            //       width="100%"
            //       height="600"
            //     />
            //     <p>пдф</p>
            //   </div>
            // ) 
            type === 'waybill' ? (
              <div className={styles.files__file}
              >
                <a
                  href={el.signedUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {index + 1}. waybill.pdf
                </a>
              </div>)
              :
              type === 'pdf' ? (
                <div className={styles.files__file}
                >
                  <a
                    href={el.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    {index + 1}. ФАЙЛ PDF {el.filename}
                  </a>
                </div>)
                :
                type === 'doc' ? (
                  <div className={styles.files__file}
                  >
                    {/* добавить hover */}
                    <a
                      href={el.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      {index + 1}. ФАЙЛ DOC {el.filename}
                    </a>
                  </div>

                ) :
                  type === 'xls' ? (
                    <div className={styles.files__file}
                    >
                      {/* добавить hover */}
                      <a
                        href={el.signedUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                      >
                        {index + 1}. ФАЙЛ XLS {el.filename}
                      </a>
                    </div>

                  ) : (
                    <div className={styles.files__file}
                    >
                      {/* добавить hover */}
                      <a
                        href={el.signedUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                      >
                        {index + 1}. ФАЙЛ {el.filename}
                      </a>
                    </div>
                  )
          }
        </li >
      );
    })
    : null;

  const onSubmitUserOrganization = async () => {
    if (!searchParams.idUserProps.id) return;
    const formData = new FormData();
    filesUserOrganizer.forEach((el: {
      id: number;
      file: File | null;
    }) => {

      if (el.file) {
        formData.append(`files[${el.id}]`, el.file as File);
      }
    });
    formData.append("userId", String(searchParams.idUserProps.id))       // id отправителя

    const response = await fetch("/api/admin/admin-actions/addFilesInUser", {
      method: "POST", body: formData,
    });
    if (!response.ok) {
      throw new Error("Ошибка отправки")
    }
    // getOrder(numberOrder)//добавить обновление
    setAddFileInUser(false)
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
            <p><b>Контактная информация:</b></p>
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

        <div className={styles.orderContainer__clients_files}>

          <p className={styles.orderContainer__clients_filesList}><b>Ваши файлы:</b><b></b></p>
          <ol className={styles.files}>
            {mapFilesOrganizer}
          </ol>

          {addFileInOrganizer ?
            <div className={styles.files__add}>
              <div
                onClick={() => setAddFileInUser(false)}
                className={`${styles.closeButton} ${styles.files__addClose}`}>
                отмена
              </div>

              <DownloadFile invoiceFiles={filesUserOrganizer}
                setInvoiceFiles={setFilesUserOrganizer}
                showInvois={showFilesUserOrganizer}
                setShowInvois={setShowFilesUserOrganizer}
                isOrder={false}
                isUserSender={false}
                isUserRecipient={false}
                isUserOrganizer={true} />
              <button className={styles.files__addSend}
                onClick={() => onSubmitUserOrganization()}>❱❱❱</button>
            </div>
            :
            <button className={styles.files__add_plus}
              onClick={() => setAddFileInUser(true)}>Добавить файл</button>
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
