"use client";

import DownloadFile from '../Helpers/DownloadFile';
import styles from './FormCalc.module.scss'

import { FileObj, ServicesAdminType } from '@/app/components/DTO/DTO'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const dateCreateOrder = (date: string) => {
  const qweqwe = new Date(date).toLocaleString()
  const aaa = qweqwe.split(",")
  const bbb = aaa[0].split(".")
  return `${bbb[0]}.${bbb[1]}.${bbb[2]} в ${aaa[1]} `
}

export default function ServicesAdmin() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showServicesAdmin, setShowServicesAdmin] = useState<boolean>(false)
  const [showAddService, setShowAddService] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [fullDescription, setFullDescription] = useState<string>('')
  const [urlImage, setUrlImage] = useState<string>('')
  const [urlPage, setUrlPage] = useState<string>('')
  const [isActive, setIsActive] = useState<boolean>(false)
  const [isMainComponent, setIsMainComponent] = useState<boolean>(false)

  const [urlVizualName, setUrlVizualName] = useState<string>('')
  const [urlImageSigned, setUrlImageSigned] = useState<string>('')
  // url_vizual_name    urlVizualName
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [services, setServices] = useState<ServicesAdminType[]>([])
  const [vizualNames, setVizualNames] = useState<string[]>([])


  // invoiceFiles={filesOrder}
  //                 setInvoiceFiles={setFilesOrder}
  //                 showInvois={showFilesOrder}
  //                 setShowInvois={setShowFilesOrder}
  const [filesOrder, setFilesOrder] = useState<FileObj[]>([{ file: null, id: 0 }]); //файлы

  const [showFilesOrder, setShowFilesOrder] = useState<boolean>(false) //открыты ли файлы флаг


  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<ServicesAdminType | null>(null)


  const getServices = async () => {
    const response = await fetch("/api/admin/admin-panel-poling/services-admin/get")
    if (!response.ok) {
      throw new Error("Ошибка получения сервисов")
    }
    const res = await response.json()
    console.log(res)
    setServices(res)
    const arrUrlsVizualNames = res.map((el: ServicesAdminType) => {
      return el.url_vizual_name
    })
    setVizualNames(arrUrlsVizualNames)
  }

  //надо эту функцию поправить под серверный эндпоинт изменения бд +срервеный эндпоинт тоже




  const onSubmit = async (type: "add" | "update" | "del", props?: string) => {
    const formData = new FormData()
    if (type === "add") {



      formData.append("type", "add")
      formData.append("name", name)
      formData.append("description", description)
      formData.append("full_description", fullDescription)
      formData.append("url_page", urlPage)
      formData.append("is_active", String(isActive))
      formData.append("is_main_component", String(isMainComponent))
      formData.append("url_vizual_name", urlVizualName)

      if (filesOrder[0].file) {
        formData.append("file", filesOrder[0].file)
      }
    }
    if (type === "update" && editValues) {
      formData.append("type", "update")
      formData.append("id", editValues.id)
      formData.append("newName", editValues.name)
      formData.append("description", editValues.description)
      formData.append("full_description", editValues.full_description)
      formData.append("url_image", editValues.url_image)
      formData.append("url_page", editValues.url_page)
      formData.append("is_active", String(editValues.is_active))
      formData.append("is_main_component", String(isMainComponent))
      formData.append("url_vizual_name", editValues.url_vizual_name,)
      if (filesOrder[0]?.file) {
        formData.append("file", filesOrder[0].file)
      }
      if (filesOrder[0].file) {
        formData.append("file", filesOrder[0].file)
      }
    }
    if (type === "del") {

      formData.append("type", "del")
      formData.append("id", String(props))
    }

    const response = await fetch("/api/admin/admin-panel-poling/services-admin", {
      method: "POST",

      body: formData,
    });

    const result = await response.json();
    console.log(result);
    if (!response.ok) {
      console.log("данные не отправлены")


    } else {
      if (type === "add") {
        setName('')
        setDescription('')
        setFullDescription('')
        // setUrlImage('')
        setUrlPage('')
        setIsActive(false)
        setIsMainComponent(false)
        setUrlVizualName("")// url_vizual_name    urlVizualName
        setUrlImageSigned("")

        setShowAddService(false)
        setFilesOrder([{ file: null, id: 0 }])
        console.log("данные отправлены")

        timerRef.current = setTimeout(() => {
          getServices()
        }, 1000)
      } else if (type === "update") {
        setEditingId(null)
        setEditValues(null)

        timerRef.current = setTimeout(() => {
          getServices()
        }, 500)
      } else if (type === "del") {
        timerRef.current = setTimeout(() => {
          getServices()
        }, 1000)
      }





    }
  }



  const mapServices = (services ?? []).map(el => (
    <li style={{ position: "relative", borderRadius: "10px", backgroundColor: "white", border: "1px solid black", padding: "10px" }}
      key={el.id}>
      <div style={{ padding: "5px 7px" }}><span> Название сервиса: </span>
        {editingId === el.id && editValues
          ?
          <input
            value={editValues.name}
            onChange={(e) => {
              setName(e.target.value)
              setEditValues({ ...editValues, name: e.target.value })
            }
            }
          />
          :
          <span style={{ marginLeft: "10px" }}>
            {el.name}
          </span>
        } </div>
      <div style={{ padding: "5px 7px" }}><span> Текст в строке url: </span>

        {editingId === el.id && editValues
          ?
          <input
            value={editValues.url_vizual_name}
            onChange={(e) => {
              setUrlVizualName(e.target.value)
              setEditValues({ ...editValues, url_vizual_name: e.target.value })
            }
            }
          />
          :
          <span style={{ marginLeft: "10px" }}>
            {el.url_vizual_name}
          </span>
        } </div>

      <div style={{ padding: "5px 7px" }}><span> Краткое описание: </span>
        {editingId === el.id && editValues
          ?
          <input
            value={editValues.description}
            onChange={(e) => {
              setDescription(e.target.value)
              setEditValues({ ...editValues, description: e.target.value })
            }
            }
          />
          :
          <span style={{ marginLeft: "10px" }}>{el.description}</span>
        }
      </div>
      <div style={{ padding: "5px 7px" }}><span> Полное описание: </span>
        {editingId === el.id && editValues
          ?
          <input
            value={editValues.full_description}
            onChange={(e) => {
              setFullDescription(e.target.value)
              setEditValues({ ...editValues, full_description: e.target.value })
            }
            }
          />
          :
          <span style={{ marginLeft: "10px" }}>{el.full_description}</span>
        }
      </div>
      <div style={{ padding: "5px 7px" }}><span> Место картинки в БД: </span>
        {editingId === el.id && editValues
          ?
          <input
            value={editValues.url_image}
            onChange={(e) =>
              setEditValues({ ...editValues, url_image: e.target.value })
            }
          />
          :
          // <span style={{ marginLeft: "10px" }}>{el.url_image}</span>

          <a
            style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px", marginLeft: "10px" }}
            target='blanc'
            href={el.url_image}>открыть
          </a>}
      </div>

      <div style={{ padding: "5px 7px" }}><span> Адрес картинки: </span>
        {editingId === el.id && editValues
          ?
          <input
            value={editValues.url_image_signed}
            onChange={(e) => {
              setUrlImageSigned(e.target.value)
              setEditValues({ ...editValues, url_image_signed: e.target.value })
            }
            }
          />
          :
          //  <span style={{ marginLeft: "10px" }}>{el.url_image_signed}</span>
          <a
            style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px", marginLeft: "10px" }}
            target='blanc'
            href={el.url_image_signed}>открыть
          </a>
        }
      </div>

      {/* <div style={{ padding: "5px 7px" }}><span> Адрес страницы: </span>
        {editingId === el.id && editValues
          ?
          <input
            value={editValues.url_page}
            onChange={(e) => {
              setUrlPage(e.target.value)
              setEditValues({ ...editValues, url_page: e.target.value })
            }
            }
          />
          : <span style={{ marginLeft: "10px" }}>{el.url_page}</span>
        }
      </div> */}

      <div style={{ padding: "5px 7px" }}><span> Адрес страницы: </span>
        {editingId === el.id && editValues
          ?
          <input
            value={editValues.url_vizual_name}
            onChange={(e) => {
              setUrlVizualName(e.target.value)
              setEditValues({ ...editValues, url_page: e.target.value })
            }
            }
          />
          :
          // <span style={{ marginLeft: "10px" }}>{el.url_page}</span>
          <a
            style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "5px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px", marginLeft: "10px" }}
            target='blanc'
            href={`services/${el.url_vizual_name}`}>открыть
          </a>
        }
      </div>


      <div style={{ padding: "5px 7px" }}>
        <span> Отображается или нет: </span>

        {editingId === el.id && editValues ? (
          <input
            type="checkbox"
            checked={editValues.is_active}
            onChange={(e) => {
              setIsActive(e.target.checked)
              setEditValues({
                ...editValues,
                is_active: e.target.checked,
              })
            }
            }
          />
        ) : (
          <span style={{ marginLeft: "10px" }}>
            {el.is_active ? <span style={{ textDecoration: "underline", color: "red", fontWeight: "900" }}> отображается </span> : "нет"}
          </span>
        )}
      </div>


      <div style={{ padding: "5px 7px" }}>
        <span>Является ли основным: </span>

        {editingId === el.id && editValues ? (
          <input
            type="checkbox"
            checked={editValues.is_main_component}
            onChange={(e) => {
              setIsMainComponent(e.target.checked)
              setEditValues({
                ...editValues,
                is_main_component: e.target.checked,
              })
            }
            }
          />
        ) : (
          <span style={{ marginLeft: "10px" }}>
            {el.is_main_component ? <span style={{ textDecoration: "underline", color: "red", fontWeight: "900" }}> основной </span> : "нет"}
          </span>
        )}
      </div>


      {/* <div style={{ padding: "5px 7px" }}><span>Место в бд: </span>
        <span style={{ marginLeft: "10px" }}>{el.url_image}</span>
      </div>

      <div style={{ padding: "5px 7px" }}><span>Ссылка на картинку: </span>
        <span style={{ marginLeft: "10px" }}>{el.url_image_signed}</span>
      </div> */}
      {editingId === el.id && editValues && (
        <div style={{ position: "relative", margin: "20px 0 20px 20px" }}>
          <DownloadFile invoiceFiles={filesOrder}
            setInvoiceFiles={setFilesOrder}
            showInvois={showFilesOrder}
            setShowInvois={setShowFilesOrder}
            isOrder={false}
            isUserSender={false}
            isUserRecipient={false}
            isService={true} />
        </div>)}

      <div style={{ padding: "5px 7px" }}><span> Дата создания: </span>
        <span style={{ marginLeft: "10px" }}>{dateCreateOrder(el.created_at)}</span></div>
      <div style={{ padding: "5px 7px" }}><span> Дата обновления: </span>
        <span style={{ marginLeft: "10px" }}>{dateCreateOrder(el.updated_at)}</span></div>

      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
        <div style={{ display: "inline-flex", flexDirection: "column" }}>
          <h4 style={{ alignSelf: "center" }}>На сайте</h4>
          <div key={el.id} className={styles.services__item} >
            <a
              href={`services/${el.url_vizual_name}`}
              className={styles.services__link}
              target='blanc'>
              <div style={{ maxWidth: "80px", minWidth: "80px" }}>
                <Image
                  className={styles.services__item_image}
                  src={el.url_image_signed}
                  alt={el.url_vizual_name}
                  width={242}
                  height={127}
                  priority />
              </div>

              <div className={styles.services__item_textBlock} >
                <h3 className={styles.services__item_title}>{el.name}</h3>
                <p className={styles.services__item_text}>{el.description}</p>
              </div>
            </a>
          </div>
        </div>

        {editingId === el.id && editValues && (<div style={{ display: "inline-flex", flexDirection: "column" }}>
          <h4 style={{ alignSelf: "center" }}>Корректируемая версия</h4>
          <div key={el.id} className={styles.services__item} >
            <a
              href={urlPage}
              className={styles.services__link}
              target='blanc'>
              <div style={{ maxWidth: "80px", minWidth: "80px" }}>
                <Image
                  className={styles.services__item_image}
                  src={urlImageSigned}
                  alt={urlVizualName}
                  width={242}
                  height={127}
                  priority />
              </div>

              <div className={styles.services__item_textBlock} >
                <h3 className={styles.services__item_title}>{name}</h3>
                <p className={styles.services__item_text}>{description}</p>
              </div>
            </a>
          </div>
        </div>)}


      </div>


      <div style={{ position: "absolute", top: "0", right: "0" }}>

        {editingId === el.id && editValues ?
          < >
            <button className={styles.commentsButtonCancel}
              onClick={() => {
                setEditingId(null)
                setEditValues(null)
              }}>Отмена</button>


            <button className={styles.commentsButton}
              onClick={async (e) => {
                e.preventDefault()

                await onSubmit("update", el.id)

              }}>✓</button>    </>
          :
          <button className={styles.commentsButton}
            onClick={() => {
              setEditingId(el.id)
              setEditValues(el)
              setName(el.name)
              setDescription(el.description)
              setFullDescription(el.full_description)
              setUrlImage(el.url_image)
              setUrlPage(el.url_page)
              setIsActive(el.is_active)
              setIsMainComponent(el.is_main_component)
              setUrlVizualName(el.url_vizual_name)
              setUrlImageSigned(el.url_image_signed)

            }}>🖉</button>}

        <button className={styles.closeButton} onClick={async (e) => {
          e.preventDefault()
          await onSubmit("del", el.id)

        }}> ×</button></div>
    </li >
  ))
  useEffect(() => {
    const fetchData = async () => {
      await getServices()
    }
    fetchData()
  }, [])


  useEffect(() => {
    if (filesOrder[0]?.file) {
      const objectUrl = URL.createObjectURL(filesOrder[0].file)
      setPreviewUrl(objectUrl)

      return () => {
        URL.revokeObjectURL(objectUrl) // очищаем память
      }
    }
  }, [filesOrder])




  const inc = (str: string) => {

    if (vizualNames.includes(str)) {
      return true
    }
    return false
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (


    <section className={styles.formcalc
    } >
      {
        showServicesAdmin ?
          (<>
            <div
              onClick={() => setShowServicesAdmin(false)}
              className={styles.closeButton} style={{ color: "white" }}>
              ×
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              justifyContent: "center"
            }}>
              <h2 style={{ color: "white" }} >{services.length ? "Список сервисов" : "Список сервисов пуст"} </h2>
            </div>
            <h2></h2>
            <ol style={{ listStyleType: "none" }}>{mapServices}</ol>



            {!showAddService &&
              <button
                onClick={() => setShowAddService(true)} className={styles.add__service}>
                +
              </button>
            }
            {showAddService &&
              (<form
                style={{ marginTop: "20px" }}
                onSubmit={async (e) => {
                  e.preventDefault()
                  await onSubmit("add")
                }}
              >

                < div className={styles.formcalc__container} >
                  <div className={styles.section} style={{ position: "relative" }}>
                    <button className={styles.closeButton} onClick={() => setShowAddService(false)}> ×</button>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "20px",
                      justifyContent: "center"
                    }}>
                      <h2 >Добавление сервиса</h2>
                    </div>
                    <label className={styles.label
                    } >
                      <span className={styles.label__span}>Название услуги</span>
                      <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        id='name'
                        className={styles.input}
                        placeholder="Название услуги"
                        type="text"
                      />
                    </label>


                    <label className={styles.label}>
                      <span className={styles.label__span}>Текст в строке url</span>
                      <input
                        value={urlVizualName}
                        onChange={e => setUrlVizualName(e.target.value)}
                        id="urlVizualName"
                        style={inc(urlVizualName) ? { color: "red", borderColor: "red" } : undefined}
                        className={styles.input}
                        placeholder="Адресная строка"
                        type="text"
                      />
                      {inc(urlVizualName) && <span style={{ fontWeight: "700", fontSize: "12px", color: "red", position: "relative", bottom: "-35px", right: "189px" }}>Нужно выбрать другой текст</span>}
                    </label>

                    <label className={styles.label}>
                      <span className={styles.label__span}> Описание</span>


                      <input
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        id='description'
                        className={styles.input}
                        placeholder="Описание"
                        type="text"
                      />
                    </label>


                    <label className={styles.label}>
                      <span className={styles.label__span}>Полное описание</span>
                      <input
                        value={fullDescription}
                        onChange={e => setFullDescription(e.target.value)}
                        id='fullDescription'
                        className={styles.input}
                        placeholder="Полное описание"
                        type="text"
                      />
                    </label>



                    {/* 
<input
                className={styles.radioButtonChenge}
                id="goods_long"
                type="radio"
                name="type_long"
                value="goods"
                checked={document === "goods"}
                onChange={(e) => setDocument(e.target.value as "goods")}
              /> */}

                    <label className={styles.label__checkbox}>
                      <span className={styles.label__span}>Отображается или нет:</span>
                      <input
                        checked={isActive}
                        onChange={() => setIsActive(!isActive)}
                        id='isActive'
                        className={styles.input}
                        type="checkbox"
                      />
                    </label>

                    <label className={styles.label__checkbox}>
                      <span className={styles.label__span}>Является ли основным:</span>
                      <input
                        checked={isMainComponent}
                        onChange={() => setIsMainComponent(!isMainComponent)}
                        id='isMainComponent'
                        className={styles.input}
                        type="checkbox"
                      />
                    </label>



                    <div style={{ position: "relative", margin: "20px 0 20px 20px" }}>
                      <DownloadFile invoiceFiles={filesOrder}
                        setInvoiceFiles={setFilesOrder}
                        showInvois={showFilesOrder}
                        setShowInvois={setShowFilesOrder}
                        isOrder={false}
                        isUserSender={false}
                        isUserRecipient={false}
                        isService={true}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
                      <div style={{ display: "inline-flex", flexDirection: "column" }}>
                        <h4 style={{ alignSelf: "center" }}>Создаваемая версия</h4>
                        <div className={styles.services__item} >
                          <a
                            href={urlPage}
                            className={styles.services__link}
                            target='blanc'>
                            <div style={{ maxWidth: "80px", minWidth: "80px" }}>
                              {previewUrl && (
                                <Image
                                  className={styles.services__item_image}
                                  src={previewUrl}
                                  alt="Image create"
                                  width={242}
                                  height={127}
                                  priority />
                              )}
                            </div>

                            <div className={styles.services__item_textBlock} >
                              <h3 className={styles.services__item_title}>{name}</h3>
                              <p className={styles.services__item_text}>{description}</p>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>



                    <div className={styles.label__wrapper}  >
                      <button
                        disabled={!name || !description || !fullDescription || !urlVizualName || filesOrder[0].file === null}
                        className={styles.submit} type="submit" >
                        Создать
                      </button>
                    </div>

                  </div>
                </div>
              </form >)}
          </>) :
          (<button style={{ backgroundColor: "#e31e24", fontWeight: "600", color: "white", padding: "20px", marginTop: "10px", fontSize: "15px", border: "1px solid #e31e24", borderRadius: "5px" }}
            onClick={(e) => {
              e.preventDefault()
              setShowServicesAdmin(true)

            }}>Администрировть услуги</button>)
      }
    </section >


  )
} 