import axios, { AxiosHeaders } from "axios";
import { NextRequest, NextResponse } from "next/server";

const hostname = process.env.NEXT_PUBLIC_API_HOSTNAME;

const publicRoutes = ["/api/user/login", "/api/user/register"];

async function proxyRequest(req: NextRequest) {
  const headers = new AxiosHeaders();

  if (req.cookies.get("sc-auth")) {
    headers.set("authorization", req.cookies.get("sc-auth")?.value);
  }

  const url = req.nextUrl.pathname.split("/api")[1];

  const args = [
    hostname + "/api" + url,
    ...(["GET", "DELETE"].includes(req.method) ? [] : [await req.json()]),
    {
      headers,
    },
  ];

  const method = req.method.toLowerCase() as keyof typeof axios;

  if (!axios[method]) {
    throw new Error("No Axios method specified");
  }

  console.log(axios[method]);
  console.log(args);

  const res = await (axios[method] as Function)(...args);

  return res.data;
}

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

export async function PUT(req: NextRequest) {
  return handleRequest(req);
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req: NextRequest) {
  if (!hostname) {
    throw new Error("Fatal client proxy error");
  }

  if (publicRoutes.includes(req.nextUrl.pathname)) {
    try {
      const data = await proxyRequest(req);
      const oneWeekMS = 1000 * 60 * 60 * 24 * 7;

      const response = NextResponse.json(data);
      response.cookies.set({
        name: "sc-auth",
        value: data.access_token,
        path: "/",
        expires: new Date(Date.now() + oneWeekMS),
        httpOnly: true,
        sameSite: "strict",
      });

      return response;
    } catch (err) {
      return handleErrorResponse(err);
    }
  }

  if (req.nextUrl.pathname === "/api/user/logout") {
    const response = NextResponse.json({ message: "ok" });
    response.cookies.set({
      name: "sc-auth",
      value: "",
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      sameSite: "strict",
    });

    return response;
  }

  try {
    const data = await proxyRequest(req);
    return NextResponse.json(data);
  } catch (err) {
    return handleErrorResponse(err);
  }
}

function handleErrorResponse(err: unknown) {
  if (axios.isAxiosError(err) && err.response) {
    return NextResponse.json(
      { error: err.response.data },
      { status: err.response.status }
    );
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
