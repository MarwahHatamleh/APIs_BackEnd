import { NextResponse } from "next/server";
import { CreateComment } from "../../../models/lib/db/services/comments";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authz";

export const POST = auth(
  authorize(["create"])(async (request: Request) => {
  try {
    
    const body = await request.json();
    const result = await CreateComment(body);
    return NextResponse.json(result, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({
      message: `${error.message}`,
      status: 404,
    });
  }
}));


