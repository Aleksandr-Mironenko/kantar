import { DataCreateOrderProcess } from '../../components/DTO/DTO'

// Утилита для проверки пустой строки
function isEmpty(str: string | undefined): boolean {
  return !str || str.trim().length === 0;
}

// Регулярка для email (строгая, но не идеальная — лучше, чем просто includes("@"))
function isValidEmail(email: string | undefined): boolean {
  if (isEmpty(email)) return false;
  const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return regex.test(email!.trim());
}

// Регулярка для российского телефона (поддерживает +7, 8, 7, пробелы, дефисы, скобки)
function isValidRussianPhone(phone: string | undefined): boolean {
  if (isEmpty(phone)) return false;
  const regex = /^(\+7|8|7)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  return regex.test(phone!.trim());
}

export function validate(data: DataCreateOrderProcess) {
  const errors: string[] = [];

  // Согласие
  if (!data.agree) {
    errors.push("Необходимо согласие на обработку персональных данных");
  }

  // Кто создаёт заявку (sender или recipient)
  if (data.client !== "sender" && data.client !== "recipient" && data.client !== "organizer") {
    errors.push("Некорректное значение client");
  }

  if (data.client === "organizer" && typeof data.nameOrganizer !== "string" && typeof data.phoneOrganizer !== "string" && typeof data.emailOrganizer !== "string") {
    errors.push("Некорректные поля организатора");
  }

  if (!data.costOfCargo) {
    errors.push("Нет объявленной стоимости");
  }

  // Основные контакты отправителя
  if (!isValidEmail(data.emailFrom)) {
    errors.push("Некорректный или пустой email отправителя (emailFrom)");
  }

  if (!isValidRussianPhone(data.phoneFrom)) {
    errors.push("Некорректный или пустой телефон отправителя (phoneFrom)");
  }

  // Контакты получателя
  if (!isValidEmail(data.emailWhere)) {
    errors.push("Некорректный или пустой email получателя (emailWhere)");
  }

  if (!isValidRussianPhone(data.phoneWhere)) {
    errors.push("Некорректный или пустой телефон получателя (phoneWhere)");
  }

  // Имена и адреса
  if (isEmpty(data.nameFrom)) {
    errors.push("Имя отправителя (nameFrom) обязательно");
  }

  if (isEmpty(data.nameWhere)) {
    errors.push("Имя получателя (nameWhere) обязательно");
  }

  if (isEmpty(data.adressFrom)) {
    errors.push("Адрес отправителя (adressFrom) обязателен");
  }

  if (isEmpty(data.adressWhere)) {
    errors.push("Адрес получателя (adressWhere) обязателен");
  }

  if (isEmpty(data.indexFrom)) {
    errors.push("Индекс отправителя (indexFrom) обязателен");
  }

  if (isEmpty(data.indexWhere)) {
    errors.push("Индекс получателя (indexWhere) обязателен");
  }

  // 6. Страны
  if (!data.fromCountryObj || isEmpty(data.fromCountryObj.name)) {
    errors.push("Страна отправителя не выбрана или некорректна");
  }

  if (!data.whereCountryObj || isEmpty(data.whereCountryObj.name)) {
    errors.push("Страна получателя не выбрана или некорректна");
  }

  // 7. Города (могут быть null, но если указаны — проверяем)
  if (data.fromCityObj && isEmpty(data.fromCityObj.name)) {
    errors.push("Название города отправителя некорректно");
  }

  if (data.whereCityObj && isEmpty(data.whereCityObj.name)) {
    errors.push("Название города получателя некорректно");
  }

  // 8. Тип отправления
  if (data.document !== "document" && data.document !== "goods") {
    errors.push("Некорректный тип отправления (document)");
  }

  // 10. Цена и расчёты
  if (data.price < 0) {
    errors.push(`Стоимость (price) ${data.price} ${typeof data.price} должна быть указана`);
  }

  if (!data.isFinalHeft || data.isFinalHeft <= 0) {
    errors.push("Итоговый вес (isFinalHeft) должен быть больше 0");
  }

  if (!data.isFinalOnlyHeft || data.isFinalOnlyHeft <= 0) {
    errors.push("Общий вес (isFinalOnlyHeft) должен быть больше 0");
  }

  if (!data.isFinalOnlyVolume || data.isFinalOnlyVolume <= 0) {
    errors.push("Общий объем (isFinalOnlyVolume) должен быть больше 0");
  }

  if (!data.count || data.count <= 0) {
    errors.push("Общее количество мест (count) должно быть больше 0");
  }

  if (data.price < 0) {
    errors.push("Значение nds должно быть");
  }

  if (!data.fs) {
    errors.push("Значение fs должно быть");
  }

  if (!data.fsRF) {
    errors.push("Значение fsRF должно быть");
  }

  if (!data.koefficient || data.koefficient <= 0) {
    errors.push("Коэффициент (koefficient) должен быть больше 0");
  }

  // 11. Места (places) — детальная проверка
  if (!Array.isArray(data.places) || data.places.length === 0) {
    errors.push("Должно быть указано хотя бы одно место (places)");
  } else {
    data.places.forEach((place, index) => {
      const prefix = `Место ${index + 1}: `;
      if (!place.length || place.length <= 0) errors.push(prefix + "длина должна быть > 0");
      if (!place.width || place.width <= 0) errors.push(prefix + "ширина должна быть > 0");
      if (!place.height || place.height <= 0) errors.push(prefix + "высота должна быть > 0");
      if (!place.heft || place.heft <= 0) errors.push(prefix + "вес должен быть > 0");
      if (!place.places || place.places <= 0) errors.push(prefix + "количество должно быть > 0");
      if (!place.volume || place.volume <= 0) errors.push(prefix + "обю вес должен быть > 0");
    });
  }

  // 12. Файлы — опционально, но если есть — проверяем тип
  if (data.fileArray && data.fileArray.length > 0) {
    data.fileArray.forEach((file, index) => {
      if (!(file instanceof File) || file.size === 0) {
        errors.push(`Файл ${index + 1} пустой или некорректный`);
      }
    });
  }

  // Если есть ошибки — кидаем одну с полным списком (удобно для UI)
  if (errors.length > 0) {
    throw new Error("Ошибки в форме:\n• " + errors.join("\n• "));
  }


}