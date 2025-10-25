import { Login } from "../../../../models/lib/db/services/users";
import { NextResponse } from "next/server";
import { auth } from "../../../middleware/auth";
import { authorize } from "../../../middleware/authz";

export const POST = auth(
  authorize(["create"])(async (request: Request) => {
  const { email, password } = await request.json();
  try {
    const result = await Login(email, password);
    if (result) {
      return NextResponse.json(result, {
        status: 200,
      });
    } else {
      return NextResponse.json(
        { msg: `Error` },
        {
          status: 404,
        }
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { msg: `${error.message}` },
      {
        status: 404,
      }
    );
  }
}));

