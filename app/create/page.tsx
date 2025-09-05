"use client";

import * as React from "react";
import RecipeCreateForm from "@/components/recipe-builder-simple/form";
import { createRecipe } from "@/lib/api";
import { useUser } from "@/hooks/use-user"; // already used elsewhere in your app

export default function CreateRecipePage() {
  const { user } = useUser();
  const uid = user?.$id; // Appwrite user id

  return (
    <div className="mx-auto max-w-4xl p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Create Recipe</h1>

      <RecipeCreateForm
        onSubmit={async (draft) => {
          // guard so we don't call the API without a user
          if (!uid) {
            console.warn("createRecipe(): missing Appwrite user id");
            return;
          }
          // lib/api.ts expects (appwriteUserId, recipe)
          await createRecipe(uid, draft);

          // (optional) redirect or show toast here
          // e.g. router.push("/my-recipes");
        }}
      />
    </div>
  );
}
