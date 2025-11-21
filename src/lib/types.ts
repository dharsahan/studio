import type { Timestamp } from "firebase/firestore";

export type Calculation = {
  id: string;
  name1: string;
  name2: string;
  percentage: number;
  message: string;
  createdAt: Timestamp;
};
