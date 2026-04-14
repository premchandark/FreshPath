import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface CourseModule {
  title: string;
  description: string;
  topics: string[];
  keyConcepts: string[];
}

export interface ProjectIdea {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  technologies: string[];
  detailedSteps: {
    title: string;
    instruction: string;
    codeSnippet?: string;
  }[];
  capstoneTask: {
    title: string;
    description: string;
    requirements: string[];
  };
}

export interface RoleRoadmap {
  role: string;
  overview: string;
  basics: CourseModule[];
  advanced: CourseModule[];
  project: ProjectIdea;
}

export async function generateRoadmap(role: string): Promise<RoleRoadmap> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate a comprehensive learning roadmap for a fresher wanting to become a ${role}. 
    The roadmap should include:
    1. A brief overview of the role.
    2. A "Basics" section with 3-4 modules covering fundamental knowledge.
    3. An "Advanced" section with 3-4 modules covering frameworks, libraries, and tools.
    4. A "Guided Project" with 5-7 detailed steps. Each step must have a title, clear instruction, and an optional code snippet.
    5. A "Capstone Task" which is a final challenge the user must complete independently to get "certified".
    
    Ensure the content is tailored for a complete beginner.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          overview: { type: Type.STRING },
          basics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["title", "description", "topics", "keyConcepts"],
            },
          },
          advanced: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["title", "description", "topics", "keyConcepts"],
            },
          },
          project: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
              technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
              detailedSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    instruction: { type: Type.STRING },
                    codeSnippet: { type: Type.STRING },
                  },
                  required: ["title", "instruction"],
                },
              },
              capstoneTask: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["title", "description", "requirements"],
              },
            },
            required: ["title", "description", "difficulty", "technologies", "detailedSteps", "capstoneTask"],
          },
        },
        required: ["role", "overview", "basics", "advanced", "project"],
      },
    },
  });

  return JSON.parse(response.text);
}
