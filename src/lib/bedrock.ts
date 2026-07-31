import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { isDemoMode } from "./dynamodb";

const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || "us-east-1",
});

export async function generateSchedule(prompt: string) {
    if (isDemoMode) {
        // Return a mock schedule for demo purposes
        return JSON.stringify({
            tasks: [
                { id: "1", title: "Morning Review", startTime: "09:00", endTime: "09:30", category: "work", status: "completed" },
                { id: "2", title: "Deep Work", startTime: "09:30", endTime: "11:30", category: "work", status: "upcoming" },
                { id: "3", title: "Lunch Break", startTime: "12:00", endTime: "13:00", category: "personal", status: "upcoming" },
                { id: "4", title: "Exercise", startTime: "17:00", endTime: "18:00", category: "health", status: "upcoming" },
            ]
        });
    }

    const command = new InvokeModelCommand({
        modelId: process.env.BEDROCK_MODEL_ID || "amazon.nova-pro-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            messages: [
                { role: "user", content: [{ text: prompt }] }
            ],
            system: [{ text: "You are a highly intelligent scheduling assistant. Always respond with valid JSON." }],
            inferenceConfig: {
                maxTokens: 2000,
                temperature: 0.7,
            }
        }),
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.output.message.content[0].text;
}
