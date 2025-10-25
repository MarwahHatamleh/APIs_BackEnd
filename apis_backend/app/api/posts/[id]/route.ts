import { NextResponse } from "next/server";
import { DeletePost, posts, UpdatePost } from "../../../../models/lib/db/services/posts";

export const PUT = async (
  request: Request,
  params: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const body = (await request.json()) as posts;
    const { id } = await params.params;
    const result = await UpdatePost(body, +id);
    return NextResponse.json(result, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({
      message: `${error.message}`,
      status: 404,
    });
  }
};

export const DELETE = async (
  request: Request,
  params: {
    params: Promise<{ id: string }>;
  }
) => {
  try {
    const { id } = await params.params;
    const result = await DeletePost(+id);
    return NextResponse.json(result, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({
      message: `${error.message}`,
      status: 404,
    });
  }
};
