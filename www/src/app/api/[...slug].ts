import axios, { AxiosHeaders } from "axios";
import { Request, Response } from "express";

// eslint-disable-next-line
const hostname = process.env.NEXT_PUBLIC_API_HOSTNAME;

const publicRoutes = ["/api/user/login", "/api/user/register"];

async function proxyRequest(req: Request) {
  delete req.query.slug;

  const headers = new AxiosHeaders();

  if (req.cookies["sc-auth"]) {
    headers.set("authorization", req.cookies["sc-auth"]);
  }

  const url = req.url.split("/api")[1];

  const args = [
    hostname + "/api/" + url,
    ...(["GET", "DELETE"].includes(req.method) ? [] : [req.body]),
    {
      headers,
    },
  ];

  const method = req.method.toLowerCase() as keyof typeof axios;

  if (!axios[method]) {
    throw new Error("No Axios method specified");
  }

  const res = await (axios[method] as Function)(...args);

  return res.data;
}

export default async (req: Request, res: Response) => {
  if (publicRoutes.includes(req.url)) {
    try {
      const data = await proxyRequest(req);

      const oneWeekMS = 1000 * 60 * 60 * 24 * 7;

      res.setHeader(
        `Set-Cookie`,
        `sc-auth=${data.access_token}; path=/; Expires=${new Date(
          Date.now() + oneWeekMS
        )}; HttpOnly; SameSite=Strict;`
      );

      return res.status(200).json(data);
    } catch (err) {
      if (!(err instanceof Error)) {
        return null;
      }
      console.error(err.message);
      return res.status(500).send(err);
    }
  }

  if (req.url === "/api/user/logout") {
    res.setHeader(
      `Set-Cookie`,
      `sc-auth=''; path=/; Expires=${new Date(
        0
      )}; HttpOnly; SameSite=Strict;`
    );

    return res.status(200).send("ok");
  }

  try {
    const data = await proxyRequest(req);

    return res.status(200).json(data);
  } catch (err) {
    let status = 500;
    let message = "Internal Server Error";

    if (axios.isAxiosError(err) && err.response) {
      status = err.response.status;
      message = err.response.data;
    }

    return res.status(status).json(message);
  }
};
