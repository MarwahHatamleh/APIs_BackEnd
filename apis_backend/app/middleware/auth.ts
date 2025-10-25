import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const auth = (handler: (req: NextRequest) => Promise<NextResponse>) => {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ message: "No token" }, { status: 401 });

    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).user = payload;
      return handler(req); 
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  };
};
