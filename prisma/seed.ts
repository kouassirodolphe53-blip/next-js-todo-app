import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const AUTHORS_COUNT = 50;
const TASKS_COUNT = 300;
const TASK_BATCH_SIZE = 25; // create tasks in parallel batches

async function main() {
  console.time("seeding");

  // cleanup
  await prisma.task.deleteMany();
  await prisma.author.deleteMany();

  // generate unique authors
  const authorsData: { name: string; email: string }[] = [];
  const usedEmails = new Set<string>();

  while (authorsData.length < AUTHORS_COUNT) {
    const name = faker.person.fullName();
    const local = name.toLowerCase().replace(/[^a-z0-9._-]+/g, ".");
    let email = `${local}@example.com`;

    if (usedEmails.has(email)) {
      // append random number to avoid collision
      email = `${local}${faker.number.int({ min: 1, max: 9999 })}@example.com`;
    }

    if (usedEmails.has(email)) continue;

    usedEmails.add(email);
    authorsData.push({ name, email });
  }

  // bulk insert authors for performance
  await prisma.author.createMany({ data: authorsData });

  // fetch created authors (we need ids to connect tasks)
  const authors = await prisma.author.findMany();
  const authorIds = authors.map((author) => author.id);

  // create tasks in batches
  type TaskSeedData = {
    title: string;
    description?: string;
    isDone: boolean;
    dueDate?: Date;
    author?: { connect: { id: number } };
  };

  const tasksToCreate: TaskSeedData[] = [];

  for (let i = 0; i < TASKS_COUNT; i++) {
    const title = faker.lorem.words({ min: 3, max: 6 });
    const description = faker.datatype.boolean({ probability: 0.7 })
      ? faker.lorem.sentences({ min: 1, max: 2 })
      : undefined;
    const isDone = faker.datatype.boolean({ probability: 0.4 });

    const dueDate = faker.datatype.boolean({ probability: 0.7 })
      ? (faker.datatype.boolean()
          ? faker.date.soon({ days: faker.number.int({ min: 1, max: 30 }) })
          : faker.date.recent({ days: faker.number.int({ min: 1, max: 30 }) }))
      : undefined;

    const hasAuthor = faker.datatype.boolean({ probability: 0.9 });
    const authorId = hasAuthor ? faker.helpers.arrayElement(authorIds) : undefined;

    const data: TaskSeedData = {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      description,
      isDone,
      dueDate,
    };

    if (authorId !== undefined) {
      data.author = { connect: { id: authorId as number } };
    }

    tasksToCreate.push(data);
  }

  for (let i = 0; i < tasksToCreate.length; i += TASK_BATCH_SIZE) {
    const batch = tasksToCreate.slice(i, i + TASK_BATCH_SIZE);
    await Promise.all(batch.map((t) => prisma.task.create({ data: t })));
  }

  const finalAuthorCount = await prisma.author.count();
  const finalTaskCount = await prisma.task.count();

  console.timeEnd("seeding");
  console.log(`Seed complete: authors=${finalAuthorCount} tasks=${finalTaskCount}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
