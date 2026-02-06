import { use, useEffect } from "react"

const UserProffile = ({ userId }) => {

  const getUser = async (numberOrder: number) => {
    const request = await fetch("/api/admin/admin-panel-poling/orders/search-one-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numberOrder
      })
    })

    if (!request.ok) {
      throw new Error("Ошибка получения мест")
    }

    const response = await request.json();
    setOrder(response.dataOrder)
    setFiles(response.arrrfiles)
    setPlace(response.arrayPlacesInOrder)
    setUserSendler(response.dataUserSendler)
    setUserRecipient(response.dataUserRecipient)
    setAddressSendler(response.dataAddressSendler)
    setAddressRecipient(response.dataAddressRecipient)
    setDataAddressInIdSendler(response.dataAddressInIdSendler)
    setDataAddressInIRecipient(response.dataAddressInIRecipient)
  }




  useEffect(() => {

  }, [userId]);
  return (
    <div>UserProffile Component </div>
    )
}
export default UserProffile