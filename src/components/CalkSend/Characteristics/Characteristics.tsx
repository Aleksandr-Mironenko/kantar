import { useState } from "react"
import styles from "./Characteristics.module.scss";

const Characteristics = () => {

  heft, length, width, height, places

  const [heft, setHeft] = useState(0)
  const [length, setLength] = useState(0)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [places, setPlaces] = useState(0)

  return (<>
    <div className={styles.calculator__grid}>
      <div className={styles.field}>
        <div className={styles.field__label}>Вес места, кг</div>
        <input
          type="number"
          min="0"
          step="0.01"
          onChange={e => setHeft(Number(e.target.value))}
          value={heft}
          className={styles.field__input}
          placeholder="Ввести" />
      </div>



      <div className={styles.field}>
        <div className={styles.field__label}>Габариты ДxШxВ, см</div>
        <div className={styles.field__group}>
          <input
            type="number"
            min="0"
            step="0.01"
            onChange={e => setLength(Number(e.target.value))}
            value={`${length}см`}
            className={styles.field__input}
            placeholder="д" />

          <input
            type="number"
            min="0"
            step="0.01"
            onChange={e => setWidth(Number(e.target.value))}
            value={width}
            className={styles.field__input}
            placeholder="ш" />

          <input
            type="number"
            min="0"
            step="0.01"
            onChange={e => setHeight(Number(e.target.value))}
            value={height}
            className={styles.field__input}
            placeholder="в" />
        </div>
      </div>



      <div className={styles.field}>
        <div className={styles.field__label}>Об. вес места, кг</div>
        <input
          type="number"
          min="0"
          step="0.01"
          value={length * width * width || 0}
          className={styles.field__input}
          readOnly />
      </div>



      <div className={styles.field}>
        <div className={styles.field__label}>Мест</div>
        <input
          type="number"
          min="0"
          step="1"
          onChange={e => setPlaces(Number(e.target.value))}
          value={places}
          className={styles.field__input}
          placeholder="Ввести" />
      </div>
    </div >
  </>)
}
export default Characteristics