"use client";

import useSWR from "swr";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string | null;
};

export default function AdminUsersClient() {
  const { data: users, mutate } = useSWR<User[]>("/api/admin/users");
  const [saving, setSaving] = useState<string | null>(null);

  async function updateRole(id: string, role: string) {
    setSaving(id);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    await mutate();
    setSaving(null);
  }

  if (!users) return <p>Загрузка…</p>;

  return (
    <div className="space-y-4">
      {users.map((u: User) => (
        <div
          key={u.id}
          className="flex items-center gap-4 border p-4 rounded-md"
        >
          {u.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={u.image}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className="flex-1">
            <p className="font-medium">{u.name ?? "Без имени"}</p>
            <p className="text-sm text-muted-foreground">{u.email}</p>
          </div>
          <Select
            value={u.role ?? "user"}
            onValueChange={(val) => updateRole(u.id, val)}
            disabled={saving === u.id}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">user</SelectItem>
              <SelectItem value="admin">admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
