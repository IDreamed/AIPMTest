import { AppShell } from "./components/ui";
import { CoursePreviewPage, HomePage, NewsPage } from "./pages/HomePages";
import { PaperAnalysisPage, PaperAnswerPage } from "./pages/PaperPages";
import { ExamAnalysisPage, ExamAnswerPage, ExamCenterPage, ExamDetailPage, ExamRankPage, MyExamsPage } from "./pages/ExamPages";
import { AdminDashboardPage, AdminNewsCreatePage, AdminNewsEditPage, AdminNewsPage, AdminNewsPreviewPage, AdminRecommendCoursesPage } from "./pages/AdminPages";
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
  PaperPracticePage,
  QADetailPage,
  QAPage,
  WrongBookPage,
  WrongPracticePage,
  WrongQuestionPage,
} from "./pages/LearningPages";
import { LoginPage, ProfilePage } from "./pages/ProfilePages";
import { ApplicationGuidePage, VirtualTrainingPage } from "./pages/ServicePages";
import { TeacherDashboardPage } from "./pages/TeacherPages";
import { useEffect, useState } from "react";

const routes = {
  "#/": HomePage,
  "#/news": NewsPage,
  "#/course-preview": CoursePreviewPage,
  "#/application-guide": ApplicationGuidePage,
  "#/virtual-training": VirtualTrainingPage,
  "#/papers": PaperPracticePage,
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
  "#/login": LoginPage,
  "#/teacher": TeacherDashboardPage,
  "#/admin": AdminDashboardPage,
  "#/admin/news": AdminNewsPage,
  "#/admin/news/new": AdminNewsCreatePage,
  "#/admin/news/edit": AdminNewsEditPage,
  "#/admin/news/preview": AdminNewsPreviewPage,
  "#/admin/recommend-courses": AdminRecommendCoursesPage,
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
  const isAdminRoute = normalizedHash.startsWith("#/admin");

  if (isAdminRoute) {
    return <Page />;
  }

  return (
    <AppShell>
      <Page />
    </AppShell>
  );
}
