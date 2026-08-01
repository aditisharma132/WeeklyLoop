import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || "us-east-1",
});

export async function generateSchedule(prompt: string) {

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
