import { NextApiRequest, NextApiResponse } from "next";
import { Xumm } from "../../../utils/xumm";
import { SdkTypes } from "xumm-sdk";

export interface GetPayloadResponseData {
    error: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SdkTypes.XummGetPayloadResponse | null | GetPayloadResponseData>
) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const xumm = new Xumm();
        const response = await xumm.resolvePayload(req.body);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: "Error resolving the payload data" });
    }
}