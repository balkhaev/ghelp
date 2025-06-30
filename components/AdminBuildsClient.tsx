"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Build {
  id?: number;
  talents: Record<string, string>;
  branch: Record<string, string>;
  shard: string | null;
  crit_importance: string | null;
  power: string | number | null;
}

interface Hero {
  id: number;
  name: string;
  builds: Build[];
}

export default function AdminBuildsClient({ heroes }: { heroes: Hero[] }) {
  const [selectedHeroId, setSelectedHeroId] = useState<number>(heroes[0]?.id ?? 0);
  const [localHeroes, setLocalHeroes] = useState<Hero[]>(heroes);

  const selectedHero = localHeroes.find((h) => h.id === selectedHeroId);

  if (!selectedHero) {
    return <p>Нет героев для отображения</p>;
  }

  // Обработчик изменения поля билда
  const handleBuildChange = (
    buildIndex: number,
    field: keyof Build,
    value: any
  ) => {
    setLocalHeroes((prev) =>
      prev.map((h) => {
        if (h.id !== selectedHeroId) return h;
        const updatedBuilds = [...h.builds];
        const b = { ...updatedBuilds[buildIndex] } as any;
        if (field === "talents" || field === "branch") {
          try {
            b[field] = JSON.parse(value);
          } catch (e) {
            // оставляем строковое значение, пользователь ещё печатает
            b[field] = value;
          }
        } else {
          b[field] = value;
        }
        updatedBuilds[buildIndex] = b;
        return { ...h, builds: updatedBuilds };
      })
    );
  };

  // Сохранение билда в Supabase
  const saveBuild = async (build: Build) => {
    if (!build.id) {
      // insert
      const { id: _ignore, ...rest } = build as any;
      const { error } = await supabase.from("builds").insert({
        hero_id: selectedHeroId,
        ...rest,
      } as any);
      if (error) {
        toast.error("Ошибка сохранения: " + error.message);
      } else {
        toast.success("Билд добавлен");
      }
    } else {
      const { id: _ignore, ...rest } = build as any;
      const { error } = await supabase
        .from("builds")
        .update(rest as any)
        .eq("id", build.id);
      if (error) {
        toast.error("Ошибка сохранения: " + error.message);
      } else {
        toast.success("Билд сохранён");
      }
    }
  };

  const deleteBuild = async (buildId?: number) => {
    if (!buildId) return;
    const { error } = await supabase.from("builds").delete().eq("id", buildId);
    if (error) {
      toast.error("Ошибка удаления: " + error.message);
    } else {
      toast.success("Удалено");
      setLocalHeroes((prev) =>
        prev.map((h) =>
          h.id === selectedHeroId
            ? { ...h, builds: h.builds.filter((b) => b.id !== buildId) }
            : h
        )
      );
    }
  };

  const addNewBuild = () => {
    const newBuild: Build = {
      talents: {
        lvl5: "",
        lvl10: "",
        lvl15: "",
      },
      branch: {
        main1: "",
        main2: "",
        alt: "",
      },
      shard: null,
      crit_importance: null,
      power: null,
    };
    setLocalHeroes((prev) =>
      prev.map((h) =>
        h.id === selectedHeroId ? { ...h, builds: [...h.builds, newBuild] } : h
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Выбор героя */}
      <div className="flex items-center gap-4">
        <span>Герой:</span>
        <Select
          value={selectedHeroId.toString()}
          onValueChange={(v) => setSelectedHeroId(Number(v))}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Выберите героя" />
          </SelectTrigger>
          <SelectContent>
            {localHeroes.map((h) => (
              <SelectItem key={h.id} value={h.id!.toString()}>
                {h.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addNewBuild}>Добавить билд</Button>
      </div>

      {/* Таблица билдов */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Power</TableHead>
            <TableHead>Shard</TableHead>
            <TableHead>Crit</TableHead>
            <TableHead>Talents (JSON)</TableHead>
            <TableHead>Branch (JSON)</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedHero.builds.map((b, idx) => (
            <TableRow key={idx}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                <Input
                  value={b.power ?? ""}
                  onChange={(e) =>
                    handleBuildChange(idx, "power", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={b.shard ?? ""}
                  onChange={(e) =>
                    handleBuildChange(idx, "shard", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={b.crit_importance ?? ""}
                  onChange={(e) =>
                    handleBuildChange(idx, "crit_importance", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <textarea
                  className="border rounded p-2 w-64 h-32 text-xs"
                  value={JSON.stringify(b.talents, null, 2)}
                  onChange={(e) =>
                    handleBuildChange(idx, "talents", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <textarea
                  className="border rounded p-2 w-64 h-32 text-xs"
                  value={JSON.stringify(b.branch, null, 2)}
                  onChange={(e) =>
                    handleBuildChange(idx, "branch", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" onClick={() => saveBuild(b)}>
                  Сохранить
                </Button>
                {b.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteBuild(b.id)}
                  >
                    Удалить
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 