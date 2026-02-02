// prisma.config.ts
import { defineConfig } from "prisma/config";
import "dotenv/config";

// Fallback for build environments (e.g. Vercel) where DATABASE_URL may be unset until runtime
const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});