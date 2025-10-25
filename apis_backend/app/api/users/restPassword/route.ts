import { RestPassword } from "../../../../models/lib/db/services/users";
import { NextResponse } from "next/server";
import { authorize } from "../../../middleware/authz";
import { auth } from "../../../middleware/auth";

export const PUT = auth(
  authorize(["update"])(async (request: Request) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    if (!email) throw new Error("email not defined");
    const { password } = await request.json();
    const result = await RestPassword(password, email);
    return NextResponse.json(result, { status: 200 });
  })
);
