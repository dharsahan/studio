"use server";

import { generatePlayfulMessage } from "@/ai/flows/generate-playful-message";

export async function getPlayfulMessageAction(input: {
  name1: string;
  name2: string;
  compatibilityPercentage: number;
}) {
  try {
    const { playfulMessage } = await generatePlayfulMessage(input);
    return { success: true, message: playfulMessage };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Could not generate a message. Please try again." };
  }
}
