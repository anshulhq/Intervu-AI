import QuestionSelector from "@/components/interview/QuestionSelector";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Select Topic | Intervu AI",
  description: "Select your desired interview topic before starting your session.",
};

export default function SelectQuestionPage() {
  return (
    <main className="min-h-screen bg-[#030303] overflow-x-hidden">
      <QuestionSelector />
    </main>
  );
}
