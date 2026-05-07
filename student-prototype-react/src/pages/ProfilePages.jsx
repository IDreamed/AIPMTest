import { Button, Card, Meta, PageHeader, PrototypeNote, Tag, usePrototypeRole } from "../components/ui";

export function ProfilePage() {
  const { roleKey } = usePrototypeRole();
  const isStudent = roleKey === "student";
  const isRegistered = roleKey === "registered";

  return (
    <>
      <PageHeader title="个人中心" desc="处理专业选择、入校申请、审核状态、我的班级和开通咨询。" action={<Button href="#/school-apply">提交入校申请</Button>} />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><h3>基本信息</h3><p className="leading-7 text-muted">{roleKey === "visitor" ? "游客暂未登录" : "张同学 · 138****0000"}</p><Meta><Tag tone={roleKey === "visitor" ? "amber" : "green"}>{roleKey === "visitor" ? "未登录" : "已登录"}</Tag></Meta></Card>
        <Card><h3>当前专业</h3><p className="leading-7 text-muted">{roleKey === "visitor" ? "未选择" : "电子与信息类"}</p><Meta><Tag tone={roleKey === "visitor" ? "gray" : "blue"}>{roleKey === "visitor" ? "未选择" : "已选择"}</Tag></Meta><PrototypeNote className="mt-3">{roleKey === "visitor" ? "登录后选择专业，再提交入校申请。" : "没有班级前需要先选择专业，再提交入校申请。"}</PrototypeNote></Card>
        <Card><h3>入校申请</h3><p className="leading-7 text-muted">{isStudent ? "示范中职学校 · 高三计算机冲刺班，已通过审核。" : isRegistered ? "示范中职学校 · 高三计算机冲刺班方向。" : "注册后可提交学校、专业和申请理由。"}</p><Meta><Tag tone={isStudent ? "green" : isRegistered ? "amber" : "gray"}>{isStudent ? "已通过" : isRegistered ? "审核中" : "未提交"}</Tag></Meta></Card>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card><h3>我的班级</h3><p className="leading-7 text-muted">{isStudent ? "高三计算机冲刺班、文化课周末提升班" : "暂无班级"}</p><PrototypeNote className="mt-3">{isStudent ? "班级决定课程、考试和试卷大类权限。" : "审核通过或管理员开通后，这里展示学生已加入的班级。"}</PrototypeNote><Meta><Button href={isStudent ? "#/learning" : "#/school-apply"} tone="ghost">{isStudent ? "进入学习中心" : "申请加入班级"}</Button></Meta></Card>
        <Card><h3>开通咨询</h3><p className="leading-7 text-muted">联系管理员</p><PrototypeNote className="mt-3">暂无班级或无对应大类权限时，请联系管理员开通或申请入校。</PrototypeNote><div className="mt-4 grid h-32 w-32 place-items-center rounded-ui border-[10px] border-white bg-[repeating-linear-gradient(90deg,#111_0_9px,transparent_9px_18px),repeating-linear-gradient(0deg,#111_0_9px,transparent_9px_18px)] shadow-lift" /></Card>
      </div>
    </>
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
        <p className="leading-7 text-muted">登录后根据用户状态跳转：无班级进入个人中心，有班级进入学习中心，从试卷或考试进入则返回原页面继续判断权限。</p>
        <div className="mt-5 grid gap-4">
          <input className="min-h-10 rounded-ui border border-line px-3" placeholder="手机号/账号" />
          <input className="min-h-10 rounded-ui border border-line px-3" type="password" placeholder="密码" />
          <Button href="#/learning" onClick={() => setRoleKey("student")}>登录并进入学习中心</Button>
        </div>
      </Card>
      <Card>
        <h1 className="text-2xl">注册账号</h1>
        <p className="leading-7 text-muted">注册后只是普通用户。需要选择专业，并通过入校申请或联系管理员开通班级权限后，才能学习班级课程和刷对应大类试卷。</p>
        <div className="mt-5 grid gap-4">
          <input className="min-h-10 rounded-ui border border-line px-3" placeholder="手机号" />
          <input className="min-h-10 rounded-ui border border-line px-3" placeholder="验证码" />
          <Button href="#/school-apply" tone="ghost" onClick={() => setRoleKey("registered")}>注册后完善申请</Button>
        </div>
      </Card>
    </div>
  );
}
