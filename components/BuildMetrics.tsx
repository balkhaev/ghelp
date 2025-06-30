"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BuildMetricsProps {
  shard: string | null;
  crit_importance: string | null;
  power: string | number | null;
}

function getPowerBadgeClass(powerVal: BuildMetricsProps["power"]) {
  if (powerVal === null || powerVal === undefined) return "bg-muted text-foreground";

  if (typeof powerVal === "string") {
    // оставляем только цифры
    const digits = powerVal.replace(/\D/g, "");

    // 3 и 4 вместе – показываем градиент
    if (digits === "34" || digits === "43") {
      return "bg-gradient-to-r from-yellow-400 to-green-500 text-black";
    }

    // используем первую цифру для числа
    if (digits.length > 0) {
      powerVal = Number(digits[0]);
    }
  }
  const p = typeof powerVal === "number" ? powerVal : Number(powerVal);
  if (isNaN(p)) return "bg-muted text-foreground";
  if (p >= 5) return "bg-red-600 text-white";
  if (p === 4) return "bg-yellow-400 text-black";
  if (p === 3) return "bg-green-600 text-white";
  if (p === 2) return "bg-gray-500 text-white";
  return "bg-muted text-foreground";
}

function getShardBadgeClass(shardVal: BuildMetricsProps["shard"]) {
  if (!shardVal) return "bg-gray-500 text-white";
  const val = shardVal.toLowerCase();
  if (val.includes("не нужен")) return "bg-gray-500 text-white";
  return "bg-green-900 text-white";
}

function getCritCardClass(critVal: BuildMetricsProps["crit_importance"]) {
  if (!critVal) return "bg-muted text-foreground";
  // извлекаем первую цифру
  const match = critVal.match(/(\d)/);
  const level = match ? Number(match[1]) : undefined;
  switch (level) {
    case 4:
      return "bg-gray-500 text-white";
    case 3:
      return "bg-blue-600 text-white";
    case 2:
      return "bg-yellow-400 text-black";
    case 1:
      return "bg-green-600 text-white";
    default:
      return "bg-muted text-foreground";
  }
}

export default function BuildMetrics({ shard, crit_importance, power }: BuildMetricsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* Сила */}
      <Card className={cn(getPowerBadgeClass(power))}>
        <CardHeader className="text-center">
          <CardTitle>Сила</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <span className="text-xl font-semibold">{power ?? "-"}</span>
        </CardContent>
      </Card>

      {/* Шард */}
      <Card className={cn(getShardBadgeClass(shard))}>
        <CardHeader className="text-center">
          <CardTitle>Шард</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <span className="text-xl font-semibold">{shard ?? "-"}</span>
        </CardContent>
      </Card>

      {/* Крит */}
      <Card className={cn(getCritCardClass(crit_importance))}>
        <CardHeader className="text-center">
          <CardTitle>Крит</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center text-center">
          <span className="text-lg font-semibold">{crit_importance ?? "-"}</span>
        </CardContent>
      </Card>
    </div>
  );
} 