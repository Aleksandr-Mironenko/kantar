import { useState } from "react"
import styles from "./ButtonSendCode.module.scss"

export default function ButtonSendCode({ phone, email, check, trueCode, isFiledCheck, setTrueCode, setIsFiledCheck, setCheck }: { phone: string | undefined, email: string, check: boolean, trueCode: boolean, isFiledCheck: 'error' | 'noFailed' | 'filledTime' | 'filledCode', setTrueCode: (check: boolean) => void, setCheck: (check: boolean) => void, setIsFiledCheck: (check: 'error' | 'noFailed' | 'filledTime' | 'filledCode') => void }) {

  const [lastCode, setLastCode] = useState<boolean>(false)
  const [isCode, setIsCode] = useState<boolean>(false) //флаг подтверждения
  const [code, setCode] = useState<string>("") //код подтверждения
  const [textReaponse, setTextReaponse] = useState<string>("")


  const sendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault()
    const request = await fetch("/api/auth/send-code", {
      method: "POST", body: JSON.stringify({ phone, email, fromDatabase: "auth_codes_login" }),
    });
    const responseData = await request.json();

    if (!responseData.sendCode) {
      console.log("Ошибка отправки кода подтверждения")
      throw new Error("Ошибка отправки кода подтверждения")
    } else if (responseData.sendCode) {
      setLastCode(responseData.lastCode)
      setIsCode(true);
    }
  };

  const checkodeSubmit = async (e: React.FormEvent) => {

    e.preventDefault()
    const request = await fetch("/api/auth/check-code", {
      method: "POST", body: JSON.stringify({ code, phone, email, fromDatabase: "auth_codes_login" }),
    });
    const responseData = await request.json();

    if (responseData.checkCode === undefined) {
      setTrueCode(false);
      setIsFiledCheck('error');
      throw new Error("Ошибка при проверке кода")
    } else if ((responseData.checkCode === false && responseData.timer === false)
      || (responseData.checkCode === true && responseData.timer === false)) {
      setIsFiledCheck('filledTime');
      setTextReaponse(`Срок действия кода истек. 
      Пожалуйста, запросите новый код.`)
    } else if (responseData.checkCode === false && responseData.timer === true) {
      setIsFiledCheck('filledCode');
      setTextReaponse(`Неверный код, попробуйте снова`)
    }
    else {
      setIsFiledCheck('noFailed');
      setTrueCode(true);
      setTextReaponse("Код принят, продолжите оформления заказа.")
      setCheck(true);
    }
  }


  const onChangeCode = (value: string): void => {

    if (/^\d{0,4}$/.test(value)) { // разрешаем ввод только до 4 цифр 
      setCode(value);
    }
  }
  return (
    !check && !trueCode && <>
      {isCode ?
        <div className={styles.label__wrapper}  >
          {lastCode ?
            <p>{`Проверьте почту, повторная отправка через 10минут`}</p> : null}


          <label htmlFor="code" className={`${styles.index} ${styles.label}`}>
            Введите код подтверждения
            <input
              type="text"
              autoComplete="off"
              name="code"
              id="code"
              placeholder="****"
              value={code ?? ""}
              onChange={e => onChangeCode(e.target.value)}
              className={styles.input}
            />
          </label>
          <button
            type="button"
            className={styles.modal__submit}
            onClick={(e) => checkodeSubmit(e)} >
            отправить код подтверждения
          </button>



        </div> :
        <button type="button"
          className={styles.modal__submit}
          onClick={(e) => sendVerificationCode(e)} >
          отправить код подтверждения
        </button>}



      <p>{textReaponse}</p>
      {isFiledCheck === 'filledTime' && <button type="button" className={styles.modal__submit} onClick={(e) => sendVerificationCode(e)}>повторный запрос кода</button>}
    </>
    //handleSubmit(onSubmit

  )
}
