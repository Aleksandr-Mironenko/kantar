"use server";

import { DataCreateAddress, DataCreateOrderProcess, DataCreateUser } from "../../../../components/DTO/DTO";


export default async function fabric(data: DataCreateOrderProcess) {


  //деструктуризация для общего доступа
  const { agree,
    client,
    phoneFrom,
    phoneWhere,
    emailFrom,
    emailWhere,
    fileArray,
    isFinalHeft,
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
    descriptionOfCargo } = data
  console.log(price, 40)
  const isInternal =
    (fromCountryObj.name === "Россия" &&
      whereCountryObj.name === "Россия") ? true : false

  //константа только для валидации
  const validateData: DataCreateOrderProcess = {
    agree,
    client,
    phoneFrom,
    phoneWhere,
    emailFrom: emailFrom.toLowerCase(),
    emailWhere: emailWhere.toLowerCase(),
    fileArray,
    isFinalHeft,
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
  const allFrom: DataCreateAddress = {
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
  const allWhere: DataCreateAddress = {
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

  //определяем кто создатель заказа  
  const orderCreator = client === "sender" ? allFrom : allWhere

  //определяем кто получатель заказа  
  const noOrderCreator = client !== "sender" ? allFrom : allWhere

  const correctFio = (stringFio: string): string => {
    const arrFio = stringFio.trim().split(/\s+/)
    let res = ''
    arrFio.forEach((el, index) => res += `${index > 0 ? " " : ""}${el[0].toUpperCase()}${el.slice(1).toLowerCase()}`)
    return res
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
    places,
    fileArray,
    validateData,
    orderCreator,
    noOrderCreator,
    getOrCreateUserFromData,
    getOrCreateUserWhereData,
    isInternal,
    nds
  }
}