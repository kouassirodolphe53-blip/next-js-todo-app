"use server";
import { hash } from "argon2";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/auth";
import type { Status } from "@prisma/client";

type TaskCreateData = {
  title: string;
  description?: string;
  dueDate?: Date;
  status: Status;
  user?: { connect: { id: string } };
  category?: { connect: { id: number } };
  tags?: { connectOrCreate: { where: { name: string }; create: { name: string } }[] };
};

function parseTags(raw: string | undefined) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export async function createTask(formData: FormData) {
  const session = await auth();
  const title = formData.get("title")?.toString()?.trim();
  const description = formData.get("description")?.toString().trim() || undefined;
  const dueDateValue = formData.get("dueDate")?.toString();
  const statusValue = formData.get("status")?.toString() as Status | undefined;
  const userId = formData.get("userId")?.toString() || undefined;
  const categoryIdValue = formData.get("categoryId")?.toString();
  const tagsRaw = formData.get("tags")?.toString();

  if (!title) return;

  const data: TaskCreateData = { title, status: statusValue ?? "OFFEN" };
  if (description) data.description = description;
  if (dueDateValue) data.dueDate = new Date(dueDateValue);
  if (userId) {
    data.user = { connect: { id: userId } };
  } else if (session?.user?.id) {
    data.user = { connect: { id: session.user.id } };
  }
  if (categoryIdValue) {
    data.category = { connect: { id: parseInt(categoryIdValue, 10) } };
  }
  const tagNames = parseTags(tagsRaw);
  if (tagNames.length > 0) {
    data.tags = {
      connectOrCreate: tagNames.map((name) => ({
        where: { name },
        create: { name },
      })),
    };
  }

  await prisma.task.create({ data });
  revalidatePath("/todos");
  redirect("/todos");
}

export async function updateTask(taskId: number, formData: FormData) {
  const title = formData.get("title")?.toString()?.trim();
  const description = formData.get("description")?.toString().trim() || undefined;
  const dueDateValue = formData.get("dueDate")?.toString();
  const statusValue = formData.get("status")?.toString() as Status | undefined;
  const userId = formData.get("userId")?.toString() || undefined;
  const categoryIdValue = formData.get("categoryId")?.toString();
  const tagsRaw = formData.get("tags")?.toString();

  if (!title) return;

  const tagNames = parseTags(tagsRaw);

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
      dueDate: dueDateValue ? new Date(dueDateValue) : undefined,
      status: statusValue,
      userId: userId || null,
      categoryId: categoryIdValue ? parseInt(categoryIdValue, 10) : null,
      tags: {
        set: [],
        connectOrCreate: tagNames.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });
  revalidatePath("/todos");
  redirect("/todos");
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  if (!email || !password) return;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return; // TODO: gérer l'erreur "email déjà utilisé"
  const hashedPassword = await hash(password);
  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
  await signIn("credentials", { email, password, redirectTo: "/todos" });
}

export async function signInAction(formData: FormData) {
  await signIn("credentials", formData);
}

export async function signOutAction() {
  await signOut();
}

export async function deleteTask(taskId: number) {
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath("/todos");
  redirect("/todos");
}
