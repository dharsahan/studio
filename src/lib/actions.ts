"use server";

import { generatePlayfulMessage } from "@/ai/flows/generate-playful-message";
import { revalidatePath } from "next/cache";
import { db } from "./firebase";
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import type { Calculation } from "./types";

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

export async function saveCalculationAction(data: { name1: string; name2: string; percentage: number; message: string; }) {
    if (!db) {
        console.log("Database not configured. Skipping save.");
        return { success: false, error: "Database not configured." };
    }
  try {
    await addDoc(collection(db, "calculations"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    revalidatePath("/history");
    return { success: true };
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    return { success: false, error: "Could not save the result." };
  }
}

export async function getHistoryAction(): Promise<Calculation[]> {
    if (!db) {
        console.log("Database not configured. Returning empty history.");
        return [];
    }
  try {
    const q = query(collection(db, "calculations"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const history: Calculation[] = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() } as Calculation);
    });
    return history;
  } catch (error) {
    console.error("Error fetching from Firestore:", error);
    return [];
  }
}
