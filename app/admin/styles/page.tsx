import fs from "fs";
import path from "path";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminStylesPage() {
  const stylesDir = path.join(process.cwd(), "public", "images", "styles");
  let styleFiles: string[] = [];
  try {
    styleFiles = fs.readdirSync(stylesDir).filter((f) => f.endsWith(".png"));
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Стили (только просмотр)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
            {styleFiles.map((file) => {
              const name = file.replace(/\.png$/, "");
              return (
                <div key={file} className="flex flex-col items-center gap-2">
                  <Image
                    src={`/images/styles/${file}`}
                    alt={name}
                    width={64}
                    height={64}
                  />
                  <span className="text-xs text-center">{name}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 