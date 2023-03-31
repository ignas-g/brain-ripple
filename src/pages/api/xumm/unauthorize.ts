import { NextApiRequest, NextApiResponse } from "next";
import { Xumm } from "../../../utils/xumm";
import { SdkTypes } from "xumm-sdk";

export interface PostPayloadResponseData {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SdkTypes.XummPostPayloadResponse | null | PostPayloadResponseData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const xumm = new Xumm();
    const response = await xumm.generateUnassignAccountRequest(req.body);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error generating XUMM unassign account request" });
  }
}