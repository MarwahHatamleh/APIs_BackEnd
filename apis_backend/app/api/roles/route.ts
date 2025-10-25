import { CreateRole, DeleteRole, Role } from "../../../models/lib/db/services/roles";
import { NextResponse } from "next/server";
import { auth } from "../../middleware/auth";
import { authorize } from "../../middleware/authz";

export const POST = auth(
  authorize(["manage"])(async (request: Request) => {
  const body = await request.json() as Role;
  const results = await CreateRole(body);
  return NextResponse.json(results, { status: 201 });
}));



export const DELETE = auth(
  authorize(["manage"])(async (request: Request) => {
    try {
      const url = new URL(request.url);
      const roleId = url.searchParams.get("roleId");
      if (!roleId) throw new Error("role id not defined");
      const results = await DeleteRole(+roleId);
      return NextResponse.json(results, { status: 200 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return NextResponse.json({ status: 404, message: `${error.message}` });
    }
  })
);
