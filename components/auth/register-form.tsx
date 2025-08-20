"use client";

import { RegisterSchema } from "@/entities/register-schema";
import { cn } from "@/lib/utils";
import { emailRegister } from "@/server/actions/email-regiser";
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
import FormSuccess from "./form-success";
import FormError from "./form-error";

const RegisterForm = () => {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // next-safe-action hook
  const { status, execute } = useAction(emailRegister, {
    onSuccess(result) {
      const data = result.data;
      if (data.error) setError(data.error);
      if (data.success) setSuccess(data.success);
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Create a new account 🎉"
      backButtonHref="/auth/login"
      showSocials
      backButtonLabel="Already have an account?"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            {/* name input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Johndeo" type="text" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
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
            Register
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default RegisterForm;
