import { GoogleGenAI } from "@google/genai";
import { Workout, WorkoutType, WorkoutConfig } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWorkoutAdvice = async (workout: Workout): Promise<string> => {
  try {
    const ai = getClient();

    const prompt = `
      You are an elite fitness coach speaking Hebrew. The user just finished a workout.
      
      Details:
      - Type: ${workout.type}
      - Duration: ${workout.durationMinutes} minutes
      - Intensity: ${workout.intensity}
      - Notes: ${workout.notes || "None"}
      - Date: ${new Date(workout.date).toLocaleDateString()}

      Task:
      Provide a very short, punchy response in Hebrew (max 2 sentences). 
      1. Acknowledge the effort specifically related to the workout type.
      2. Give one specific recovery tip or a suggestion for their next session.
      
      Tone: Motivating, professional, concise. Do not use markdown formatting like bolding.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "כל הכבוד על האימון! הקפד לנוח ולשתות מים.";
  } catch (error) {
    console.error("Error generating advice:", error);
    return "כל הכבוד על האימון! חשוב להקפיד על שתיית מים ומנוחה טובה.";
  }
};

export const generateWorkoutPlan = async (config: WorkoutConfig): Promise<string> => {
  try {
    const ai = getClient();

    const groupsDesc = config.muscleGroups.map(g => `${g.muscle} (${g.exerciseCount} exercises)`).join(', ');
    const totalCount = config.muscleGroups.reduce((acc, g) => acc + g.exerciseCount, 0);

    const instructions = `Create a workout plan for the following muscle groups: ${groupsDesc}.`;

    const prompt = `
      ${instructions}
      
      Constraints:
      - Language: Hebrew.
      - Total exercises: ${totalCount}.
      - For each muscle group, include exactly the specified number of distinct exercises.
      - Format as a clear list: "Exercise Name (Hebrew): Sets x Reps".
      - Example line: "לחיצת חזה: 3x10".
      - No intro text, no outro text, no headers. Just the list of exercises.
      - Make the specific exercises random/varied each time this is called.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "שגיאה ביצירת האימון. נסה שוב.";
  } catch (error) {
    console.error("Error generating plan:", error);
    return "לא ניתן לייצר תוכנית כרגע. נסה שוב.";
  }
};