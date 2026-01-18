"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // Загружаем переменные окружения из .env
const supabase_js_1 = require("@supabase/supabase-js");
const ws_1 = require("ws");
// Инициализация Supabase 
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
// Инициализация WebSocket сервера 
const wss = new ws_1.WebSocketServer({ port: 3001 }); // Сервер WS на порту 3001
const clients = new Set(); // Множество подключенных клиентов
console.log('Сервер обновления в реальном времени находится на порте 3001]://localhost:3001');
// Буфер для батчинга изменений 
const changeBuffer = [];
// Подписка на таблицу orders 
supabase.channel('orders-secure')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
    const source = payload.eventType === 'DELETE'
        ? payload.old
        : payload.new;
    if (!source)
        return;
    const filtered = {
        eventType: payload.eventType,
        id: source.id,
        sender_id: source.sender_id,
        recipient_id: source.recipient_id,
        address_from_id: source.address_from_id,
        address_where_id: source.address_where_id,
        name_from: source.name_from,
        name_where: source.name_where,
        phone_from: source.phone_from,
        phone_where: source.phone_where,
        email_from: source.email_from,
        email_where: source.email_where,
        discount_this_send: source.discount_this_send,
        price_full: source.price_full,
        is_paid: source.is_paid,
        heft_full: source.heft_full,
        status: source.status,
        is_individual: source.is_individual,
    };
    changeBuffer.push(filtered);
})
    .subscribe();
// Батчинг изменений каждые 5 секунд
setInterval(() => {
    if (changeBuffer.length === 0)
        return; //если изменений нет — ничего не шлем
    // Берем все накопленные изменения
    const batched = changeBuffer.splice(0, changeBuffer.length);
    // Формируем сообщение для WS
    const message = JSON.stringify({ type: 'orders_batch', data: batched });
    // Отправляем всем подключенным клиентам
    for (const client of clients) {
        if (client.readyState === 1)
            client.send(message);
    }
}, 5000);
// Обработка подключений новых клиентов 
wss.on('connection', async (ws) => {
    clients.add(ws); // добавляем клиента в Set
    // Initial fetch только нужные поля
    const { data: orders } = await supabase
        .from('orders')
        .select(`
      sender_id, recipient_id, address_from_id, address_where_id,
      name_from, name_where, phone_from, phone_where,
      email_from, email_where, discount_this_send, price_full,
      is_paid, heft_full, status, is_individual
    `);
    // Отправляем клиенту полный список при подключении
    ws.send(JSON.stringify({ type: 'orders_full', data: orders }));
    // Удаляем клиента из Set при закрытии соединения
    ws.on('close', () => clients.delete(ws));
});
