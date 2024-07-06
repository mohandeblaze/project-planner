// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IHello } from "lib/hello";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse<IHello>) {
    res.status(200).json({ name: "John Doe" });
}
