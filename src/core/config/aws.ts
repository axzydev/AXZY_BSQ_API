import AWS from "aws-sdk";
import { getConfig } from "../utils/config";

AWS.config.update({
  accessKeyId: getConfig("AWS_ACCESS_KEY_ID"),
  secretAccessKey: getConfig("AWS_SECRET_ACCESS_KEY"),
  region: getConfig("AWS_REGION"),
});

const s3 = new AWS.S3();

export const uploadFile = async (file: any) => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const params = {
      Bucket: getConfig("AWS_BUCKET_NAME"),
      Key: fileName,
      Body: file.data,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(params).promise();

    return data.Location;
  } catch (e) {
    console.log("Error uploading file: ", e); // Log para verificar el error
  }
};
