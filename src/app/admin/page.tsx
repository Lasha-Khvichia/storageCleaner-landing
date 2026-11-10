import { redirect } from "next/navigation";
import { adminApi } from "@/admin/admin-api";
import { getAdminContext } from "@/admin/current-admin";
import { AdminHeader } from "./_components/AdminHeader";
import { AuditLog } from "./_components/AuditLog";
import { ErrorNote } from "./_components/ErrorNote";
import { NotConfigured } from "./_components/NotConfigured";
import { ReleaseTable } from "./_components/ReleaseTable";
import { SyncPanel } from "./_components/SyncPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const context = await getAdminContext();
  if (context.state === "unconfigured") return <NotConfigured />;
  if (context.state === "anonymous") redirect("/admin/login");
  const { apiUrl, serviceKey } = context.config;
  const api = adminApi({ apiUrl, serviceKey, token: context.session.token });
  const [releases, status, audit] = await Promise.all([api.releases(), api.syncStatus(), api.audit(50)]);
  return (
    <>
      <AdminHeader login={context.session.login} />
      {!releases.ok && <ErrorNote title="Versions" message={releases.message} />}
      <SyncPanel status={status.ok ? status.data : null} />
      {releases.ok && <ReleaseTable releases={releases.data} />}
      {audit.ok ? <AuditLog entries={audit.data} /> : <ErrorNote title="Audit log" message={audit.message} />}
    </>
  );
}
