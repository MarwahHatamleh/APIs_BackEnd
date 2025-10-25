import { NextRequest, NextResponse } from "next/server";
import {
  FilterPost,
  FilterPostBySalary,
} from "../../../../models/lib/db/services/posts";
import { auth } from "../../../middleware/auth";
import { authorize } from "../../../middleware/authz";

// export const GET = async () => {
//   try {
//       const result = await FilterPost();
//       return NextResponse.json(result, { status: 200 });

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     return NextResponse.json({ status: 404, message: `${error.message}` });
//   }
// };

export const GET = auth(
  authorize(["read"])(async (request: Request) => {
    try {
      const url = new URL(request.url);
      const salary = url.searchParams.get("salary");

      if (!salary) {
        return NextResponse.json(
          { message: "Missing salary" },
          { status: 400 }
        );
      }

      const result = await FilterPostBySalary(+salary);
      return NextResponse.json({ result }, { status: 200 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return NextResponse.json(
        { status: 500, message: error.message },
        { status: 500 }
      );
    }
  })
);
