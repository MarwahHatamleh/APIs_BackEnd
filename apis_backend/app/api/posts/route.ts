import {
  CreatePost,
  GetPostsByLimit,
} from "../../../models/lib/db/services/posts";
import { NextRequest, NextResponse } from "next/server";
import { authorize } from "../../middleware/authz";
import { auth } from "../../middleware/auth";

export const POST = auth(
  authorize(["create"])(async (req: NextRequest) => {
    try {
      const body = await req.json();
      const result = await CreatePost(body);
      return NextResponse.json(result, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
    }
  })
);

export const GET = auth(
  authorize(["read"])(async (request: NextRequest) => {
    try {
      const url = new URL(request.url);
      const limit = url.searchParams.get("limit");
      const page = url.searchParams.get("page");

      if (!limit || !page) {
        return NextResponse.json(
          { message: "Missing limit or page" },
          { status: 400 }
        );
      }

      const result = await GetPostsByLimit(+limit, +page);
      return NextResponse.json({ page: +page, result }, { status: 200 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return NextResponse.json(
        { status: 500, message: error.message },
        { status: 500 }
      );
    }
  })
);
