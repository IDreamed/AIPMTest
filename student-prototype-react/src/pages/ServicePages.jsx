import { Card, PageHeader, PrototypeNote, Tag } from "../components/ui";

function PlaceholderPage({ title, desc, statusText, emptyTitle, emptyText }) {
  return (
    <>
      <PageHeader title={title} desc={desc} />
      <PrototypeNote>{title}的数据来源、字段结构和权限规则待开发确认。</PrototypeNote>
      <Card className="grid min-h-[360px] place-items-center text-center">
        <div className="max-w-lg">
          <Tag tone="blue">{statusText}</Tag>
          <h2 className="mb-0 mt-5 text-xl font-semibold text-slate-900">{emptyTitle}</h2>
          <p className="mb-0 mt-3 leading-7 text-muted">{emptyText}</p>
        </div>
      </Card>
    </>
  );
}

export function ApplicationGuidePage() {
  return (
    <PlaceholderPage
      title="报考指南"
      desc="查看职教高考报考政策、报名流程和备考信息。"
      statusText="报考服务"
      emptyTitle="暂未发布报考指南"
      emptyText="报考政策、报名时间和材料要求发布后，可在这里集中查看。"
    />
  );
}

export function VirtualTrainingPage() {
  return (
    <PlaceholderPage
      title="虚拟实训"
      desc="进入专业虚拟实训场景，开展技能学习与训练。"
      statusText="技能实训"
      emptyTitle="暂未安排虚拟实训"
      emptyText="学校发布实训任务后，可在这里查看任务要求并进入训练。"
    />
  );
}
