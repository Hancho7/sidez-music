// components/users/UsersHeader.tsx
import { UserPlus, Shield } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  onInvite: () => void;
  onCreateRole: () => void;
}

export default function UsersHeader({ onInvite, onCreateRole }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Admin
        </div>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-tight leading-tight">Users</h1>
        <p className="mt-1.5 text-sm text-muted">Manage administrators, staff members, roles, and permissions.</p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="secondary" size="md" icon={<Shield size={14} />} onClick={onCreateRole}>Create Role</Button>
        <Button variant="primary" size="md" icon={<UserPlus size={14} />} onClick={onInvite}>Invite User</Button>
      </div>
    </div>
  );
}
