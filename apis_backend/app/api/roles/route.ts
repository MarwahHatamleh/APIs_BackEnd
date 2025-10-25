import { CreateRole, Role } from "../../../models/lib/db/services/roles";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json() as Role;
  const results = await CreateRole(body);
  return NextResponse.json(results, { status: 201 });
};

