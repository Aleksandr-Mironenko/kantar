"use client";
import styles from "./CalkSend.module.scss";
import { useState, useEffect } from "react"
import { rfBigDoc, RfBigDocKey, funcRfBigDoc, excess70RF, Excess70RfKey, funcExcess70RF, RFRFKey, Excess70Key, Excess300Key, funcExcess70, funcExcess300, costIsHigher70, koefficient, coutriesZoneObject, citiesZoneObject, tableRFneRF, tableRFRF, funcTableRFneRF, funcTableRFRF, RFKey, smallDoc, bigDoc, funcSmallDoc, funcBigDoc, SmallDocKey, BigDocKey } from './data'


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
  const [fromCountry, setFromCountry] = useState("");
  const [fromCountryObj, setFromCountryObj] = useState<Country | null>(null);

  const [fromCity, setFromCity] = useState("");
  const [fromCityObj, setFromCityObj] = useState<City | null>(null);

  const [whereCountry, setWhereCountry] = useState("");
  const [whereCountryObj, setWhereCountryObj] = useState<Country | null>(null);

  const [whereCity, setWhereCity] = useState("");
  const [whereCityObj, setWhereCityObj] = useState<City | null>(null);

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
  const [price, setPrice] = useState(0);

  const [document, setDocument] = useState<"document" | "goods">("document");

  const updatePlace = (id: number, field: keyof Place, value: string | number) => {
    setPlaces(prev => prev.map(p => {
      if (p.id !== id) return p;

      const updated = { ...p, [field]: Number(value) };

      // Автоматически пересчитываем объёмный вес
      const vol = (updated.length * updated.width * updated.height) / 5000;
      updated.volume = vol >= 0.2 ? Math.ceil(vol * 100) / 100 : 0;

      return updated;
    }));
  };


  function getVolume(p: Place): number | undefined {//расчет объемного веса и запись в состояние места
    if (p.heft && p.places && p.length && p.width && p.height) {
      const res = Math.ceil(((p.length * p.width * p.height) / 5000) * 100) / 100
      const volume = res >= 0.2 ? res : 0
      // updatePlace(p.id, "volume", volume)
      return volume;
    }
  }


  console.log(document, 79)

  const selectFromCountry = (e: React.ChangeEvent<HTMLInputElement>) => {//поиск страны отправления в списке
    const value = e.target.value
    setFromCountry(value);
    console.log(value, 312)
    const found = coutriesZoneObject.find(el => el.name === value) || null
    console.log("Выбранная страна - от:", found, 314);

    // const arrCountries = coutriesZoneObject.map(el => el.name)

    // console.log(arrCountries, 96)
    // const zn = e.target.value.trim()
    // console.log(arrCountries.includes(zn) && zn !== "Россия", 97)

    // if (arrCountries.includes(zn) && zn !== "Россия") {
    //   found = { name: 'Россия', zone: 1, id: 0 }
    //   setWhereCountryObj(found)
    // }
    // if (arrCountries.includes(whereCountry) && fromCountry !== "Россия") {
    //   found = { name: 'Россия', zone: 1, id: 0 }
    // }


    setFromCountryObj(found)
  };

  const selectFromCity = (e: React.ChangeEvent<HTMLInputElement>) => {//поиск города отправления в списке
    const value = e.target.value
    setFromCity(value)
    console.log(value, 321)
    const found = citiesZoneObject.find(el => el.name === value) || null
    console.log("Выбранный город - от:", found, 323);

    setFromCityObj(found)
  }

  const selectWhereCountry = (e: React.ChangeEvent<HTMLInputElement>) => {//поиск страны назначения в списке
    const value = e.target.value
    setWhereCountry(value);
    console.log(value, 330)
    const found = coutriesZoneObject.find(el => el.name === value) || null
    console.log("Выбранная страна - до:", found, 332);

    // const arrCountries = coutriesZoneObject.map(el => el.name)


    // fromCountry, whereCountry

    // if (arrCountries.includes(e.target.value) && e.target.value !== "Россия") {
    //   found = { name: 'Россия', zone: 1, id: 0 }
    //   setFromCountryObj(found)
    // }

    // if (arrCountries.includes(fromCountry) && fromCountry !== "Россия") {
    //   found = { name: 'Россия', zone: 1, id: 0 }
    // }

    setWhereCountryObj(found)
  };

  const selectWhereCity = (e: React.ChangeEvent<HTMLInputElement>) => {//поиск города назначения в списке
    const value = e.target.value
    setWhereCity(value)
    console.log(value, 339)
    const found = citiesZoneObject.find(el => el.name === value) || null
    console.log("Выбранный город - до:", found, 341);

    setWhereCityObj(found)
  }
  const listCountries = (//отображение списка стран
    <datalist id="countries">
      {coutriesZoneObject.map(c => (
        <option key={c.id} value={c.name} />
      ))}
    </datalist>
  );

  const listCities = (//отображение списка городов
    <datalist id="cities">
      {citiesZoneObject.map(c => (
        <option key={c.id} value={c.name} />
      ))}
    </datalist>
  );

  const delPlace = (id: number) => {//удаление строки характеристик отправления
    const indexUpdate = places.findIndex(place => place.id === id)
    setPlaces(prev => [
      ...prev.slice(0, indexUpdate), ...prev.slice(indexUpdate + 1)
    ]);
  };


  const addPlace = () => {//добаление строки характеристик отправления
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



  const mapPlaces = places.map((place) => ( //поля ввода характеристик отправления из массива places
    <div key={place.id} className={styles.calculator__grid}>
      <div className={styles.field__block}>
        <div className={styles.field}>
          <label htmlFor="heft" className={styles.field__label}>Вес места, кг</label>
          <input
            id="heft"
            name="heft"
            type="number"
            min="0.5"
            step="0.1"
            className={styles.field__input}
            placeholder="Ввести"
            value={place.heft}
            onChange={e => updatePlace(place.id, "heft", e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="places" className={styles.field__label}>Мест</label>
          <input
            id="places"
            name="places"
            type="number"
            min="1"
            step="1"
            onChange={e => updatePlace(place.id, "places", e.target.value)}
            value={place.places}
            className={styles.field__input}
            placeholder="Ввести" />
        </div>
      </div>
      <div className={styles.fields}>
        <div className={styles.field}>
          <div className={styles.field__label}>Габариты ДxШxВ, см</div>
          <div className={styles.field__group}>
            <div className={styles.field__labels}>
              <label htmlFor="length"> Длина</label>
              <input type="number"
                id="length"
                name="length"
                min="1"
                step="1"
                className={styles.field__input}
                placeholder="Длина"
                value={place.length}
                onChange={e => updatePlace(place.id, "length", e.target.value)}
              />
            </div>
            <div className={styles.field__labels}>
              <label htmlFor="width"> Ширина</label>
              <input
                id="width"
                name="width"
                type="number"
                min="1"
                step="1"
                className={styles.field__input}
                placeholder="Ширина"
                value={place.width}
                onChange={e => updatePlace(place.id, "width", e.target.value)}

              /></div>
            <div className={styles.field__labels}>
              <label htmlFor="height"> Высота</label>
              <input
                id="height"
                name="height"
                type="number"
                min="1"
                step="1"
                className={styles.field__input}
                value={place.height}
                onChange={e => updatePlace(place.id, "height", e.target.value)}
                placeholder="Высота"
              />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="volume" className={styles.field__label}>Об. вес места, кг</label>
          <input
            id="volume"
            name="volume"
            type="number"
            min="0.2"
            step="0.01"
            value={place.volume}
            onChange={e => updatePlace(place.id, "volume", e.target.value)}
            style={{ backgroundColor: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}
            className={styles.field__input}
            readOnly />

        </div>


      </div>


      {places.length > 1 && <button onClick={() => delPlace(place.id)}
        className={styles.field__input_del}
      >удаление</button>}
    </div >
  ))




  useEffect(() => {
    const from = fromCountry?.trim().toLowerCase() || "";
    const where = whereCountry?.trim().toLowerCase() || "";
    let rf
    if (!fromCountry || !whereCountry || !fromCountryObj || !whereCountryObj) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrice(0);
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
    // Россия → Россия — пока 0
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

    if (rf) {
      // Считаем общую цену напрямую по всем местам
      places.forEach(el => {
        const heft = el.heft > el.volume ? el.heft : el.volume;//выбираем больший вес - фактический или объемный
        const totalWeight = heft * el.places;
        let calcWeight = totalWeight;

        // Округление вверх до 0.5 кг
        if (totalWeight % 0.5 !== 0) {
          calcWeight = totalWeight + (0.5 - (totalWeight % 0.5));
        }

        let price = 0;

        if (document === "document" && totalWeight <= 2) {
          const key = `${result}-${calcWeight}`;
          if (key in smallDoc) {
            price = koefficient * funcSmallDoc(key as SmallDocKey);
          }
        } else {
          let excessPerKg = 0;
          let excessWeight = 0;

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
            price = koefficient * (base + Math.ceil(excessWeight) * excessPerKg);
          }
        }

        totalPrice += price;
      });
    }
    else {
      places.forEach(el => {
        const heft = el.heft > el.volume ? el.heft : el.volume;//выбираем больший вес - фактический или объемный
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
          price = koefficient * (base + Math.ceil(excessWeight) * excessPerKg);
        }
        // }

        totalPrice += price;
      });
    }

    setPrice(totalPrice);

  }, [
    fromCountry,
    whereCountry,
    fromCityObj,
    whereCityObj,
    fromCountryObj,
    whereCountryObj,
    document,
    places,        // Теперь можно! Потому что мы НЕ вызываем setPlaces → нет цикла
    koefficient
  ]);

  useEffect(() => {
    if (!fromCountryObj) return;

    const name = fromCountryObj.name;
    const arrCountries = coutriesZoneObject.map(el => el.name);

    if (arrCountries.includes(name) && name !== "Россия") {
      setWhereCountry("Россия");
      setWhereCountryObj({ name: "Россия", zone: 1, id: 0 });
    }

  }, [fromCountryObj]);



  useEffect(() => {
    if (!whereCountryObj) return;

    const name = whereCountryObj.name;
    const arrCountries = coutriesZoneObject.map(el => el.name);

    if (arrCountries.includes(name) && name !== "Россия") {
      setFromCountry("Россия");
      setFromCountryObj({ name: "Россия", zone: 1, id: 0 });
    }

  }, [whereCountryObj]);

  const nds = (fromCountryObj && fromCountryObj.name === "Россия" && whereCountryObj && whereCountryObj.name === "Россия") ? price * 0.2 : 0;
  const fullPrice = (fromCountryObj && fromCountryObj.name === "Россия" && whereCountryObj && whereCountryObj.name === "Россия") ? price * 1.2 : price;

  // fromCountryObj whereCountryObj


  return (
    <div className={styles.calculator}>
      {/* Контейнер */}
      <div className={styles.calculator__left}>
        {/* Заголовок */}
        <div className={styles.calculator__title}>Рассчитать стоимость доставки</div>


        {/* Блок "Откуда" */}
        <div className={styles.calculator__row}>
          <div className={styles.field}>
            <div className={styles.field__label}>Откуда</div>

            <input
              className={styles.field__select}
              list="countries"
              placeholder="Выберите или введите страну"
              onChange={selectFromCountry}
              value={fromCountry}
            />


            {listCountries}


            {fromCountry === "Россия" && <>
              <input
                className={styles.field__select}
                list="cities"
                placeholder="Выберите или введите страну"
                onChange={selectFromCity}
                value={fromCity}//from where to where
              />


              {listCities}

            </>}
          </div>
        </div>

        {/* Стрелка */}
        <div className={styles.calculator__arrow}>→</div>

        {/* Блок "Куда" */}
        <div className={styles.calculator__row}>
          <div className={styles.field}>
            <div className={styles.field__label}>Куда</div>
            <input
              className={styles.field__select}
              list="countries"
              placeholder="Выберите или введите страну"
              onChange={selectWhereCountry}
              value={whereCountry}
            />
            {listCountries}

            {whereCountry === "Россия" && <>
              <input
                className={styles.field__select}
                list="cities"
                placeholder="Выберите или введите страну"
                onChange={selectWhereCity}
                value={whereCity}
              />
              {listCities}
            </>
            }

          </div>
        </div>

        {/* Документы / Груз */}
        <div className={styles.calculator__radioGroup}>
          <label className={styles.radio}>
            <input
              type="radio"
              name="type"
              value="document"
              checked={document === "document"}
              onChange={(e) => setDocument(e.target.value as "document")}
              defaultChecked /> Документы
          </label>

          <label className={styles.radio}>
            <input
              type="radio"
              name="type"
              value="goods"
              checked={document === "goods"}
              onChange={(e) => setDocument(e.target.value as "goods")}
            /> Груз
          </label>

        </div>
        {mapPlaces}

        <button onClick={addPlace} className={styles.calculator__add}>+ Добавить</button>

        {/* Подвал */}
        <div className={styles.calculator__note}>
          Транзитное время является ориентировочным. Фактическое время может отличаться.
        </div>
      </div >

      {/* Правая колонка */}
      < div className={styles.calculator__right} >
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
            Или оставьте заявку по номеру: <a href="tel:+79101056423">+7 910 105 64 23</a>
          </div>
        </div>
      </div >
    </div >
  );
}
