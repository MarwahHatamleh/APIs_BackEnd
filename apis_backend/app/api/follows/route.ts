import { NextResponse } from "next/server";
import { follows } from "../../../models/lib/db/services/follows";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authz";

export const POST = auth(
  authorize(["create"])(async (request: Request) => {
  try {
    const body = await request.json();
    const result = await follows(body);
    return NextResponse.json(result, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({
      message: `${error.message}`,
      status: 404,
    });
  }
}));

