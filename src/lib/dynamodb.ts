import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
});

export const dynamoDb = DynamoDBDocumentClient.from(client);

export const USERS_TABLE = process.env.DYNAMODB_TABLE_USERS || "WeeklyLoopUsers";
export const SCHEDULES_TABLE = process.env.DYNAMODB_TABLE_SCHEDULES || "WeeklyLoopSchedules";
