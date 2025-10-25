/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  profileInfo,
  UpdateUserInfo,
} from "../../../../models/lib/db/services/users";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  params: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const { id } = await params.params;
    const result = await profileInfo(+id);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 404, message: `${error.message}` });
  }
};

export const PUT = async (
  request: Request,
  params: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const { id } = await params.params;
    const body = (await request.json()) as UpdateUserInfo;
    const result = UpdateUserInfo(+id, body);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 404, message: `${error.message}` });
  }
};
