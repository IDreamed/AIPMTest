import { useEffect, useState } from "react";
import { Button, Card, Meta, Modal, PageHeader, PrototypeNote, Tag, usePrototypeRole } from "../components/ui";
import { platformSchools, professionalCategories } from "../data/mockData";

const schoolApplications = {
  pending: {
    school: "示范中职学校",
    targetMajor: "电子与信息类",
    status: "审核中",
    tone: "amber",
    submittedAt: "2026-05-02",
    reviewedAt: "-",
    result: "入校认证审核中，请等待学校审核。",
  },
  approved: {
    school: "示范中职学校",
    targetMajor: "电子与信息类",
    className: "高三计算机冲刺班",
    status: "已认证",
    tone: "green",
    submittedAt: "2026-05-02",
    reviewedAt: "2026-05-03",
    result: "认证已通过，当前账号已加入学校和班级。",
  },
  rejected: {
    school: "示范中职学校",
    targetMajor: "电子与信息类",
    status: "认证未通过",
    tone: "red",
    submittedAt: "2026-05-02",
    reviewedAt: "2026-05-03",
    result: "学校未查询到对应学生信息，请核对学校和目标专业后再次提交。",
  },
};

export function ProfilePage() {
  const { openSchoolApply, roleKey } = usePrototypeRole();
  const [reviewOpen, setReviewOpen] = useState(false);
  const isTeacher = roleKey === "teacher";
  const profileName = roleKey === "visitor" ? "" : isTeacher ? "王老师" : "刘同学";
  const schoolReviewState = roleKey === "student" ? "approved" : roleKey === "registered" ? "pending" : roleKey === "rejected" ? "rejected" : "none";
  const schoolReview = getSchoolReview(schoolReviewState);

  return (
    <>
      <PageHeader title="个人中心" />
      <PrototypeNote>基本信息来自当前登录账号；教师身份不使用学生入校认证和班级字段，教师组织归属字段待开发确认。</PrototypeNote>
      <Card className="p-0">
        <SectionTitle action={<button className="rounded-ui bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700" type="button">保存</button>} title="基本信息" />
        <div className="grid gap-6 p-5 lg:grid-cols-[120px_1fr]">
          <div className="flex justify-center lg:justify-start">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 text-3xl font-semibold text-blue-700">
              {isTeacher ? "王" : "刘"}
            </div>
          </div>
          <div className="grid gap-4">
            <input className="min-h-10 max-w-md rounded-ui border border-line px-3" defaultValue={profileName} placeholder="请输入姓名" />
            <input className="min-h-10 max-w-md rounded-ui border border-line px-3 text-muted" defaultValue="暂无个人简介" />
            <div className="grid gap-4 md:grid-cols-[minmax(0,280px)_1fr] md:items-center">
              <label className="grid gap-2 text-sm">
                手机号：
                <input className="min-h-10 rounded-ui border border-line bg-slate-50 px-3" defaultValue={roleKey === "visitor" ? "" : "13353739191"} />
              </label>
              <fieldset className="flex flex-wrap items-center gap-4 text-sm">
                <legend className="mr-1 inline font-normal">性别：</legend>
                {["男", "女", "保密"].map((item) => (
                  <label className="flex items-center gap-1" key={item}>
                    <input defaultChecked={item === "保密"} name="gender" type="radio" />
                    {item}
                  </label>
                ))}
              </fieldset>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="grid min-w-[240px] gap-2 text-sm">
                所属学校：
                <span className="inline-flex min-h-10 items-center rounded-ui border border-line bg-slate-50 px-3 text-slate-700">
                  {schoolReview.school}
                </span>
              </label>
              <label className="grid min-w-[240px] gap-2 text-sm">
                {isTeacher ? "身份：" : "目标专业："}
                <span className="inline-flex min-h-10 items-center rounded-ui border border-line bg-slate-50 px-3 text-slate-700">
                  {isTeacher ? "教师" : schoolReview.targetMajor}
                </span>
              </label>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {schoolReview.tag ? <Tag tone={schoolReview.tagTone}>{schoolReview.tag}</Tag> : null}
                {!isTeacher && schoolReview.canView ? (
                  <button className="text-sm text-blue-600 hover:text-blue-700" onClick={() => setReviewOpen(true)} type="button">
                    查看审核
                  </button>
                ) : null}
                {!isTeacher && schoolReview.canApply ? (
                  <button className="text-sm text-blue-600 hover:text-blue-700" onClick={openSchoolApply} type="button">
                    再次申请入校
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-0">
        <SectionTitle title="账户安全" />
        <div className="grid gap-4 p-5">
          <SecurityRow action="修改密码" label="账号密码" text="可修改当前账号密码" />
          <SecurityRow action="微信解绑" label="微信绑定" text="已绑定" tone="success" />
          <SecurityRow action="修改手机号" label="修改手机号" text="可更新当前绑定手机号" />
        </div>
      </Card>

      <ReviewDetailModal application={schoolReview.application} open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </>
  );
}

function getSchoolReview(state) {
  const pending = schoolApplications.pending;
  const approved = schoolApplications.approved;
  const rejected = schoolApplications.rejected;
  const reviews = {
    none: { school: "无", targetMajor: "无" },
    pending: { school: pending.school, targetMajor: pending.targetMajor, tag: pending.status, tagTone: pending.tone, canView: true, application: pending },
    approved: { school: approved.school, targetMajor: approved.targetMajor, tag: approved.status, tagTone: approved.tone, canView: true, application: approved },
    rejected: { school: rejected.school, targetMajor: rejected.targetMajor, tag: rejected.status, tagTone: rejected.tone, canApply: true, canView: true, application: rejected },
  };

  return reviews[state] || reviews.none;
}

function ReviewDetailModal({ application = schoolApplications.pending, open, onClose }) {
  return (
    <Modal open={open} title="审核信息" onClose={onClose}>
      <div className="grid gap-4 text-sm">
        <div className="grid gap-3 rounded-ui border border-line p-4 md:grid-cols-2">
          <InfoItem label="申请学校" value={application.school} />
          <InfoItem label="目标专业" value={application.targetMajor} />
          <InfoItem label="审核班级" value={application.className || "待学校分配"} />
          <InfoItem label="提交时间" value={application.submittedAt} />
          <InfoItem label="审核时间" value={application.reviewedAt} />
        </div>
        <div className={`rounded-ui px-3 py-2 leading-6 ${
          application.tone === "red" ? "bg-red-50 text-red-700" : application.tone === "green" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-800"
        }`}>
          {application.result}
        </div>
        <Meta><Tag tone={application.tone}>{application.status}</Tag></Meta>
      </div>
    </Modal>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <span className="block text-xs text-muted">{label}</span>
      <strong className="mt-1 block text-slate-800">{value}</strong>
    </div>
  );
}

function SectionTitle({ title, action }) {
  return (
    <div className="grid min-h-14 grid-cols-[1fr_auto_1fr] items-center border-b border-line px-5 py-2">
      <span />
      <h2 className="m-0 text-base font-semibold">{title}</h2>
      <div className="flex justify-end">{action}</div>
    </div>
  );
}

function SecurityRow({ label, text, action, tone = "primary" }) {
  const buttonClass = tone === "success"
    ? "border-green-100 bg-green-50 text-green-700 hover:bg-green-100"
    : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700";

  return (
    <div className="grid gap-3 rounded-ui border border-line p-3 md:grid-cols-[120px_1fr_120px] md:items-center">
      <strong className="text-sm">{label}</strong>
      <span className="text-sm text-muted">{text}</span>
      <button className={`min-h-10 rounded-ui border px-4 text-sm ${buttonClass}`} type="button">
        {action}
      </button>
    </div>
  );
}

export function SchoolApplyPage() {
  return (
    <>
      <PageHeader title="入校认证" desc="新用户注册时提交学校和专业信息；审核未通过时可在个人中心重新申请。" />
      <Card>
        <h2 className="m-0 text-xl">完成入校认证后使用学生功能</h2>
        <p className="mb-0 mt-3 leading-7 text-muted">新用户在注册时选择学校和目标专业；认证未通过的用户可在个人中心再次申请入校。</p>
        <Meta><Button href="#/login">登录/注册</Button><Button href="#/profile" tone="secondary">个人中心</Button></Meta>
      </Card>
    </>
  );
}

export function LoginPage() {
  const { setRoleKey } = usePrototypeRole();
  const [activeMode, setActiveMode] = useState("login");
  const [codeCountdown, setCodeCountdown] = useState(0);

  useEffect(() => {
    if (codeCountdown <= 0) return undefined;
    const timer = window.setTimeout(() => setCodeCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [codeCountdown]);

  function sendRegisterCode() {
    if (codeCountdown > 0) return;
    setCodeCountdown(60);
  }

  return (
    <div className="mx-auto grid max-w-[520px] gap-5">
      <Card className="p-0">
        <div className="border-b border-line px-6 py-5 text-center">
          <h1 className="m-0 text-2xl">账号登录/注册</h1>
          <p className="mb-0 mt-2 text-sm leading-6 text-muted">登录后进入学习平台；新用户注册时同步提交入校认证。</p>
        </div>

        <div className="grid grid-cols-2 border-b border-line p-2">
          {[
            ["login", "登录"],
            ["register", "注册"],
          ].map(([key, label]) => (
            <button
              className={`min-h-10 rounded-ui text-sm ${activeMode === key ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-50"}`}
              key={key}
              onClick={() => setActiveMode(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 p-6">
          {activeMode === "login" ? (
            <>
              <label className="grid gap-2 text-sm">
                手机号/账号
                <input className="min-h-10 rounded-ui border border-line px-3" placeholder="请输入手机号或账号" />
              </label>
              <label className="grid gap-2 text-sm">
                密码
                <input className="min-h-10 rounded-ui border border-line px-3" placeholder="请输入密码" type="password" />
              </label>
              <Button href="#/learning" onClick={() => setRoleKey("student")}>登录</Button>
              <button className="text-sm text-blue-600 hover:text-blue-700" onClick={() => setActiveMode("register")} type="button">
                还没有账号？立即注册
              </button>
            </>
          ) : (
            <>
              <label className="grid gap-2 text-sm">
                申请的学校
                <select className="min-h-10 rounded-ui border border-line bg-white px-3" defaultValue="">
                  <option value="" disabled>请选择申请的学校</option>
                  {platformSchools.map((school) => <option key={school}>{school}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm">
                目标专业
                <select className="min-h-10 rounded-ui border border-line bg-white px-3" defaultValue="">
                  <option value="" disabled>请选择目标专业</option>
                  {professionalCategories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm">
                手机号
                <input className="min-h-10 rounded-ui border border-line px-3" placeholder="请输入手机号" />
              </label>
              <label className="grid gap-2 text-sm">
                验证码
                <span className="grid gap-2 sm:grid-cols-[1fr_128px]">
                  <input className="min-h-10 rounded-ui border border-line px-3" placeholder="请输入验证码" />
                  <button
                    className="min-h-10 rounded-ui border border-blue-600 bg-white px-3 text-sm text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-line disabled:bg-slate-50 disabled:text-muted"
                    disabled={codeCountdown > 0}
                    onClick={sendRegisterCode}
                    type="button"
                  >
                    {codeCountdown > 0 ? `${codeCountdown}s 后重发` : "发送验证码"}
                  </button>
                </span>
              </label>
              <label className="grid gap-2 text-sm">
                密码
                <input className="min-h-10 rounded-ui border border-line px-3" placeholder="请设置登录密码" type="password" />
              </label>
              <label className="grid gap-2 text-sm">
                确认密码
                <input className="min-h-10 rounded-ui border border-line px-3" placeholder="请再次输入密码" type="password" />
              </label>
              <Button href="#/profile" tone="ghost" onClick={() => setRoleKey("registered")}>注册并提交认证</Button>
              <button className="text-sm text-blue-600 hover:text-blue-700" onClick={() => setActiveMode("login")} type="button">
                已有账号？返回登录
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
