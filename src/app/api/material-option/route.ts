import { NextResponse } from "next/server";
import { getMaterialOptionQuery } from "./utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  const data = await getMaterialOptionQuery(q, 10);
  return NextResponse.json(data);
}
