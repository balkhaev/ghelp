"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import BuildMetrics from "@/components/BuildMetrics";
import Link from "next/link";

interface Build {
  talents: Record<string, string>;
  branch: Record<string, string>;
  shard: string | null;
  crit_importance: string | null;
  power: string | number | null;
}

interface HeroBuildsProps {
  builds: Build[];
  selectedIndex?: number;
}


const labels: Record<string, string> = {
  main1: "Основной",
  main2: "Дополнительный",
  alt: "Альтернативный",
};

export default function HeroBuilds({ builds, selectedIndex = 0 }: HeroBuildsProps) {
  if (!builds || builds.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm">
        Билдов для этого героя пока нет
      </p>
    );
  }

  return (
    <Tabs defaultValue={selectedIndex.toString()} className="w-full">
      <TabsList className="mx-auto mb-4 flex-wrap">
        {builds.map((_, idx) => (
          <TabsTrigger key={idx} value={idx.toString()} className="px-4">
            Билд {idx + 1}
          </TabsTrigger>
        ))}
      </TabsList>

      {builds.map((build, idx) => (
        <TabsContent key={idx} value={idx.toString()} className="space-y-6">
          {/* Metrics cards row */}
          <BuildMetrics shard={build.shard} crit_importance={build.crit_importance} power={build.power} />

          {/* Talents & Branch cards */}
          <div className="flex flex-row gap-6">
            {/* Talents */}
            <Card className="w-[170px]">
              <CardHeader>
                <CardTitle>Таланты</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {Object.entries(build.talents).map(([level, choice]) => (
                    <Card key={level} className="p-2 text-center gap-0">
                      <CardTitle>Левел {level.replace("lvl", "")}</CardTitle>
                      <p className="text-sm mt-1">{choice}</p>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Branches */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Ветки</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row gap-4">
                {(["main1", "main2", "alt"] as const).map((branchKey) => {
                  const val = (build.branch as Record<string, string>)[branchKey];
                  if (!val) return null;
                  const styles = val.split("/").map((s) => s.trim());
                  return (
                    <div key={branchKey} className="flex-1">
                      <p className="font-medium mb-2 text-sm text-center">{labels[branchKey]}</p>
                      <div className="flex flex-col gap-2">
                        {styles.map((style) => (
                          <Link key={style} href={`/styles/${encodeURIComponent(style)}`} className="group">
                            <Card className="p-2 flex flex-col items-center gap-0 group-hover:ring-2 group-hover:ring-accent">
                              <Image src={`/images/styles/${style}.png`} alt={style} width={48} height={48} className="w-12 h-14" />
                              <p className="text-xs mt-1 text-center">{style}</p>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
} 