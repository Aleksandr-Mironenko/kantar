
import DownloadButton from "../DownloadButton/DownloadButton";
import styles from "./DownloadFile.module.scss";
import { DownloadFileProps } from "../DTO/DTO"


export default function DownloadFile({
  invoiceFiles,
  setInvoiceFiles,
  showInvois,
  setShowInvois
}: DownloadFileProps) {

  const delInvoiceFiles = (id: number) => {
    const indexUpdate = invoiceFiles.findIndex(invoiceFile => invoiceFile.id === id)
    setInvoiceFiles((prev) => [
      ...prev.slice(0, indexUpdate), ...prev.slice((indexUpdate + 1))
    ]);
  };

  const addInvoiceFiles = () => {
    setInvoiceFiles(prev => [
      ...prev,
      {
        file: null,
        id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 0
      }
    ]);
  };

  const addFilesInInvoiceFiles = (file: File | null, id: number) => {
    setInvoiceFiles(prev => {
      const index = prev.findIndex(el => el.id === id);
      if (index === -1) return prev;
      const newArray = [...prev];
      newArray[index] = { ...newArray[index], file };
      return newArray;
    }
    );
  };

  const whatInFilesInInvoiceFiles = (id: number) => {
    const res = invoiceFiles.find(el => el.id === id)
    if (res) {
      return res.file
    }
  }

  const mapAddFile = invoiceFiles.map((el, index) => (
    <li key={el.id} className={styles.whoAmI__item} >
      <label htmlFor={`invoise_${el.id}`}
        className={styles.whoAmI__label} >
        <input
          type="file"
          id={`invoise_${el.id}`}
          autoComplete=""
          className={styles.whoAmI__input}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            e.stopPropagation()
            if (file) {
              addFilesInInvoiceFiles(file, el.id);

            }
          }}
        />
        < div className={styles.whoAmI__buttonСhoice} >
          Приложить файл
        </div>
      </label >
      {/* Имя файла — под кнопкой */}
      {
        whatInFilesInInvoiceFiles(el.id) && (() => {
          const file = whatInFilesInInvoiceFiles(el.id);
          if (file != null) {
            return (
              <div className={styles.whoAmI__fileName} >
                {file.name}
                < button onClick={(e) => {
                  e.stopPropagation()
                  addFilesInInvoiceFiles(null, el.id)
                }
                } >
                  ×
                </button>
              </div >)
          }
        })
          ()}

      {
        invoiceFiles.length - 1 === index && <button // добавляем возможность добавить файлы
          onClick={() => addInvoiceFiles()}
          className={styles.whoAmI__add} >
          +
        </button>
      }
      {
        invoiceFiles.length > 1 && (<button // добавляем возможность удалить файлы
          onClick={() => delInvoiceFiles(el.id)}
          className={styles.whoAmI__delete} >
          ⨯
        </button>)
      }
    </li >
  ))

  const invois = (<>
    <div className={styles.goods__invoise} >
      <div className={styles.goods__download}  >
        <DownloadButton
          filename="i.docx"
          fileUrl="/i.docx" >
          Скачайте бланк
        </DownloadButton>
      </div>
      < div className={styles.goods__loadBack} >
        <h4 className={styles.goods__loadBack_header}> Загрузите файлы </h4>
        < ol className={styles.whoAmI} >
          {mapAddFile}
        </ol>
      </div>
    </div>
  </>)

  const buttonShow = (
    <div className={styles.buttonShow__wrapper} >
      <button
        className={styles.buttonShow}
        onClick={(e) => {
          e.preventDefault()
          setShowInvois(!showInvois)
        }}>
        {showInvois ? "Скрыть документы" : "Добавить документы"}
      </button>
      {showInvois && invois}
    </div>
  )
  return (
    buttonShow
  )
}