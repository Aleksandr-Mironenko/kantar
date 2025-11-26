"use client";
import styles from "./CalkSend.module.scss";
import { useState, useEffect } from "react"
import { fs, fsRF, rfBigDoc, RfBigDocKey, funcRfBigDoc, excess70RF, Excess70RfKey, funcExcess70RF, RFRFKey, Excess70Key, Excess300Key, funcExcess70, funcExcess300, costIsHigher70, koefficient, coutriesZoneObject, citiesZoneObject, tableRFneRF, tableRFRF, funcTableRFneRF, funcTableRFRF, RFKey, smallDoc, bigDoc, funcSmallDoc, funcBigDoc, SmallDocKey, BigDocKey } from './data'


interface Place {
  heft: number;
  length: number;
  width: number;
  height: number;
  places: number;
  id: number;
  price: number;
  volume: number
}

interface Country {
  id: number;
  name: string;
  zone: number;
}

interface City {
  id: number;
  name: string;
  zone: string;
  numberZoneRF: number;
  numberZoneForeign: number
}

export default function CalkSend() {
  const [fromCountryObj, setFromCountryObj] = useState<Country | null>(null);
  const [fromCityObj, setFromCityObj] = useState<City | null>(null);
  const [whereCountryObj, setWhereCountryObj] = useState<Country | null>(null);
  const [whereCityObj, setWhereCityObj] = useState<City | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [document, setDocument] = useState<"document" | "goods">("document");

  const [places, setPlaces] = useState<Place[]>([
    {
      heft: 0.5,
      length: 10,
      width: 10,
      height: 10,
      places: 1,
      id: 0,
      price: 0,
      volume: 0
    },
  ]);


  const updatePlace = (id: number, field: keyof Place, value: string | number) => {
    setPlaces(prev => prev.map(p => {
      if (p.id !== id) return p;

      const updated = { ...p, [field]: Number(value) };

      // Автоматически пересчитываем объёмный вес
      const vol = (updated.length * updated.width * updated.height) / 5000;
      updated.volume = vol >= 0.2 ? Math.ceil(vol * 100) / 100 : 0.2;

      return updated;
    }));
  };

  //поиск страны отправления в списке
  const selectFromCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log(value, 312)
    const found = coutriesZoneObject.find(el => el.name === value) || null
    console.log("Выбранная страна - от:", found, 314);
    setFromCountryObj(found)
  };

  //поиск города отправления в списке
  const selectFromCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log(value, 321)
    const found = citiesZoneObject.find(el => el.name === value) || null
    console.log("Выбранный город - от:", found, 323);
    setFromCityObj(found)
  }

  //поиск страны назначения в списке
  const selectWhereCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log(value, 330)
    const found = coutriesZoneObject.find(el => el.name === value) || null
    console.log("Выбранная страна - до:", found, 332);
    setWhereCountryObj(found)
  };

  //поиск города назначения в списке
  const selectWhereCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log(value, 339)
    const found = citiesZoneObject.find(el => el.name === value) || null
    console.log("Выбранный город - до:", found, 341);
    setWhereCityObj(found)
  }

  //отображение списка стран
  const listCountries = (
    <datalist id="countries">
      {coutriesZoneObject.map(c => (
        <option key={c.id} value={c.name} />
      ))}
    </datalist>
  );

  //отображение списка городов
  const listCities = (
    <datalist id="cities">
      {citiesZoneObject.map(c => (
        <option key={c.id} value={c.name} />
      ))}
    </datalist>
  );

  //удаление строки характеристик отправления
  const delPlace = (id: number) => {
    const indexUpdate = places.findIndex(place => place.id === id)
    setPlaces(prev => [
      ...prev.slice(0, indexUpdate), ...prev.slice(indexUpdate + 1)
    ]);
  };

  //добаление строки характеристик отправления
  const addPlace = () => {
    setPlaces(prev => [
      ...prev,
      {
        heft: 0.5,
        length: 10,
        width: 10,
        height: 10,
        places: 1,
        price: 0,
        volume: 0,
        id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 0
      }
    ]);
  };

  //изменение значений полей характеристик отправления по кнопкам +/-
  const handleChange = (place: Place, e: React.MouseEvent<HTMLButtonElement>, action: string,) => {
    const parentElement = e.currentTarget.parentElement;
    const grandParentElement = parentElement?.parentElement;
    const input = grandParentElement?.querySelector("input");
    const name = input?.name;
    const value = input?.value;
    const step = input?.step;
    const min = input?.min;

    if (name && value) {
      if (action === "minus" && Number(value) - Number(step) >= Number(min)) {
        updatePlace(place.id, name as keyof Place, Number(value) - Number(step));
        return;
      }
      if (action === "plus") {
        updatePlace(place.id, name as keyof Place, Number(value) + Number(step));
        return;
      }
    }
  };

  //поля ввода характеристик отправления из массива places
  const mapPlaces = places.map((place, index) => (
    <div key={place.id} className={styles.place}>
      <div className={styles.place__card}>
        <div className={styles.place__header}>
          <div className={styles.place__titleRow}>
            <h2 className={styles.place__title}>Габариты отправления</h2>
            <div className={styles.volumeField}>
              <label htmlFor="volume" className={styles.volumeField__label}>Об. вес</label>
              <div className={styles.volumeField__wrapper}>
                <input
                  id="volume"
                  name="volume"
                  type="number"
                  min="0.2"
                  step="0.01"
                  value={place.volume}
                  onChange={e => updatePlace(place.id, "volume", e.target.value)}
                  style={{ backgroundColor: "transparent" }}
                  className={styles.volumeField__input}
                  readOnly />
                <p>кг</p>
              </div>
            </div>
          </div>
          <div className={styles.place__fields}>
            <div className={styles.place__field}>
              <label className={styles.place__label} htmlFor="length"> Длина</label>
              <div className={styles.place__inputGroup}>
                <div className={styles.place__controls}>
                  <button
                    type="button"
                    className={styles.place__btn}
                    onClick={(e) => handleChange(place, e, "plus")}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className={styles.place__btn}
                    onClick={(e) => handleChange(place, e, "minus")}
                  >
                    ▼
                  </button>
                </div>
                <input type="number"
                  id="length"
                  name="length"
                  min="1"
                  step="1"
                  className={styles.place__input}
                  placeholder="Длина"
                  value={place.length}
                  onChange={e => updatePlace(place.id, "length", e.target.value)}
                />
                <p>см</p>
              </div>
            </div>
            <div className={styles.place__field}>
              <label className={styles.place__label} htmlFor="width"> Ширина</label>
              <div className={styles.place__inputGroup}>
                <div className={styles.place__controls}>
                  <button
                    type="button"
                    className={styles.place__btn}
                    onClick={(e) => handleChange(place, e, "plus")}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className={styles.place__btn}
                    onClick={(e) => handleChange(place, e, "minus")}
                  >
                    ▼
                  </button>
                </div>
                <input
                  id="width"
                  name="width"
                  type="number"
                  min="1"
                  step="1"
                  className={styles.place__input}
                  placeholder="Ширина"
                  value={place.width}
                  onChange={e => updatePlace(place.id, "width", e.target.value)}
                />
                <p>см</p>
              </div>
            </div>
            <div className={styles.place__field}>
              <label className={styles.place__label} htmlFor="height"> Высота</label>
              <div className={styles.place__inputGroup}>
                <div className={styles.place__controls}>
                  <button
                    type="button"
                    className={styles.place__btn}
                    onClick={(e) => handleChange(place, e, "plus")}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className={styles.place__btn}
                    onClick={(e) => handleChange(place, e, "minus")}
                  >
                    ▼
                  </button>
                </div>
                <input
                  id="height"
                  name="height"
                  type="number"
                  min="1"
                  step="1"
                  className={styles.place__input}
                  value={place.height}
                  onChange={e => updatePlace(place.id, "height", e.target.value)}
                  placeholder="Высота"
                />
                <p>см</p>
              </div>
            </div>
            <div className={styles.place__field}>
              <label htmlFor="heft" className={styles.place__label}>Вес 1 шт. </label>
              <div className={styles.place__inputGroup}>
                <div className={styles.place__controls}>
                  <button
                    type="button"
                    className={styles.place__btn}
                    onClick={(e) => handleChange(place, e, "plus")}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className={styles.place__btn}
                    onClick={(e) => handleChange(place, e, "minus")}
                  >
                    ▼
                  </button>
                </div>
                <input
                  id="heft"
                  name="heft"
                  type="number"
                  min="0.5"
                  step="0.1"
                  className={styles.place__input}
                  placeholder="Ввести"
                  value={place.heft}
                  onChange={e => updatePlace(place.id, "heft", e.target.value)}
                />
                <p>кг</p>
              </div>
            </div>
            <div className={styles.place__field}>
              <label htmlFor="places" className={styles.place__label}>Мест</label>
              <div className={styles.place__inputGroup}>
                <div className={styles.place__controls}>
                  <button
                    type="button"
                    className={styles.place__btn}
                    onClick={(e) => handleChange(place, e, "plus")}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className={styles.place__btn}
                    onClick={(e) => handleChange(place, e, "minus")}
                  >
                    ▼
                  </button>
                </div>
                <input
                  id="places"
                  name="places"
                  type="number"
                  min="1"
                  step="1"
                  onChange={e => updatePlace(place.id, "places", e.target.value)}
                  value={place.places}
                  className={styles.place__input}
                  placeholder="Ввести" />
                <p>шт</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        places.length > 1 &&
        <button
          onClick={() => delPlace(place.id)}
          className={styles.place__delete}
        > x
        </button>
      }
      {
        places.length - 1 === index &&
        < button onClick={addPlace} className={styles.calculator__addButton}
        > + </button>}
    </div >
  ))

  // определение стоимости мест, в зависимости от страны и города отправления и назначения
  useEffect(() => {
    const from = fromCountryObj?.name?.trim().toLowerCase() || "";
    const where = whereCountryObj?.name?.trim().toLowerCase() || "";
    let rf
    if (!fromCountryObj || !whereCountryObj) {
      setPrice(0); ///..найти
      return;
    }
    let result: string | undefined;

    // Россия → За границу
    if (from === "россия" && where !== "россия" && fromCityObj && whereCountryObj) {
      const key = `${fromCityObj.numberZoneForeign}-${whereCountryObj.zone}`;
      if (key in tableRFneRF) {
        result = funcTableRFneRF(key as RFKey)
      };
      rf = true
    }

    // За границу → Россия
    else if (from !== "россия" && where === "россия" && whereCityObj && fromCountryObj) {
      const key = `${whereCityObj.numberZoneForeign}-${fromCountryObj.zone}`;
      if (key in tableRFneRF) {
        result = funcTableRFneRF(key as RFKey)
      };
      rf = true
    }

    // Россия → Россия  
    else if (from === "россия" && where === "россия" && fromCityObj && whereCityObj) {
      const key = `${fromCityObj.numberZoneRF}-${whereCityObj.numberZoneRF}`;
      if (key in tableRFRF) {
        result = funcTableRFRF(key as RFRFKey)
        console.log(result, 317)
      };
      rf = false
    }

    if (!result) {
      setPrice(0);
      return;
    }
    let totalPrice = 0;
    // Считаем общую цену отправления по России напрямую по всем местам 
    if (rf) {
      places.forEach(el => {
        const heft = el.heft > el.volume ? el.heft : el.volume;

        //выбираем больший вес - фактический или объемный
        const totalWeight = heft * el.places;
        let calcWeight = totalWeight;

        // Округление вверх до 0.5 кг
        if (totalWeight % 0.5 !== 0) {
          calcWeight = totalWeight + (0.5 - (totalWeight % 0.5));
        }

        let price = 0;
        //малый вес и/или документы
        if (document === "document" && totalWeight <= 2) {
          const key = `${result}-${calcWeight}`;
          if (key in smallDoc) {
            price = koefficient * fsRF * funcSmallDoc(key as SmallDocKey);
          }
        } else {//большой вес и/или груз
          let excessPerKg = 0;
          let excessWeight = 0;

          //стоимость за кг сверх 70 кг
          if (totalWeight > 70) {
            excessPerKg = totalWeight <= 300
              ? funcExcess70(result as Excess70Key)
              : funcExcess300(result as Excess300Key) || 7000;
            excessWeight = totalWeight - 70;
            calcWeight = 70;
          }

          const key = `${result}-${calcWeight}`;
          if (key in bigDoc) {
            const base = funcBigDoc(key as BigDocKey);
            price = koefficient * fsRF * (base + Math.ceil(excessWeight) * excessPerKg);
          }
        }

        totalPrice += price;
      });
    }
    else {
      places.forEach(el => {
        //выбираем больший вес - фактический или объемный
        const heft = el.heft > el.volume ? el.heft : el.volume;
        const totalWeight = heft * el.places;
        let calcWeight = totalWeight;

        // Округление вверх до 0.5 кг
        if (totalWeight % 0.5 !== 0) {
          calcWeight = totalWeight + (0.5 - (totalWeight % 0.5));
        }

        let price = 0;
        let excessPerKg = 0;
        let excessWeight = 0;

        if (totalWeight > 70) {
          excessPerKg = funcExcess70RF(result as Excess70RfKey)
          excessWeight = totalWeight - 70;
          calcWeight = 70;
        }

        const key = `${result}-${calcWeight}`;
        console.log(key, 404)

        if (key in rfBigDoc) {
          const base = funcRfBigDoc(key as RfBigDocKey);
          price = koefficient * fs * (base + Math.ceil(excessWeight) * excessPerKg);
        }
        totalPrice += price;
      });
    }
    setPrice(totalPrice);
  }, [
    fromCityObj,
    whereCityObj,
    fromCountryObj,
    whereCountryObj,
    document,
    places,
    koefficient
  ]);

  //автоматическа подстановка города
  useEffect(() => {
    if (!fromCountryObj) return;
    const name = fromCountryObj.name;
    const arrCountries = coutriesZoneObject.map(el => el.name);
    if (arrCountries.includes(name) && name !== "Россия") {
      setWhereCountryObj({ name: "Россия", zone: 1, id: 0 });//..найти
    }
  }, [fromCountryObj]);

  //автоматическа подстановка города
  useEffect(() => {
    if (!whereCountryObj) return;
    const name = whereCountryObj.name;
    const arrCountries = coutriesZoneObject.map(el => el.name);
    if (arrCountries.includes(name) && name !== "Россия") {
      setFromCountryObj({ name: "Россия", zone: 1, id: 0 });//..найти
    }
  }, [whereCountryObj]);

  const nds = (fromCountryObj && fromCountryObj.name === "Россия" && whereCountryObj && whereCountryObj.name === "Россия") ? price * 0.2 : 0;
  const fullPrice = (fromCountryObj && fromCountryObj.name === "Россия" && whereCountryObj && whereCountryObj.name === "Россия") ? price * 1.2 : price;

  return (
    <div className={styles.calculator}>
      {/* Контейнер */}
      <div className={styles.calculator__left}>
        {/* Заголовок */}
        <h1 className={styles.calculator__title}>Расчет стоимости доставки</h1>
        <div className={styles.calculator__header}>
          {/* Блок "Откуда" */}
          <div className={styles.calculator__row}>
            <div className={styles.calculator__fieldRow}>
              <label htmlFor="fromCountry" className={styles.calculator__countryLabel}>Откуда</label>
              <input
                name="fromCountry"
                id="fromCountry"
                className={styles.calculator__select}
                list="countries"
                placeholder="Страна отправления"
                onChange={selectFromCountry}
                value={fromCountryObj?.name}
              />
              {listCountries}

              {fromCountryObj?.name === "Россия" && <>
                <input
                  className={styles.calculator__select}
                  list="cities"
                  placeholder="Город отправления"
                  onChange={selectFromCity}
                  value={fromCityObj?.name}
                />
                {listCities}
              </>}
            </div>
          </div>
          {/* Блок "Куда" */}
          <div className={styles.calculator__row}>
            <div className={styles.calculator__fieldRow}>
              <label htmlFor="whereCountry" className={styles.calculator__countryLabel}>Куда</label>
              <input
                name="whereCountry"
                id="whereCountry"
                className={styles.calculator__select}
                list="countries"
                placeholder="Страна получения"
                onChange={selectWhereCountry}
                value={whereCountryObj?.name}
              />
              {listCountries}
              {whereCountryObj?.name === "Россия" && <>
                <input
                  className={styles.calculator__select}
                  list="cities"
                  placeholder="Город получения"
                  onChange={selectWhereCity}
                  value={whereCityObj?.name}
                />
                {listCities}
              </>
              }
            </div>
          </div>
          {/* Документы / Груз */}
          <div className={styles.radioButton}>
            <label className={styles.radio}>
              <input
                className={styles.radioButtonChenge}
                type="radio"
                name="type"
                value="document"
                checked={document === "document"}
                onChange={(e) => setDocument(e.target.value as "document")}
                defaultChecked /> Документы
            </label>
            <label className={styles.radioButton}>
              <input
                className={styles.radioButtonChenge}
                type="radio"
                name="type"
                value="goods"
                checked={document === "goods"}
                onChange={(e) => setDocument(e.target.value as "goods")}
              /> Груз
            </label>
          </div>
        </div>
        {mapPlaces}
        {/* Подвал */}
        <div className={styles.calculator__note}>
          Транзитное время является ориентировочным. Фактическое время может отличаться.
        </div>
      </div >
      {/* Правая колонка */}
      < div className={styles.calculator__sidebar} >
        <div className={styles.total}>
          <div className={styles.total__title}>Итого:</div>
          <div className={styles.total__price}>{Math.ceil(fullPrice)} ₽</div>
          <div className={styles.total__details}>
            <div>НДС: {Math.ceil(nds)} ₽</div>
            <div>Цена: {Math.ceil(price)} ₽</div>
          </div>
          <div className={styles.total__time}>5-10 дней</div>
          <button className={styles.total__button}>Отправить заявку</button>
          <div className={styles.total__phone}>
            <p>Или оставьте заявку по номеру: </p>
            <a href="tel:+79101056423">+7 910 105 64 23</a>
          </div>
        </div>
      </div >
    </div >
  );
}
