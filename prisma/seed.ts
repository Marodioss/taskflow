import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing tasks
  await prisma.task.deleteMany();

  // Create initial seed tasks in Postgres
  await prisma.task.createMany({
    data: [
      {
        title: "Connect TaskFlow to Neon PostgreSQL",
        completed: true,
      },
      {
        title: "Read tasks directly from Postgres in Server Component",
        completed: false,
      },
      {
        title: "Build Server Actions for DB mutations",
        completed: false,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
