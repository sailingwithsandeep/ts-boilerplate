import { PutObjectCommand, S3Client, DeleteObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';

class AWS_SDK {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: process.env.AWS_SES_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESSKEYID as string,
                secretAccessKey: process.env.AWS_SECRETKEY as string,
            },
        });
    }

    async createSignedURL(sFileName: string, sContentType: string, path: string) {
        try {
            sFileName = sFileName.replace('/', '-');
            sFileName = sFileName.replace(/\s/gi, '-');

            const fileKey = `slotmachine-${Date.now()}-${sFileName}`;

            return {
                sUrl: await getSignedUrl(this.client, new PutObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: path + fileKey, ContentType: sContentType }), {
                    expiresIn: 3600,
                }),
                sPath: path + fileKey,
            };
        } catch (error: any) {
            log.error(`Error in createSignedURL ${error.message}`);
        }
    }
    async deleteObject(sPath: string) {
        try {
            return this.client.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: sPath }));
        } catch (error: any) {
            log.error(`Error in deleteObject ${error.message}`);
        }
    }
    async putObj(sFileName: string, sContentType: string, path: string, fileStream: any) {
        try {
            sFileName = sFileName.replace('/', '-');
            sFileName = sFileName.replace(/\s/gi, '-');

            const fileKey = `slotmachine-${Date.now()}-${sFileName}`;

            return this.client.send(
                new PutObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: path + fileKey,
                    ContentType: sContentType,
                    Body: fileStream,
                })
            );
        } catch (error: any) {
            log.error(`Error in putObj ${error.message}`);
        }
    }

    /**
     * @param s3Path  path to upload file
     * @param fileKey file key
     * @param sContentType content type of file
     * @description Get the form fields and target URL for direct POST uploading.
     */
    async createS3URL(s3Path: string, fileKey: string, sContentType: string) {
        try {
            const params = {
                Bucket: process.env.S3_BUCKET_NAME as string,
                Key: s3Path + fileKey,
                Expires: 30000,
                Conditions: [
                    ['content-length-range', 0, 1000000],
                    ['eq', '$Content-Type', sContentType],
                    ['eq', '$key', s3Path + fileKey],
                ] as any,
            };

            const data = await createPresignedPost(this.client, params);
            return { sUrl: data.url, sPath: s3Path + fileKey, oFields: data.fields };
        } catch (error: any) {
            log.error(`Error in createS3URL ${error.message}`);
        }
    }

    private async uploadFromUrlToS3(url: string, destPath: string) {
        try {
            const res = await axios.get(url, { responseType: 'arraybuffer', responseEncoding: 'binary' });
            const objectParams: PutObjectCommandInput = {
                ContentType: res.headers['content-type'],
                ContentLength: res.headers['content-length'],
                Key: destPath,
                Body: res.data,
                Bucket: process.env.S3_BUCKET_NAME,
            };

            return this.client.send(new PutObjectCommand(objectParams));
        } catch (error: any) {
            log.error(`Error in UploadFromUrlToS3 ${error.message}`);
        }
    }

    async getS3ImageURL(url: string, path: string) {
        try {
            const imageURL = url;

            let imageName = imageURL.substring(imageURL.lastIndexOf('/') + 1);
            imageName = (imageName.match(/[^.]+(\.[^?#]+)?/) || [])[0] as string;

            const fileExtension = imageName.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gim)?.[0];
            const fileName = Math.floor(Math.random() * 100000 + 99999).toString();
            const imagePath = path + fileName + fileExtension;
            const res = await this.uploadFromUrlToS3(imageURL, imagePath);

            return {
                sSuccess: res ? true : false,
                sPath: imagePath,
                sUrl: process.env.S3_BUCKET_URL + imagePath,
            };
        } catch (error: any) {
            log.error(`Error in getS3ImageURL ${error.message}`);
        }
    }
}

export default new AWS_SDK();
