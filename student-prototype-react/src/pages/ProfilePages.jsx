import { useState } from "react";
import { Button, Card, Meta, Modal, PageHeader, Tag, usePrototypeRole } from "../components/ui";

const schoolApplication = {
  school: "示范中职学校",
  identity: "学生身份",
  target: "高三计算机冲刺班",
  status: "审核中",
  tone: "amber",
  submittedAt: "2026-05-02",
  result: "学校正在审核证明材料，请等待处理结果。",
};

export function ProfilePage() {
  const { openSchoolApply, roleKey } = usePrototypeRole();
  const [reviewOpen, setReviewOpen] = useState(false);
  const profileName = roleKey === "visitor" ? "" : "刘同学";
  const schoolReviewState = roleKey === "student" ? "approved" : roleKey === "registered" ? "pending" : "none";
  const schoolReview = getSchoolReview(schoolReviewState);

  return (
    <>
      <PageHeader title="个人中心" />
      <Card className="p-0">
        <SectionTitle action={<button className="rounded-ui bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700" type="button">保存</button>} title="基本信息" />
        <div className="grid gap-6 p-5 lg:grid-cols-[120px_1fr]">
          <div className="flex justify-center lg:justify-start">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 text-3xl font-semibold text-blue-700">
              刘
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
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {schoolReview.tag ? <Tag tone={schoolReview.tagTone}>{schoolReview.tag}</Tag> : null}
                {schoolReview.canView ? (
                  <button className="text-sm text-blue-600 hover:text-blue-700" onClick={() => setReviewOpen(true)} type="button">
                    查看审核
                  </button>
                ) : null}
                {schoolReview.canApply ? (
                  <button className="text-sm text-blue-600 hover:text-blue-700" onClick={openSchoolApply} type="button">
                    加入学校
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

      <ReviewDetailModal open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </>
  );
}

function getSchoolReview(state) {
  const reviews = {
    none: { school: "无", canApply: true },
    pending: { school: "无", tag: "审核中", tagTone: "amber", canView: true },
    approved: { school: "示范中职学校", tag: "已认证", tagTone: "green" },
    rejected: { school: "无", tag: "已驳回", tagTone: "red", canApply: true, canView: true },
  };

  return reviews[state] || reviews.none;
}

function ReviewDetailModal({ open, onClose }) {
  return (
    <Modal open={open} title="审核信息" onClose={onClose}>
      <div className="grid gap-4 text-sm">
        <div className="grid gap-3 rounded-ui border border-line p-4 md:grid-cols-2">
          <InfoItem label="申请学校" value={schoolApplication.school} />
          <InfoItem label="申请身份" value={schoolApplication.identity} />
          <InfoItem label="申请班级" value={schoolApplication.target} />
          <InfoItem label="提交时间" value={schoolApplication.submittedAt} />
        </div>
        <div className="rounded-ui bg-amber-50 px-3 py-2 leading-6 text-amber-800">
          {schoolApplication.result}
        </div>
        <Meta><Tag tone={schoolApplication.tone}>{schoolApplication.status}</Tag></Meta>
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
      <PageHeader title="入校申请/审核状态" desc="申请信息并入个人中心，字段保持精简：选择学校、选择专业、填写理由。" />
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <h3>提交入校申请</h3>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">选择学校<select className="min-h-10 rounded-ui border border-line px-3"><option>示范中职学校</option><option>东方职业学校</option><option>直属平台班级</option></select></label>
            <label className="grid gap-2">选择专业<select className="min-h-10 rounded-ui border border-line px-3"><option>计算机应用类</option><option>财经商贸类</option><option>旅游服务类</option></select></label>
            <label className="grid gap-2">申请理由<textarea className="min-h-28 rounded-ui border border-line p-3" placeholder="请填写申请入校或加入班级的原因" /></label>
            <Button>提交申请</Button>
          </div>
        </Card>
        <Card>
          <h3>审核状态</h3>
          <p className="leading-7 text-muted">当前申请：示范中职学校 · 计算机应用类。</p>
          <Meta><Tag tone="amber">审核中</Tag><Tag>提交于 2026-04-27</Tag></Meta>
          <div className="mt-5 rounded-ui border border-line border-l-blue-600 bg-white p-4 text-slate-700">审核通过后，学生会加入对应班级，并获得该班级课程、考试和绑定大类试卷权限。</div>
        </Card>
      </div>
    </>
  );
}

export function LoginPage() {
  const { setRoleKey } = usePrototypeRole();

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card>
        <h1 className="text-2xl">账号登录</h1>
        <p className="leading-7 text-muted">登录后可查看学习进度、考试安排、试卷练习和答疑记录。</p>
        <div className="mt-5 grid gap-4">
          <input className="min-h-10 rounded-ui border border-line px-3" placeholder="手机号/账号" />
          <input className="min-h-10 rounded-ui border border-line px-3" type="password" placeholder="密码" />
          <Button href="#/learning" onClick={() => setRoleKey("student")}>登录并进入学习中心</Button>
        </div>
      </Card>
      <Card>
        <h1 className="text-2xl">注册账号</h1>
        <p className="leading-7 text-muted">注册后可提交入校申请，审核通过后进入班级学习。</p>
        <div className="mt-5 grid gap-4">
          <input className="min-h-10 rounded-ui border border-line px-3" placeholder="手机号" />
          <input className="min-h-10 rounded-ui border border-line px-3" placeholder="验证码" />
          <Button href="#/school-apply" tone="ghost" onClick={() => setRoleKey("registered")}>注册后完善申请</Button>
        </div>
      </Card>
    </div>
  );
}
