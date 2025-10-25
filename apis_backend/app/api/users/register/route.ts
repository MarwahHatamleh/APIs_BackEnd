/* eslint-disable @typescript-eslint/no-explicit-any */
import { Register } from "../../../../models/lib/db/services/users";
import { NextResponse } from "next/server";
import { auth } from "../../../middleware/auth";
import { authorize } from "../../../middleware/authz";

export const POST = auth(
  authorize(["create"])(async (request: Request) => {
  try {
    const body = await request.json();
    const result = await Register(body);
    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error: any) {
    return NextResponse.json(
      { msg: `Failed ${error.message}` },
      {
        status: 404,
      }
    );
  }
}));
