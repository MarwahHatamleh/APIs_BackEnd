import { NextResponse } from "next/server";
import { unfollow } from "../../../../../models/lib/db/services/follows";

export const DELETE = async (
  request: Request,
  params: {
    params: Promise<{ following_id: string }>;
  }
) => {
  try {
    const { following_id } = await params.params;
    const url = new URL(request.url);
    const follower_id = url.searchParams.get("follower_id");

    if (following_id && follower_id) {
      const result = await unfollow(+following_id, +follower_id);
      return NextResponse.json(result, { status: 200 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ message: `${error.message}`, status: 404 });
  }
};
