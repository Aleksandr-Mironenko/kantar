"use client";
import Image from "next/image";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import Order from '../Оrder/Order'
// import { columns } from "./columns";
// import { orders } from "./data";
import { useCallback, useEffect, useState } from "react";
import styles from "./PolingAdminPanel.module.scss";
import { TableOrdersRecord, TableOrdersRecordMeta, TableOrdersRecorResponse, TableOrdersRecordWithEvent, WSMessage } from "../DTO/DTO";
import { ColumnDef } from "@tanstack/react-table";

// Extend ColumnDef to include meta with editable property
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    editable?: boolean;
    editor?: "input" | "select";
    options?: { label: string; value: string | number }[];
    inputType?: "text" | "number"
  }
}

export default function PolingeAdminPanel() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [orders, setOrders] = useState<TableOrdersRecord[]>([])
  const [meta, setMeta] = useState<TableOrdersRecordMeta>({
    page: 1,
    limit: 10,
    total: 10,
    totalPages: 10,
    hasNext: false,
    hasPrev: false,
  })

  const [place, setPlace] = useState([])
  const [view, setView] = useState<boolean>(false)
  const [activeNumberOrder, setActiveNumberOrder] = useState<number>(100042)

  const [editingCell, setEditingCell] = useState<{
    orderId: number;      // или string — как у тебя в orders
    columnId: string;
    value: string;
  } | null>(null);
  const [url, setUrl] = useState<string[]>([]);

  const getOrders = async (page: number) => {
    const request = await fetch(`api/admin/admin-panel-poling/orders/search-all-orders?page=${page}`)

    if (!request.ok) {
      throw new Error("Ошибка получения заказов")
    }

    const response: TableOrdersRecorResponse = await request.json();
    setOrders(response.arrayOrderObjData)
    setMeta(response.meta)

  }


  useEffect(() => {
    getOrders(1)
  }, []);


  const dateCreateOrder = (date: string) => {
    const qweqwe = new Date(date).toLocaleString()
    const aaa = qweqwe.split(",")
    const bbb = aaa[0].split(".")
    return `${bbb[0]}.${bbb[1]}.${bbb[2]} в ${aaa[1]} `
  }


  const columns: ColumnDef<TableOrdersRecord>[] = [
    {
      accessorKey: "order_number",
      header: "№",
      meta: {
        editable: false,
      },
    },
    {
      accessorKey: "created_at",
      header: "дата",
      cell: info => dateCreateOrder(info.getValue<string>()),
      meta: {
        editable: false,
      },
    },
    {
      accessorKey: "heft_full",
      header: "вес",
      meta: {
        editable: true,
        editor: "input",
        inputType: "text",
      },
    },
    {
      accessorKey: "price_full",
      header: "Стоимость",
      cell: info => `${info.getValue<number>()} ₽`,
      meta: {
        editable: false,
      },
    },
    {
      accessorKey: "discount_this_send",
      header: "скидка",
      cell: info => `${info.getValue<number>()}%`,
      meta: {
        editable: true,
        editor: "select",
        options: [
          { value: "0", label: "0%" },
          { value: "1", label: "1%" },
          { value: "2", label: "2%" },
          { value: "3", label: "3%" },
          { value: "4", label: "4%" },
          { value: "5", label: "5%" },
          { value: "6", label: "6%" },
          { value: "7", label: "7%" },
          { value: "8", label: "8%" },
          { value: "9", label: "9%" },
          { value: "10", label: "10%" },
          { value: "11", label: "11%" },
          { value: "12", label: "12%" },
          { value: "13", label: "13%" },
          { value: "14", label: "14%" },
          { value: "15", label: "15%" },
          { value: "16", label: "16%" },
          { value: "17", label: "17%" },
          { value: "18", label: "18%" },
          { value: "19", label: "19%" },
          { value: "20", label: "20%" },
          { value: "21", label: "21%" },
          { value: "22", label: "22%" },
          { value: "23", label: "23%" },
          { value: "24", label: "24%" },
          { value: "25", label: "25%" },
          { value: "26", label: "26%" },
          { value: "27", label: "27%" },
          { value: "28", label: "28%" },
          { value: "29", label: "29%" },
          { value: "30", label: "30%" },
          { value: "31", label: "31%" },
          { value: "32", label: "32%" },
          { value: "33", label: "33%" },
          { value: "34", label: "34%" },
          { value: "35", label: "35%" },
          { value: "36", label: "36%" },
          { value: "37", label: "37%" },
          { value: "38", label: "38%" },
          { value: "39", label: "39%" },
          { value: "40", label: "40%" },
          { value: "41", label: "41%" },
          { value: "42", label: "42%" },
          { value: "43", label: "43%" },
          { value: "44", label: "44%" },
          { value: "45", label: "45%" },
          { value: "46", label: "46%" },
          { value: "47", label: "47%" },
          { value: "48", label: "48%" },
          { value: "49", label: "49%" },
          { value: "50", label: "50%" },
          { value: "51", label: "51%" },
          { value: "52", label: "52%" },
          { value: "53", label: "53%" },
          { value: "54", label: "54%" },
          { value: "55", label: "55%" },
          { value: "56", label: "56%" },
          { value: "57", label: "57%" },
          { value: "58", label: "58%" },
          { value: "59", label: "59%" },
          { value: "60", label: "60%" },
          { value: "61", label: "61%" },
          { value: "62", label: "62%" },
          { value: "63", label: "63%" },
          { value: "64", label: "64%" },
          { value: "65", label: "65%" },
          { value: "66", label: "66%" },
          { value: "67", label: "67%" },
          { value: "68", label: "68%" },
          { value: "69", label: "69%" },
          { value: "70", label: "70%" },
          { value: "71", label: "71%" },
          { value: "72", label: "72%" },
          { value: "73", label: "73%" },
          { value: "74", label: "74%" },
          { value: "75", label: "75%" },
          { value: "76", label: "76%" },
          { value: "77", label: "77%" },
          { value: "78", label: "78%" },
          { value: "79", label: "79%" },
          { value: "80", label: "80%" },
          { value: "81", label: "81%" },
          { value: "82", label: "82%" },
          { value: "83", label: "83%" },
          { value: "84", label: "84%" },
          { value: "85", label: "85%" },
          { value: "86", label: "86%" },
          { value: "87", label: "87%" },
          { value: "88", label: "88%" },
          { value: "89", label: "89%" },
          { value: "90", label: "90%" },
          { value: "91", label: "91%" },
          { value: "92", label: "92%" },
          { value: "93", label: "93%" },
          { value: "94", label: "94%" },
          { value: "95", label: "95%" },
          { value: "96", label: "96%" },
          { value: "97", label: "97%" },
          { value: "98", label: "98%" },
          { value: "99", label: "99%" }
        ],
      },
    },
    {
      accessorKey: "is_individual",
      header: "индивидуальное",
      cell: info => `${info.getValue<number>() ? "да" : "нет"}`,
      meta: {
        editable: true,
        editor: "select",
        options: [
          { value: "true", label: "да" },
          { value: "false", label: "нет" },
        ],
      },
    },
    {
      accessorKey: "is_paid",
      header: "Оплачен",
      cell: info => `${info.getValue<number>() ? "да" : "нет"}`,
      meta: {
        editable: true,
        editor: "select",
        options: [
          { value: "true", label: "да" },
          { value: "false", label: "нет" },
        ],
      },
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: info => `${info.getValue<string>() === "new" ? "новый" :
        info.getValue<string>() === "pickup_required_(processed)" ? "требуется забор (обработано)" :
          info.getValue<string>() === "awaiting_payment_(shipped)" ? "ожидает оплаты(отправлен)" :
            info.getValue<string>() === "awaiting_payment_(not_shipped)" ? "ожидает оплаты(не отправлен)" :
              info.getValue<string>() === "in_transit" ? "в пути" :
                info.getValue<string>() === "delivery_pending" ? "согласовываем вручение" :
                  info.getValue<string>() === "in_transit_(delivery)" ? "в пути (вручение)" :
                    info.getValue<string>() === "delivered" ? "вручено" :
                      info.getValue<string>() === "canceled" ? "отменено" :
                        info.getValue<string>() === "archived" ? "архивный" : ""}`,
      meta: {
        editable: true,
        editor: "select",
        options: [
          { value: "new", label: "новый" },
          { value: "pickup_required_(processed)", label: "требуется забор (обработано)" },
          { value: "awaiting_payment_(shipped)", label: "ожидает оплаты (отправлен)" },
          { value: "awaiting_payment_(not_shipped)", label: "ожидает оплаты(не отправлен)" },
          { value: "in_transit", label: "в пути" },
          { value: "delivery_pending", label: "согласовываем вручение" },
          { value: "in_transit_(delivery)", label: "в пути (вручение)" },
          { value: "delivered", label: "вручено" },
          { value: "canceled", label: "отменено" },
          { value: "archived", label: "архивный" },
        ],
      },
    },

    {
      accessorKey: "name_from",
      header: "Отправитель",
      meta: {
        editable: true,
        editor: "input",
      },
    },
    {
      accessorKey: "phone_from",
      header: "номер отправителя",
      meta: {
        editable: true,
        editor: "input",
      },
    },
    {
      accessorKey: "email_from",
      header: "Почта отправителя",
      meta: {
        editable: true,
        editor: "input",
      },
    },
    {
      accessorKey: "name_where",
      header: "Получатель",
      meta: {
        editable: true,
        editor: "input",
      },
    },
    {
      accessorKey: "phone_where",
      header: "номер получателя",
      meta: {
        editable: true,
        editor: "input",
      },
    },
    {
      accessorKey: "email_where",
      header: "Почта получателя",
      meta: {
        editable: true,
        editor: "input",
      },
    },
  ];


  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // const message = orders.map(el => {
  //   return (
  //     <li key={el.id} className={styles.adminpages__part}>
  //       <div className={styles.adminpages__column}>{el.address_from_id}</div>
  //       <div className={styles.adminpages__column}>{el.address_where_id}</div>
  //       <div className={styles.adminpages__column}>{el.discount_this_send}</div>
  //       <div className={styles.adminpages__column}>{el.email_from}</div>
  //       <div className={styles.adminpages__column}>{el.email_where}</div>
  //       <div className={styles.adminpages__column}>{el.heft_full}</div>
  //       <div className={styles.adminpages__column}>{el.is_individual}</div>
  //       <div className={styles.adminpages__column}>{el.is_paid}</div>
  //       <div className={styles.adminpages__column}>{el.name_from}</div>
  //       <div className={styles.adminpages__column}>{el.name_where}</div>
  //       <div className={styles.adminpages__column}>{el.phone_from}</div>
  //       <div className={styles.adminpages__column}>{el.phone_where}</div>
  //       <div className={styles.adminpages__column}>{el.price_full}</div>
  //       <div className={styles.adminpages__column}>{el.recipient_id}</div>
  //       <div className={styles.adminpages__column}>{el.sender_id}</div>
  //       <div className={styles.adminpages__column}>{el.status}</div>
  //     </li>
  //   )
  // })

  const saveCell = async () => {
    if (!editingCell) return;

    const { orderId, columnId, value } = editingCell;

    let finalValue: number | boolean | string = value

    // boolean
    if (columnId === "is_paid" || columnId === "is_individual") {
      finalValue = value === "true";
    }

    // number
    if (columnId === "discount_this_send" || columnId === "heft_full") {
      const num = Number(value);
      if (Number.isNaN(num))
        finalValue = num;
    }



    await fetch("/api/admin/admin-panel-poling/orders/update-orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: orderId,
        field: columnId,
        value: finalValue,
      }),
    });

    setEditingCell(null);


    await getOrders(meta.page);
  };




  const getPlaces = async (props = 1000100) => {
    const request = await fetch("api/admin/admin-panel-poling/orders/search-place-in-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        props
      })
    })

    if (!request.ok) {
      throw new Error("Ошибка получения мест")
    }

    const response = await request.json();
    setUrl(response.arrrfiles)
    setPlace(response.arrayPlacesInOrder)

  }
  console.log(place)

  useEffect(() => {
    getPlaces(100070)
  }, []);



  const pagination = (
    <>
      {meta.page - 2 > 0 && (
        <button
          onClick={() => {
            getOrders(meta.page - 2)
          }}
          style={{ borderColor: "white", fontWeight: 900, borderRadius: "50%", color: "black", margin: "0 15px" }}>
          <div style={{ width: "25px" }}>
            {meta.page - 2}
          </div>
        </button>
      )
      }
      {
        meta.page - 1 > 0 && (
          <button
            onClick={() => {
              getOrders(meta.page - 1)
            }}
            style={{ borderColor: "white", fontWeight: 900, borderRadius: "50%", color: "black", margin: "0 15px" }}>
            <div style={{ width: "25px" }}>
              {meta.page - 1}
            </div>
          </button>

        )
      }
      <div style={{ textDecoration: "underline", color: "rgba(255, 255, 255, 0.7)", fontWeight: 700, display: "inline-block", margin: "0 10px" }}>
        {meta.page}
      </div>
      {
        meta.totalPages + 1 > meta.page + 1 && (
          <button onClick={() => {
            getOrders(meta.page + 1)
          }}
            style={{ borderColor: "white", fontWeight: 900, borderRadius: "50%", color: "black", margin: "0 15px" }}>
            <div style={{ width: "25px" }}>
              {meta.page + 1}
            </div>
          </button>
        )
      }
      {
        meta.totalPages + 1 > meta.page + 2 && (
          <button
            onClick={() => {
              getOrders(meta.page + 2)
            }}
            style={{ borderColor: "white", fontWeight: 900, borderRadius: "50%", color: "black", margin: "0 15px" }}>
            <div style={{ width: "25px" }}>
              {meta.page + 2}
            </div>
          </button>
        )
      }
      <div style={{ marginLeft: "40px", color: "white", borderRadius: "25% 25% 25% 25%", textDecoration: "underline", padding: "0 5px", display: "inline-block", margin: "0 15px" }}>
        Всего: {meta.totalPages}
      </div>
    </>
  )

  return (
    <>
      <button onClick={() => setIsOpen(prev => !prev)}>{isOpen ? "Закрыть админку" : "Открыть админку"} </button>
      {
        isOpen ? (<section className={styles.adminpages} id="adminpages">
          <h2 className={styles.adminpages__title}>Админ панель</h2>
          <h3 className={styles.adminpages__title_table}>Список заказов</h3>
          <div className={styles.adminpages__block}>
            <div className={styles.adminpages__block}>{/*блок  в котором будет 2 кномки переключения между новыми заказами и запросами на договор/*/}

            </div>
            <div className={styles.adminpages__block}>{/*в этом блоке будут все заказы*/}
              {/* {message} */}
              <table style={{ width: "100%", minWidth: "1709px" }} border={1} cellPadding={8}>
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr style={{ backgroundColor: "Gainsboro" }} key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th style={{ padding: "5px" }} key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr style={{ border: "2px solid red" }} key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          onClick={() => {
                            if (cell.column.id === "order_number") {
                              const value = cell.getValue() as number;
                              console.log("Price clicked:", value)
                              setActiveNumberOrder(value)
                              setView(true)

                            }
                          }}
                          onDoubleClick={() => {
                            if (!cell.column.columnDef.meta?.editable) return;

                            if (
                              editingCell &&
                              editingCell.orderId === row.original.id &&
                              editingCell.columnId === cell.column.id
                            ) {
                              return;
                            }

                            const rawValue = cell.getValue();
                            let value = "";

                            if (cell.column.id === "is_paid" || cell.column.id === "is_individual") {
                              value = rawValue ? "true" : "false";
                            } else {
                              value = String(rawValue ?? "");
                            }

                            setEditingCell({
                              orderId: row.original.id,
                              columnId: cell.column.id,
                              value,
                            });
                          }}
                          style={{
                            padding: "15px 7px",
                            cursor: cell.column.columnDef.meta?.editable ? "pointer" : "default",
                            textWrap: "nowrap",
                            fontSize: "15px",
                          }}
                        >
                          {editingCell &&
                            editingCell.orderId === row.original.id &&
                            editingCell.columnId === cell.column.id ? (
                            cell.column.columnDef.meta?.editor === "select" ? (
                              <div className={styles.adminpages__select}>
                                <select
                                  autoFocus
                                  value={editingCell.value}
                                  onChange={(e) =>
                                    setEditingCell(prev =>
                                      prev ? { ...prev, value: e.target.value } : prev
                                    )
                                  }
                                  style={{ width: "100%" }}
                                >
                                  {cell.column.columnDef.meta?.options?.map(opt => (
                                    <option key={opt.value} value={String(opt.value)}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <button className={styles.adminpages__select_button} onClick={saveCell}> ✅</button>
                              </div>
                            ) : (
                              <input
                                type={cell.column.columnDef.meta?.inputType || "text"}
                                autoFocus
                                value={editingCell.value}
                                onChange={(e) =>
                                  setEditingCell(prev =>
                                    prev ? { ...prev, value: e.target.value } : prev
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveCell();
                                  if (e.key === "Escape") setEditingCell(null);
                                }}
                                style={{ width: "100%" }}
                              />
                            )

                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
          <div className={styles.adminpages__title_table_bottom}>{pagination}</div>
          <div className={styles.adminpages__list}>{/*блок создать заказ*/}

            {view && <Order numberOrder={activeNumberOrder} />}
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

        </section >) : null
      }
    </>
  )
}