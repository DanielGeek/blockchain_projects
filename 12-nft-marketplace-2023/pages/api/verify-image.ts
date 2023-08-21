import { NextApiRequest, NextApiResponse } from "next";
import { Session } from 'next-iron-session';
import { addressCheckMiddleware, withSession } from "./utils";
import { FileReq } from "@_types/nft";


export default withSession ( async (req: NextApiRequest & { session: Session }, res: NextApiResponse ) => {
  if (req.method === "POST") {
    const {
      bytes,
      fileName,
      contentType
    } = req.body as FileReq;

    if (!bytes || !fileName || !contentType) {
      return res.status(422).send({ message: "Image data are missing" });
    }

    await addressCheckMiddleware(req, res);

    console.log(bytes, fileName, contentType);

    return res.status(200).send({ message: "Image has been created!" });

  } else {
    return res.status(422).send({message: "Invalid endpoint"});
  }
})