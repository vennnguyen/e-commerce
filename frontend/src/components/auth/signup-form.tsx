'use client'
import React, { useMemo } from 'react'
import {z} from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpDto } from '@/types/api.type';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
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
import { useSignUp } from '@/hooks/use-auth';


type SignUpFormValues = SignUpDto & { confirmPassword: string };
export function SignUpForm({ className, ...props }: React.ComponentProps<"div">){
   const signUpMutation = useSignUp({
     success: 'Đăng kí thành công',
     error: 'Đăng kí thất bại',
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
         message: ("passwordsNoMatch"),
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
  console.log(data);
  
   const { email, password, name } = data;
   await signUpMutation.mutateAsync({ email, password, name });

 };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{("title")}</h1>
                <p className="text-muted-foreground text-balance">
                  {("description")}
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="name">{("fullName")}</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  disabled={signUpMutation.isPending}
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">{("email")}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  disabled={signUpMutation.isPending}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">{("password")}</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={signUpMutation.isPending}
                />
                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  {("confirmPassword")}
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  disabled={signUpMutation.isPending}
                />
                {errors.confirmPassword && (
                  <FieldError>{errors.confirmPassword.message}</FieldError>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  // disabled={signUpMutation.isPending || isGoogleLoading}
                  disabled={signUpMutation.isPending}
                >
                  {signUpMutation.isPending ? ("submitting") : ("submit")}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                {("orContinue")}
              </FieldSeparator>

              <Field>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  // disabled={signUpMutation.isPending || isGoogleLoading}
                  // onClick={signInWithGoogle}
                  disabled={signUpMutation.isPending}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 mr-2"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {("googleSignUp")}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                {("hasAccount")}{" "}
                <a
                  href="/auth/signin"
                  className="font-medium text-primary hover:underline"
                >
                  {("signIn")}
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};


