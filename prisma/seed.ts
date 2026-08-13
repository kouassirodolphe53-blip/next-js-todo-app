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

  // Nettoie les anciennes tâches (optionnel)
  await prisma.task.deleteMany();

  // Crée quelques tâches de test
  await prisma.task.createMany({
    data: [
      {
        title: "UI-Design für Login erstellen",
        description: "Das Login-Formular mit E-Mail und Passwort-Feldern gestalten",
        status: Status.ERLEDIGT,
        userId: user.id,
      },
      {
        title: "Datenbank anbinden",
        description: "Prisma mit PostgreSQL verbinden",
        status: Status.IN_ARBEIT,
        userId: user.id,
      },
      {
        title: "CRUD Feature umsetzen",
        description: "Aufgaben erstellen, bearbeiten und löschen",
        status: Status.OFFEN,
      },
      {
        title: "Dokumentation schreiben",
        status: Status.OFFEN,
      },
      {
        title: "Präsentation vorbereiten",
        description: "Folien für die Projektvorstellung erstellen",
        status: Status.OFFEN,
      },
    ],
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
