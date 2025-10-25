import { RestPassword } from "../../../../../models/lib/db/services/users";
import { NextResponse } from "next/server";


export const PUT = async(request:Request , params: {
    params: Promise<{ email: string }>;
  }) =>{ 
 const { email } = await params.params;
 console.log(email)
  const {password} = (await request.json());
  const result = await RestPassword(password, email);
  return NextResponse.json(result, { status: 200 });
}