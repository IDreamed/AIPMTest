import { AppShell } from "./components/ui";
import { CoursePreviewPage, HomePage, NewsPage } from "./pages/HomePages";
import { PaperAnalysisPage, PaperAnswerPage, PaperCenterPage } from "./pages/PaperPages";
import { ExamAnswerPage, ExamCenterPage, ExamDetailPage } from "./pages/ExamPages";
import {
  ClassDetailPage,
  ClassExamAnswerPage,
  ClassExamPage,
  CourseStudyPage,
  LearningCenterPage,
  LearningRecordPage,
  QAPage,
  WrongBookPage,
} from "./pages/LearningPages";
import { LoginPage, ProfilePage, SchoolApplyPage } from "./pages/ProfilePages";
import { useEffect, useState } from "react";

const routes = {
  "#/": HomePage,
  "#/news": NewsPage,
  "#/course-preview": CoursePreviewPage,
  "#/papers": PaperCenterPage,
  "#/paper-answer": PaperAnswerPage,
  "#/paper-analysis": PaperAnalysisPage,
  "#/exams": ExamCenterPage,
  "#/exam-detail": ExamDetailPage,
  "#/exam-answer": ExamAnswerPage,
  "#/learning": LearningCenterPage,
  "#/class-detail": ClassDetailPage,
  "#/class-exam": ClassExamPage,
  "#/class-exam-answer": ClassExamAnswerPage,
  "#/course-study": CourseStudyPage,
  "#/qa": QAPage,
  "#/wrong-book": WrongBookPage,
  "#/learning-record": LearningRecordPage,
  "#/profile": ProfilePage,
  "#/school-apply": SchoolApplyPage,
  "#/login": LoginPage,
};

export default function App() {
  const [hash, setHash] = useState(window.location.hash || "#/");

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const normalizedHash = hash.split("?")[0];
  const Page = routes[normalizedHash] || HomePage;

  return (
    <AppShell>
      <Page />
    </AppShell>
  );
}
