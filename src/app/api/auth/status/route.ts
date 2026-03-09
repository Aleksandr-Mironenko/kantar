// import { cookies } from "next/headers";

// export async function GET() {
//   const cookieStore = cookies();
//   const auth = (await cookieStore).get(
//     "sb-pyzpdyaqsrbgstfdlycz-auth-token");

//   return Response.json({
//     loggedIn: Boolean(auth)
//   });
// }

import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();

  const authCookie = (await cookieStore)
    .getAll()
    .find(c => c.name.startsWith("sb-") && c.name.includes("auth-token"));

  return Response.json({
    loggedIn: Boolean(authCookie)
  });
}