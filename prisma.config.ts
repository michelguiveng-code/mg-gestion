// This config is intentionally lightweight so the project can run without a Prisma
// runtime dependency being present, while still keeping the schema location available.
import "dotenv/config";

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] ?? "file:./dev.db",
  },
};
