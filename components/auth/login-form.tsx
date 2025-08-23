"use client";

import { LoginSchema } from "@/entities/login-schema";
import { cn } from "@/lib/utils";
import { emailSignIn } from "@/server/actions/email-signin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
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

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // next-safe-action hook
  const { status, execute } = useAction(emailSignIn, {
    onSuccess(result) {
      const data = result.data;
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    },
  });

  //   We need to define a server action to update the login info & submit the form
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      showSocials
      backButtonLabel="Create a new Account"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            {/* email input */}
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
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* password input */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="**********"
                      type="password"
                      autoComplete="password"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormSuccess message={success} />
            <FormError message={error} />

            {/* forget password button */}
            <Button size={"sm"} variant={"link"} asChild>
              <Link href="/auth/reset">Forgot password?</Link>
            </Button>
          </div>
          <Button
            className={cn(
              "w-full",
              status === "executing" ? "animate-pulse" : ""
            )}
            type="submit"
          >
            Login
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default LoginForm;
