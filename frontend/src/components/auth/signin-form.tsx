"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SocialAuthButtons } from "./social-auth-buttons";
import { SignInDto } from "@/types/api.type";
import { Button } from "../ui/button";
import Image from "next/image";
import { useGoogleSignIn, useSignIn } from "@/hooks/user-auth";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const signInMutation = useSignIn({
    success: "signInSuccess",
    error: "signInFailed",
  });
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleSignIn({
    error: "googleInitError",
  });
  const signInSchema = useMemo(
    () =>
      z.object({
        email: z.string().email("invalidEmail"),
        password: z.string().min(6, "passwordMin"),
      }),
    [],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInDto>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit(async (data) => {
              await signInMutation.mutateAsync(data);
            })}
            className="p-6 md:p-8"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold"> {"title"}</h1>
                <p className="text-muted-foreground text-balance">
                  {"description"}
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email"> {"email"}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={"emailPlaceholder"}
                  {...register("email")}
                  disabled={signInMutation.isPending}
                />
                {errors.email && (
                  <FieldError className="text-destructive">
                    {errors.email.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password"> {"password"}</FieldLabel>
                  <a
                    href="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    {"forgotPassword"}
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={signInMutation.isPending}
                />
                {errors.password && (
                  <FieldError className="text-destructive">
                    {errors.password.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={signInMutation.isPending}
                >
                  {signInMutation.isPending ? "submitting" : "submit"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                hoặc
              </FieldSeparator>

              <SocialAuthButtons
               
                isGoogleLoading={isGoogleLoading}
                onGoogleSignIn={signInWithGoogle}
              />

              <FieldDescription className="text-center">
                {"noAccount"}{" "}
                <a
                  href="/auth/signup"
                  className="font-medium text-primary hover:underline"
                >
                  {"signUp"}
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              src="/login-thumbnail.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              fill
              priority
              sizes="(max-width: 768px) 0px, 50vw"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-muted-foreground">
        {"terms"}{" "}
        <a href="/terms" className="underline">
          {"termsLink"}
        </a>{" "}
        {"termsAnd"}{" "}
        <a href="/privacy" className="underline">
          {"privacyLink"}
        </a>
        .
      </FieldDescription>
    </div>
  );
}

export default SignInForm;
