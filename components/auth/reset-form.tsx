"use client";

import { ResetSchema } from "@/entities/reset-schema";
import { cn } from "@/lib/utils";
import { reset } from "@/server/actions/password-reset";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
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

const ResetForm = () => {
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // next-safe-action hook
  const { status, execute } = useAction(reset, {
    onSuccess(result) {
      const data = result.data;
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Forgot your password?"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="example@gmail.com"
                      type="email"
                      autoComplete="email"
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

export default ResetForm;
