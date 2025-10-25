import { NextResponse } from "next/server";
import { unlike } from "../../../../models/lib/db/services/likes";


export const DELETE = async (
  request: Request,
  params: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const { id } = await params.params;
    const url = new URL(request.url);
    const userID = url.searchParams.get("userID");

    if (!id || !userID) throw new Error(" id or user'id not defined");

    const result = await unlike(+id, +userID);
    return NextResponse.json(result, { status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ message: `${error.message}`, status: 404 });
  }
};
