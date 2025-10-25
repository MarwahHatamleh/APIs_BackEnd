import { GetUsers } from "../../../../models/lib/db/services/users";
import { NextResponse } from "next/server";

export const GET = async()=>{
  const result = await GetUsers();
return NextResponse.json(result , { status : 200 })
}