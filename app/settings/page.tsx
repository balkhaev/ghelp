import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/settings");
  }

  const { user } = session;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Настройки пользователя</h1>

      <div className="flex items-center gap-6 mb-8">
        {user?.image && (
          <Image
            src={user.image}
            alt="avatar"
            width={80}
            height={80}
            className="rounded-full"
          />
        )}
        <div>
          <p className="text-xl font-semibold">{user?.name}</p>
          {user?.email && <p className="text-muted-foreground">{user.email}</p>}
        </div>
      </div>

      {/* можно добавить дополнительные поля/формы настроек */}
      <p className="text-muted-foreground">
        Здесь будут различные пользовательские настройки…
      </p>
    </div>
  );
}
