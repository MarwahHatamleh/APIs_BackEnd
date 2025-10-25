import { DeleteRole } from "../../../../models/lib/db/services/roles";
import { NextResponse } from "next/server";

export const DELETE = async (request: Request , params: {
    params: Promise<{ id: string }>;
  }) => {
  const {id } = await params.params;
  const results = await DeleteRole(+id);
  return NextResponse.json(results, { status: 200 });
};