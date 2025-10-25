import { NextResponse } from "next/server";
import { GetMyPosts } from "../../../../../models/lib/db/services/follows";

export const GET = async (
  request: Request,
  params: {
    params: Promise<{ follower_id: string }>;
  }
) => {
  try {
    const { follower_id } = await params.params;
    const result = await GetMyPosts(+follower_id);
    return NextResponse.json(result, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ status: 404, message: `${error.message}` });
  }
};

