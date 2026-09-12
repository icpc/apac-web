import { redirect } from "next/navigation";
import { getLatestRegionalsYear } from "@/lib/get-regionals-data";

export const dynamic = "force-static";

export default async function LatestRegionalsPage() {
  const latestYear = await getLatestRegionalsYear();
  redirect(`/${latestYear}/regionals`);
}
