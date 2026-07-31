export const getSchedulePrompt = (goals: any, priorities: any, routine: any) => `
Generate a daily schedule in JSON format for the user based on the following:
Goals: ${JSON.stringify(goals)}
Priorities: ${JSON.stringify(priorities)}
Routine: ${JSON.stringify(routine)}

Format requirements:
{
    "tasks": [
        {
            "id": "unique-id",
            "title": "Task Title",
            "startTime": "HH:MM",
            "endTime": "HH:MM",
            "category": "work|health|personal|learning",
            "status": "upcoming"
        }
    ]
}
`;

export const getRearrangePrompt = (currentSchedule: any, request: string) => `
The user has requested to rearrange their day: "${request}"
Current Schedule: ${JSON.stringify(currentSchedule)}

Rearrange the schedule to accommodate the request. Return the updated schedule in JSON format:
{
    "tasks": [
        {
            "id": "unique-id",
            "title": "Task Title",
            "startTime": "HH:MM",
            "endTime": "HH:MM",
            "category": "work|health|personal|learning",
            "status": "upcoming|completed|skipped"
        }
    ]
}
`;
