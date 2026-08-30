import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
const client = new S3Client({
    region: process.env.AWS_REGIONS,
    credentials:{
        accessKeyId:process.env.accessKeyId,
        secretAccessKey:process.env.secretAccessKey,

    }
    
    
});

export default client
