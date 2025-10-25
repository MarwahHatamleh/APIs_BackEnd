import { NextResponse } from "next/server";
import { FilterPost, FilterPostBySalary } from "../../../../models/lib/db/services/posts";

// export const GET = async () => {
//   try {
//       const result = await FilterPost();
//       return NextResponse.json(result, { status: 200 });
    
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     return NextResponse.json({ status: 404, message: `${error.message}` });
//   }
// };

export const GET = async (request: Request) => {
  try {
    const url = new URL(request.url);
    const salary = url.searchParams.get("salary");
    if (salary) {
      const result = await FilterPostBySalary(+salary);
      return NextResponse.json(result, { status: 200 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ status: 404, message: `${error.message}` });
  }
};
