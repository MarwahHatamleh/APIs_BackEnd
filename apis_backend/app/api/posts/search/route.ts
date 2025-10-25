import { NextResponse } from "next/server";
import { SearchPost } from "../../../../models/lib/db/services/posts";

export const GET = async (request: Request) => {
  try {
    const url = new URL(request.url);
    const Keyword = url.searchParams.get("Keyword");
    const tag = url.searchParams.get("tag");
    const sort = url.searchParams.get("sort");
    const limit = url.searchParams.get("limit");
    const page = url.searchParams.get("page");

    if (Keyword || tag || sort || limit || page) {
      const result = await SearchPost(Keyword, tag, +limit ,sort  , +page);
      return NextResponse.json(result, { status: 200 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ status: 404, message: `${error.message}` });
  }
};
