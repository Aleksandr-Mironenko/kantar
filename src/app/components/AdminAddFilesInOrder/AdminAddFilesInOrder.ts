import { useState } from 'react'
import DownloadFile from "../Helpers/DownloadFile"

export default function AdminAddFilesInOrder() {
  const [showInvois, setShowInvois] = useState<boolean>(false) //открыты ли файлы флаг
  const [invoiceFiles, setInvoiceFiles] = useState<FileObj[] | []>([{ file: null, id: 0 }]); //файлы

  const onSubmit = async (data: FormValues) => {

    const { register, handleSubmit, control, formState: { errors, isValid }, setValue, getValues, trigger, watch, reset } = useForm<FormValues>({


      resolver: yupResolver(schema),
      mode: "onChange",
      reValidateMode: "onChange",//"onChange",
      criteriaMode: "all",
      shouldUnregister: false,
      defaultValues: {
        nameFrom: "",
        phoneFrom: "",
        emailFrom: "",
        adressFrom: from,
        nameWhere: "",
        phoneWhere: "",
        emailWhere: "",
        adressWhere: where,
        agree: true,
      },
    });

    const formData = new FormData();
    formData.append("nameFrom", data.nameFrom);
    formData.append("nameWhere", data.nameWhere);
    formData.append("phoneFrom", `+7${data.phoneFrom}`);//телефон
    formData.append("phoneWhere", `+7${data.phoneWhere}`);//телефон
    formData.append("emailFrom", data.emailFrom);
    formData.append("emailWhere", data.emailWhere);
    formData.append("adressFrom", data.adressFrom);
    formData.append("adressWhere", data.adressWhere);
    formData.append("agree", data.agree ? "1" : "0");
    formData.append("document", document);
    formData.append("descriptionOfCargo", descriptionOfCargo);
    formData.append("isFinalHeft", String(isFinalHeft))
    formData.append("isFinalOnlyHeft", String(isFinalOnlyHeft))
    formData.append("isFinalOnlyVolume", String(isFinalOnlyVolume))
    formData.append("price", String(price === 0 ? 0 : price))
    formData.append("count", String(count))
    formData.append("nds", String(price === 0 ? 0 : nds));
    formData.append("fs", String(fs));
    formData.append("fsRF", String(fsRF));
    formData.append("koefficient", String(koefficient));
    formData.append("fromCountryObj", JSON.stringify(fromCountryObj))
    formData.append("fromCityObj", JSON.stringify(fromCityObj))
    formData.append("whereCountryObj", JSON.stringify(whereCountryObj))
    formData.append("whereCityObj", JSON.stringify(whereCityObj))
    formData.append("from", from)
    formData.append("where", where)
    formData.append("indexFrom", indexFrom)
    formData.append("indexWhere", indexWhere)
    formData.append("client", client)
    formData.append("showInvois", showInvois ? "1" : "0")
    formData.append("places", JSON.stringify(places))
    invoiceFiles.forEach((el: {
      id: number;
      file: File | null;
    }) => {
      if (el.file) {
        formData.append(`files[${el.id}]`, el.file as File);
      }
    });


    const response = await fetch("/api/send-calculate", {
      method: "POST", body: formData,
    });
    if (!response.ok) {
      throw new Error("Ошибка отправки")

    } else {
      const res = await response.json();
      alertNotification({
        titleAlert: `Заявка на экспресс доставку отправлена (№ ${res.orderNumbers.orderId})`,
        message: `С вами свяжется сотрудник компании после обработки вашего заказа с целью забора посылки`
      });
      setCode("")
      setTrueCode(false)
      setIsFiledCheck("noFailed")
      setLastCode(false)
      setTextReaponse("")
      setIsCode(false)

      setFrom("")
      setWhere("")
      setIndexFrom("")
      setIndexWhere("")
      setClient("sender")
      setValue("nameFrom", "");
      setValue("nameWhere", "");
      setValue("phoneFrom", "");
      setValue("phoneWhere", "");
      setValue("emailFrom", "");
      setValue("emailWhere", "");
      setValue("adressFrom", from)
      setValue("adressWhere", where);
      onClose()//при отправке обнуление очистить поля формы и закрыть ее
    }
  };


  return (
    <DownloadFile invoiceFiles= { invoiceFiles }
  setInvoiceFiles = { setInvoiceFiles }
  showInvois = { showInvois }
  setShowInvois = { setShowInvois } />
  )
}