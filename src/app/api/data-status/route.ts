import { NextResponse } from "next/server";
import { getDataBackendStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getDataBackendStatus();
  const archiveReady =
    status.turso || status.supabase || (status.localSqlite && (status.productCount ?? 0) > 0);

  return NextResponse.json({
    ...status,
    archiveReady,
    hint: archiveReady
      ? undefined
      : "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN on Netlify, then run scripts/migrate-to-turso.ts from a machine with products.db.",
  });
}
