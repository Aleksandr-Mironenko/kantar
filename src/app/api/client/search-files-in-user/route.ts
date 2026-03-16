import findFilesInUser from "../orders/search-one-order/findFilesInUser"

export async function POST(req: Request) {
  const { userId } = await req.json();


  try {
    //получение файлов rkbtynf
    const filesUser = await findFilesInUser(userId)
    console.log(filesUser)
    if (!filesUser) {
      return new Response(
        JSON.stringify({ ok: false }),
        { status: 403 }
      )
    }

    // Возвращаем нужные поля
    return new Response(
      JSON.stringify({
        ok: true,
        filesUser
      })

    )
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Server error search files for User' }),
      { status: 500 }
    );
  }
}
