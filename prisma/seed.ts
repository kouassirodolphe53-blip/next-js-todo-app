import { PrismaClient, Status } from "@prisma/client";
import { hash } from "argon2";
const prisma = new PrismaClient();

async function main() {
  // Crée un utilisateur de test
  const hashedPassword = await hash("password123");
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
    },
  });

  // Nettoie les anciennes données
  await prisma.task.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();

  // Crée les catégories
  const [arbeit, privat, studium] = await Promise.all([
    prisma.category.create({ data: { name: "Arbeit" } }),
    prisma.category.create({ data: { name: "Privat" } }),
    prisma.category.create({ data: { name: "Studium" } }),
  ]);

  // Crée quelques tâches de test avec catégories et tags
  await prisma.task.create({
    data: {
      title: "UI-Design für Login erstellen",
      description: "Das Login-Formular mit E-Mail und Passwort-Feldern gestalten",
      status: Status.ERLEDIGT,
      userId: user.id,
      categoryId: studium.id,
      tags: {
        connectOrCreate: [
          { where: { name: "design" }, create: { name: "design" } },
          { where: { name: "dringend" }, create: { name: "dringend" } },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "Datenbank anbinden",
      description: "Prisma mit PostgreSQL verbinden",
      status: Status.IN_ARBEIT,
      userId: user.id,
      categoryId: studium.id,
      tags: {
        connectOrCreate: [
          { where: { name: "backend" }, create: { name: "backend" } },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "CRUD Feature umsetzen",
      description: "Aufgaben erstellen, bearbeiten und löschen",
      status: Status.OFFEN,
      categoryId: studium.id,
      tags: {
        connectOrCreate: [
          { where: { name: "backend" }, create: { name: "backend" } },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "Dokumentation schreiben",
      status: Status.OFFEN,
      categoryId: arbeit.id,
      tags: {
        connectOrCreate: [
          { where: { name: "schreiben" }, create: { name: "schreiben" } },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "Präsentation vorbereiten",
      description: "Folien für die Projektvorstellung erstellen",
      status: Status.OFFEN,
      categoryId: arbeit.id,
      tags: {
        connectOrCreate: [
          { where: { name: "dringend" }, create: { name: "dringend" } },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "Einkaufen gehen",
      description: "Lebensmittel für die Woche kaufen",
      status: Status.OFFEN,
      categoryId: privat.id,
    },
  });

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
