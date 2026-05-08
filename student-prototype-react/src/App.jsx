import { AppShell } from "./components/ui";
import { CoursePreviewPage, HomePage, NewsPage } from "./pages/HomePages";
import { PaperAnalysisPage, PaperAnswerPage, PaperCenterPage } from "./pages/PaperPages";
import { ExamAnalysisPage, ExamAnswerPage, ExamCenterPage, ExamDetailPage, ExamRankPage } from "./pages/ExamPages";
import {
  ClassDetailPage,
  ClassCoursesPage,
  ClassExamAnalysisPage,
  ClassExamAnswerPage,
  ClassExamDetailPage,
  ClassExamPage,
  CourseLessonPage,
  CourseMaterialPage,
  CourseStudyPage,
  LearningCenterPage,
  LearningRecordPage,
  MyExamsPage,
  PaperPracticePage,
  QADetailPage,
  QAPage,
  WrongBookPage,
  WrongPracticePage,
  WrongQuestionPage,
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
  "#/exam-rank": ExamRankPage,
  "#/exam-analysis": ExamAnalysisPage,
  "#/exam-answer": ExamAnswerPage,
  "#/learning": LearningCenterPage,
  "#/class-detail": ClassDetailPage,
  "#/class-courses": ClassCoursesPage,
  "#/class-exam": ClassExamPage,
  "#/class-exam-detail": ClassExamDetailPage,
  "#/class-exam-analysis": ClassExamAnalysisPage,
  "#/class-exam-answer": ClassExamAnswerPage,
  "#/course-lesson": CourseLessonPage,
  "#/course-material": CourseMaterialPage,
  "#/course-study": CourseStudyPage,
  "#/paper-practice": PaperPracticePage,
  "#/my-exams": MyExamsPage,
  "#/qa-detail": QADetailPage,
  "#/qa": QAPage,
  "#/wrong-book": WrongBookPage,
  "#/wrong-question": WrongQuestionPage,
  "#/wrong-practice": WrongPracticePage,
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
