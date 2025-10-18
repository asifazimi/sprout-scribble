"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductTags() {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag");

  const setFilter = (tag: string) => {
    if (tag) {
      router.push(`?tag=${tag}`);
    }
    if (!tag) {
      router.push("/");
    }
  };

  return (
    <div className="my-4 flex gap-4 items-center justify-center">
      <Badge
        onClick={() => setFilter("")}
        className={cn(
          "cursor-pointer bg-black hover:bg-black/75 hover:opacity-100",
          !tag ? "opacity-100" : "opacity-50"
        )}
      >
        All
      </Badge>
      <Badge
        onClick={() => setFilter("red")}
        className={cn(
          "cursor-pointer bg-red-500 hover:bg-red-600 hover:opacity-100",
          tag === "red" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Red
      </Badge>
      <Badge
        onClick={() => setFilter("blue")}
        className={cn(
          "cursor-pointer bg-blue-500 hover:bg-blue-600 hover:opacity-100",
          tag === "blue" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Blue
      </Badge>
      <Badge
        onClick={() => setFilter("black")}
        className={cn(
          "cursor-pointer bg-black hover:bg-black/75 hover:opacity-100",
          tag === "black" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Black
      </Badge>
    </div>
  );
}
