import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export class S3Service {
    private client: S3Client;
    private bucketName: string;
    private region: string;

    constructor() {
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        const region = process.env.AWS_REGION;
        this.bucketName = process.env.AWS_BUCKET_NAME || '';
        this.region = region || '';

        if (!accessKeyId || !secretAccessKey || !region || !this.bucketName) {
            console.warn("AWS S3 credentials not fully configured in .env");
        }

        this.client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: accessKeyId || '',
                secretAccessKey: secretAccessKey || ''
            }
        });
    }

    async uploadFile(file: Express.Multer.File, folder: string = 'equipment'): Promise<string> {
        // Simple sanitization
        const fileExtension = file.originalname.split('.').pop();
        const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 10);
        const fileName = `${folder}/${Date.now()}_${sanitizedFileName}.${fileExtension}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.client.send(command);

        // Construct public URL (Assuming bucket allows public access or is behind CloudFront)
        // Standard S3 URL format
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
    }
}
