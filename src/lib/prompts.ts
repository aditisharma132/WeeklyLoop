export const getSchedulePrompt = (goals: any, priorities: any, routine: any, mealsAndFreeTime: any) => `
Generate a daily schedule in JSON format for the user based on the following:
Goals: ${JSON.stringify(goals)}
Priorities: ${JSON.stringify(priorities)}
Current Routine: ${JSON.stringify(routine)}
Meals & Free Time: ${JSON.stringify(mealsAndFreeTime)}

Important rules:
1. Include blocks for meals (lunch, dinner) and snacks as specified.
2. Include at least one block of free time to chill.
3. If the user's wake time is PM and sleep time is AM, the schedule is overnight (spanning into the next day). Keep time in HH:MM format (24h). For times that cross past midnight, just use the normal 24h format (e.g. 02:00 for 2 AM).
4. Do not exceed the user's sleep time unless absolutely necessary.
5. Try to gradually shift their current routine towards their desired routine if they differ.

Format requirements:
{
    "tasks": [
        {
            "id": "unique-id",
            "title": "Task Title",
            "startTime": "HH:MM",
            "endTime": "HH:MM",
            "category": "work|health|personal|learning|meal|snack|free",
            "status": "upcoming"
        }
    ]
}
`;

export const getRearrangePrompt = (currentSchedule: any, request: string) => `
The user has requested to rearrange their day: "${request}"
Current Schedule: ${JSON.stringify(currentSchedule)}

Rules for rearrangement:
1. If the user woke up late or a task took too long, shift subsequent tasks.
2. Maintain meal times and sleep times where possible.
3. If low priority tasks no longer fit today, move them to the "deferredToTomorrow" array instead of cramming them in.

Rearrange the schedule to accommodate the request. Return the updated schedule in JSON format:
{
    "tasks": [
        {
            "id": "unique-id",
            "title": "Task Title",
            "startTime": "HH:MM",
            "endTime": "HH:MM",
            "category": "work|health|personal|learning|meal|snack|free",
            "status": "upcoming|completed|skipped"
        }
    ],
    "deferredToTomorrow": [
        {
            "id": "unique-id",
            "title": "Task Title",
            "category": "work|health|personal|learning",
            "duration": "1h" // approximate duration it would take
        }
    ]
}
`;
