import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const TASKS_COUNT = 300;
const TASK_BATCH_SIZE = 25; // create tasks in parallel batches

async function main() {
  console.time("seeding");

  // cleanup
  await prisma.task.deleteMany();

  type TaskSeedData = {
    title: string;
    description?: string;
    isDone: boolean;
    dueDate?: Date;
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

    const data: TaskSeedData = {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      description,
      isDone,
      dueDate,
    };

    tasksToCreate.push(data);
  }

  for (let i = 0; i < tasksToCreate.length; i += TASK_BATCH_SIZE) {
    const batch = tasksToCreate.slice(i, i + TASK_BATCH_SIZE);
    await Promise.all(batch.map((t) => prisma.task.create({ data: t })));
  }

  const finalTaskCount = await prisma.task.count();

  console.timeEnd("seeding");
  console.log(`Seed complete: tasks=${finalTaskCount}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
