import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface CourseModule {
  title: string;
  description: string;
  topics: string[];
  keyConcepts: string[];
}

export interface ToolStack {
  category: string;
  options: {
    name: string;
    description: string;
    whyChoose: string;
  }[];
}

export interface PracticeTask {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  realWorldExample: string;
  hint: string;
  points: number;
  initialCode: string;
  solutionTemplate: string;
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
  industryKnowledge: string;
  basics: CourseModule[];
  advanced: CourseModule[];
  toolStacks: ToolStack[];
  practiceTasks: PracticeTask[];
  project: ProjectIdea;
}

export async function generateRoadmap(role: string): Promise<RoleRoadmap> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate a comprehensive learning roadmap for a fresher wanting to become a ${role}. 
    The roadmap should include:
    1. A brief overview of the role.
    2. "Industry Knowledge": Specific domain knowledge required (e.g., for Fintech, understand ledgers; for Healthtech, understand HIPAA).
    3. A "Basics" section with 3-4 modules covering fundamental knowledge.
    4. An "Advanced" section with 3-4 modules covering frameworks, libraries, and tools.
    5. "Tool Stacks": Detailed comparison of languages/frameworks/databases for this role (e.g., JS vs Python for Backend).
    6. "Practice Tasks": 5 LeetCode-style tasks (1 Easy, 3 Medium, 1 Hard) with real-world examples, hints, and initial code.
    7. A "Guided Project" with detailed steps.
    8. A "Capstone Task" for certification.
    
    Ensure the content is tailored for a complete beginner and emphasizes understanding over memorization.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          overview: { type: Type.STRING },
          industryKnowledge: { type: Type.STRING },
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
          toolStacks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      whyChoose: { type: Type.STRING },
                    },
                    required: ["name", "description", "whyChoose"],
                  },
                },
              },
              required: ["category", "options"],
            },
          },
          practiceTasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
                realWorldExample: { type: Type.STRING },
                hint: { type: Type.STRING },
                points: { type: Type.INTEGER },
                initialCode: { type: Type.STRING },
                solutionTemplate: { type: Type.STRING },
              },
              required: ["id", "title", "description", "difficulty", "realWorldExample", "hint", "points", "initialCode", "solutionTemplate"],
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
        required: ["role", "overview", "industryKnowledge", "basics", "advanced", "toolStacks", "practiceTasks", "project"],
      },
    },
  });

  return JSON.parse(response.text);
}
