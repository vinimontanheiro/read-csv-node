const AWS = require(`aws-sdk`);

exports.getDynamoDBConfig = async () => {
    console.log(process.env);
    return {
        credentials: new AWS.Credentials({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }),
        region: process.env.AWS_DEFAULT_REGION,
    };
};

exports.getDynamoDBDocumentClient = async () => {
    AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
    return new AWS.DynamoDB.DocumentClient(this.getDynamoDBConfig());
};
