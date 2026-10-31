"use client";
import React, { useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpDto } from "@/types/api.type";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGoogleSignIn, useSignUp } from "@/hooks/user-auth";
import { SocialAuthButtons } from "./social-auth-buttons";

type SignUpFormValues = SignUpDto & { confirmPassword: string };
export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const signUpMutation = useSignUp({
    success: "Đăng kí thành công",
    error: "Đăng kí thất bại",
    verifyEmail: "Đăng kí thành công! Vui lòng xác minh email của bạn.",
  });
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleSignIn({
    error: "googleInitError",
  });
  const signUpSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(2),
          email: z.string().email(),
          password: z.string().min(6),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "passwordsNoMatch",
          path: ["confirmPassword"],
        }),
    [],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });
  const onSubmit = async (data: SignUpFormValues) => {
    const { email, password, name } = data;
    await signUpMutation.mutateAsync({ email, password, name });
  };

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-3">
              {/* Tiêu đề */}
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-xl font-bold">{"title"}</h1>

                <p className="text-xs text-muted-foreground text-balance">
                  {"description"}
                </p>
              </div>

              {/* Họ tên */}
              <Field className="gap-1.5">
                <FieldLabel htmlFor="name" className="text-sm">
                  {"fullName"}
                </FieldLabel>

                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="h-9 text-sm"
                  {...register("name")}
                  disabled={signUpMutation.isPending}
                />

                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              {/* Email */}
              <Field className="gap-1.5">
                <FieldLabel htmlFor="email" className="text-sm">
                  {"email"}
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="h-9 text-sm"
                  {...register("email")}
                  disabled={signUpMutation.isPending}
                />

                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              {/* Mật khẩu */}
              <Field className="gap-1.5">
                <FieldLabel htmlFor="password" className="text-sm">
                  {"password"}
                </FieldLabel>

                <Input
                  id="password"
                  type="password"
                  className="h-9 text-sm"
                  {...register("password")}
                  disabled={signUpMutation.isPending}
                />

                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>

              {/* Xác nhận mật khẩu */}
              <Field className="gap-1.5">
                <FieldLabel htmlFor="confirmPassword" className="text-sm">
                  {"confirmPassword"}
                </FieldLabel>

                <Input
                  id="confirmPassword"
                  type="password"
                  className="h-9 text-sm"
                  {...register("confirmPassword")}
                  disabled={signUpMutation.isPending}
                />

                {errors.confirmPassword && (
                  <FieldError>{errors.confirmPassword.message}</FieldError>
                )}
              </Field>

              {/* Nút đăng ký */}
              <Field>
                <Button
                  type="submit"
                  className="h-9 w-full text-sm"
                  disabled={signUpMutation.isPending}
                >
                  {signUpMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                hoặc
              </FieldSeparator>

              {/* Google */}
              <SocialAuthButtons onGoogleSignIn={signInWithGoogle} isGoogleLoading={isGoogleLoading} />

              {/* Chuyển sang đăng nhập */}
              <FieldDescription className="text-center text-xs">
                {"hasAccount"}{" "}
                <a
                  href="/auth/signin"
                  className="font-medium text-primary hover:underline"
                >
                  {"signIn"}
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
