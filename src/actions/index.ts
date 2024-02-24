"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";

export async function editSnippet(id: number, code: string) {
  console.log(id, code);
  await db.snippet.update({
    where: { id },
    data: { code },
  });

  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  await db.snippet.delete({ where: { id } });

  revalidatePath("/");
  redirect("/");
}

export async function createSnippet(
  formState: { message: string },
  formData: FormData
) {
  try {
    // Check the user's inputs and make sure there are valid
    const title = formData.get("title");
    const code = formData.get("code");

    if (typeof title !== "string" || title.length < 3) {
      return { message: "Title must be at least 3 characters long" };
    }
    if (typeof code !== "string" || code.length < 10) {
      return { message: "Code must be at least 10 characters long" };
    }

    // Create a new record in the database
    await db.snippet.create({
      data: { title, code },
    });
  } catch (error: unknown) {
    // If there's an error, return the error message
    if (error instanceof Error) {
      return { message: error.message };
    } else {
      return { message: "An unknown error occurred" };
    }
  }

  revalidatePath("/");
  // Redirect the user back to the route route
  redirect("/");
}
