import { DeactivateUser } from "../../../../models/lib/db/services/users";
import { NextResponse } from "next/server";
import { auth } from "../../../middleware/auth";
import { authorize } from "../../../middleware/authz";

export const DELETE = auth(
  authorize(["delete"])(async (request: Request) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) throw new Error("userId not defined");
    const result = await DeactivateUser(+userId);
    return NextResponse.json(result, { status: 200 });
  })
);
