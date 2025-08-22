"use client";

import { NewPasswordSchema } from "@/entities/new-password-schema";
import { cn } from "@/lib/utils";
import { newPassword } from "@/server/actions/new-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { AuthCard } from "./auth-card";
import FormError from "./form-error";
import FormSuccess from "./form-success";

const NewPasswordForm = () => {
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      newPassword: "",
      token: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // next-safe-action hook
  const { status, execute } = useAction(newPassword, {
    onSuccess(result) {
      const data = result.data;
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    execute({ newPassword: values.newPassword, token });
  };

  return (
    <AuthCard
      cardTitle="Create a new Password!"
      backButtonHref="/auth/login"
      showSocials
      backButtonLabel="Back to login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            {/* password input */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="**********"
                      type="password"
                      autoComplete="password"
                      disabled={status === "executing"}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormSuccess message={success} />
            <FormError message={error} />
          </div>
          <Button
            className={cn(
              "w-full",
              status === "executing" ? "animate-pulse" : ""
            )}
            type="submit"
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default NewPasswordForm;
