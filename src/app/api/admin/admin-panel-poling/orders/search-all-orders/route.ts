import findAllOrders from './findAllOrders';

export async function GET(request: Request): Promise<Response> {

  try {
    //ищу данные всей таблицы
    const { arrayOrderObjData, count, page, limit, totalPages }
      = await findAllOrders(request);
    // const newArrOrderObjData = await Promise.all(
    //   arrayOrderObjData.map(async (order) => {
    //     const [sender, recipient] = await Promise.all([
    //       findUser(order.sender_id),
    //       findUser(order.recipient_id),
    //     ]);

    //     return {
    //       ...order,
    //       sender,
    //       recipient,
    //     };
    //   })
    // );
    return new Response(
      JSON.stringify({
        ok: true,
        arrayOrderObjData,
        meta: {
          page,
          limit,
          total: count,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }),
      { status: 200 }

    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ ok: false, error: 'Server error search orders' }),
      { status: 500 }
    );
  }
}

