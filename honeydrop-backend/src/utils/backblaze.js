import B2 from 'backblaze-b2';
import fs from 'fs';
import path from 'path';

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APP_KEY,
});

export const uploadToBackblaze = async (filePath, fileName) => {
  await b2.authorize();
  const { data: uploadUrlData } = await b2.getUploadUrl({ bucketId: process.env.B2_BUCKET_ID });
  const file = fs.readFileSync(filePath);

  const uploadResult = await b2.uploadFile({
    uploadUrl: uploadUrlData.uploadUrl,
    uploadAuthToken: uploadUrlData.authorizationToken,
    fileName,
    data: file,
    mime: 'application/octet-stream',
  });

  const publicUrl = `https://f000.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}`;
  return publicUrl;
};
