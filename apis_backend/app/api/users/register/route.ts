/* eslint-disable @typescript-eslint/no-explicit-any */
import { Register } from "../../../../models/lib/db/services/users";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
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
};
