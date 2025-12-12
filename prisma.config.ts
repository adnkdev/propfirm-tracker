import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // For Supabase, you can put your DIRECT URL here if you're just trying to get migrations working first.
    url: env("DATABASE_URL"),
  },
});
