import { NextRequest, NextResponse } from "next/server";

export const authorize = (permissions: string[]) => {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest): Promise<NextResponse> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = (req as any).user;
      if (!user)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

      // console.log("user.permissions", user.role.permissions);

      const hasPermission = user.role.permissions?.some((prm: string) => {
        return permissions.includes(prm);
      });
      // console.log("hasPermission", hasPermission);

      if (!hasPermission)
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });

      return handler(req);
    };
  };
};
