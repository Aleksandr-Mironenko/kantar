"use server";

import { DataCreateAddress, DataCreateOrderProcess, DataCreateUser } from "../../../../components/DTO/DTO";


export default async function fabric(data: DataCreateOrderProcess) {


  //деструктуризация для общего доступа
  const {
    costOfCargo,
    nameOrganizer,
    phoneOrganizer,
    emailOrganizer,
    agree,
    client,
    phoneFrom,
    phoneWhere,
    emailFrom,
    emailWhere,
    fileArray,
    isFinalHeft,
    isFinalOnlyHeft,
    isFinalOnlyVolume,
    price,
    count,
    fromCountryObj,
    whereCountryObj,
    fromCityObj,
    whereCityObj,
    showInvois,
    nameFrom,
    nameWhere,
    adressFrom,
    adressWhere,
    document,
    from,
    where,
    indexFrom,
    indexWhere,
    places,
    nds,
    fs,
    fsRF,
    koefficient,
    descriptionOfCargo
  } = data
  console.log(price, 40)
  const isInternal =
    (fromCountryObj.name === "Россия" &&
      whereCountryObj.name === "Россия") ? true : false

  //константа только для валидации
  const validateData: DataCreateOrderProcess = {
    costOfCargo,
    nameOrganizer,
    phoneOrganizer,
    emailOrganizer,
    agree,
    client,
    phoneFrom,
    phoneWhere,
    emailFrom: emailFrom.toLowerCase(),
    emailWhere: emailWhere.toLowerCase(),
    fileArray,
    isFinalHeft,
    isFinalOnlyHeft,
    isFinalOnlyVolume,
    price,
    count,
    fromCountryObj,
    whereCountryObj,
    fromCityObj,
    whereCityObj,
    showInvois,
    nameFrom,
    nameWhere,
    adressFrom,
    adressWhere,
    document,
    from,
    where,
    indexFrom,
    indexWhere,
    places,
    nds,
    fs,
    fsRF,
    koefficient,
    descriptionOfCargo
  }

  //формируем объект полного адреса отправления
  const orderAdressFrom: DataCreateAddress = {
    fullAddress: from,
    countryName: fromCountryObj.name,
    countryZone: fromCountryObj.zone,
    countryId: fromCountryObj.id,
    cityName: fromCityObj?.name,
    cityZone: fromCityObj?.zone,
    cityIdRF: fromCityObj?.numberZoneRF,
    cityIdForeign: fromCityObj?.numberZoneForeign,
    cityZoneId: fromCityObj?.id,
    index: indexFrom
  }
  //формируем объект полного адреса получения
  const orderAdressWhere: DataCreateAddress = {
    fullAddress: where,
    countryName: whereCountryObj.name,
    countryZone: whereCountryObj.zone,
    countryId: whereCountryObj.id,
    cityName: whereCityObj?.name,
    cityZone: whereCityObj?.zone,
    cityIdRF: whereCityObj?.numberZoneRF,
    cityIdForeign: whereCityObj?.numberZoneForeign,
    cityZoneId: whereCityObj?.id,
    index: indexWhere
  }

  const orderAdressOrganizer: DataCreateAddress = {
    fullAddress: "",
    countryName: " ",
    countryZone: 0,
    countryId: 0,
    cityName: "",
    cityZone: "",
    cityIdRF: 0,
    cityIdForeign: 0,
    cityZoneId: 0,
    index: ""
  }

  //определяем кто создатель заказа  
  // const orderCreator = client === "sender" ? allFrom : client === "recipient" ? allWhere : client === "organizer" ? allOrganizer : allOrganizer

  //определяем кто не создатель заказа  

  // const noOrderCreator =
  //   client === "recipient"
  //     ? allFrom
  //     : client === "sender"
  //       ? allWhere
  //       : client === "organizer"
  //         ? allWhere
  //         : allOrganizer

  // const noOrderCreator2 =
  //   client === "recipient"
  //     ? allFrom
  //     : client === "sender"
  //       ? allWhere
  //       : client === "organizer"
  //         ? allFrom
  //         : allOrganizer



  const correctFio = (stringFio: string): string => {
    const arrFio = stringFio.trim().split(/\s+/)
    let res = ''
    arrFio.forEach((el, index) => res += `${index > 0 ? " " : ""}${el[0].toUpperCase()}${el.slice(1).toLowerCase()}`)
    return res
  }
  let getOrCreateUserORGData: DataCreateUser = {
    email: '',
    phone: '',
    name: '',
    isClient: false,
    typeAcc: 'noAcc',
    discount: 0,
  }

  // проверяю пользователей на наличие в бд, добавляю если нет и получаю id пользователя
  getOrCreateUserORGData = {
    email: emailOrganizer?.toLowerCase() || null,
    phone: phoneOrganizer || null,
    name: nameOrganizer && nameOrganizer !== " " ? correctFio(nameOrganizer) : "Имя организатора",
    isClient: client === 'organizer',
    typeAcc: "noAcc" as const,
    discount: 0,
  }

  // проверяю пользователей на наличие в бд, добавляю если нет и получаю id пользователя
  const getOrCreateUserFromData: DataCreateUser = {
    email: emailFrom.toLowerCase(),
    phone: phoneFrom,
    name: nameFrom && nameFrom !== " " ? correctFio(nameFrom) : "Имя получателя",
    isClient: client === 'sender',
    typeAcc: "noAcc" as const,
    discount: 0,
  }

  // проверяю пользователей на наличие в бд, добавляю если нет и получаю id пользователя
  const getOrCreateUserWhereData: DataCreateUser = {
    email: emailWhere.toLowerCase(),
    phone: phoneWhere,
    name: nameWhere && nameWhere !== " " ? correctFio(nameWhere) : "Имя получателя",
    isClient: client === 'recipient' ? true : false,
    typeAcc: "noAcc" as const,
    discount: 0,
  }


  return {
    costOfCargo,
    client,
    places,
    fileArray,
    validateData,
    orderAdressFrom,//упростить
    orderAdressWhere,  //упростить
    orderAdressOrganizer,//нужно для проверки если адреса будет - он не перетрется новым пустым значением а если не будет - создастся

    // noOrderCreator2,
    getOrCreateUserFromData,
    getOrCreateUserORGData,
    getOrCreateUserWhereData,
    isInternal,
    nds,
    document,
    nameOrganizer,
    phoneOrganizer,
    emailOrganizer,
    descriptionOfCargo
  }
}