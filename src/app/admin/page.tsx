import { redirect } from "next/navigation";
import { adminApi } from "@/admin/admin-api";
import { getAdminContext } from "@/admin/current-admin";
import { adminHref, clampPage, parsePageParam } from "@/admin/paging";
import { AdminHeader } from "./_components/AdminHeader";
import { AuditLog } from "./_components/AuditLog";
import { ErrorNote } from "./_components/ErrorNote";
import { NotConfigured } from "./_components/NotConfigured";
import { Pager } from "./_components/Pager";
import { ReleaseTable } from "./_components/ReleaseTable";
import { SyncPanel } from "./_components/SyncPanel";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const context = await getAdminContext();
  if (context.state === "unconfigured") return <NotConfigured />;
  if (context.state === "anonymous") redirect("/admin/login");
  const query = await searchParams;
  const pages = { versions: parsePageParam(query.versions), audit: parsePageParam(query.audit) };
  const { apiUrl, serviceKey } = context.config;
  const api = adminApi({ apiUrl, serviceKey, token: context.session.token });
  const [releases, status, audit] = await Promise.all([
    api.releases(pages.versions),
    api.syncStatus(),
    api.audit(pages.audit),
  ]);
  const clamped = {
    versions: releases.ok ? clampPage(pages.versions, releases.data.total) : pages.versions,
    audit: audit.ok ? clampPage(pages.audit, audit.data.total) : pages.audit,
  };
  if (clamped.versions !== pages.versions || clamped.audit !== pages.audit) redirect(adminHref(clamped));
  return (
    <>
      <AdminHeader login={context.session.login} />
      {!releases.ok && <ErrorNote title="Versions" message={releases.message} />}
      <SyncPanel status={status.ok ? status.data : null} />
      {releases.ok && (
        <>
          <ReleaseTable releases={releases.data.items} />
          <Pager label="Versions pages" param="versions" pages={pages} total={releases.data.total} />
        </>
      )}
      {audit.ok ? (
        <>
          <AuditLog entries={audit.data.items} />
          <Pager label="Audit log pages" param="audit" pages={pages} total={audit.data.total} />
        </>
      ) : (
        <ErrorNote title="Audit log" message={audit.message} />
      )}
    </>
  );
}
