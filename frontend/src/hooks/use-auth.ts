/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/api/axios";
import {  SignInDto, SignUpDto } from "@/types/api.type";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

type AuthToastMessages = {
  success?: string;
  error?: string;
};
export const useSignUp = (messages?: AuthToastMessages) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignUpDto) => authService.signUp(data),
    onSuccess: (response: any) => {
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      queryClient.setQueryData(["auth", "user"], response.user);

      toast.success(messages?.success ?? "Account created successfully!");

      if (response.token) {
        router.push("/product/catalog");
        return;
      }

      router.push("/auth/signin");
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message || (messages?.error ?? "Sign up failed");
      toast.error(message);
    },
  });
};

export const useSignIn = (messages?: AuthToastMessages) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInDto) => authService.signIn(data),
    onSuccess: (response) => {
      queryClient.setQueryData(["auth", "session"], {
        user: response.user,
        isGuest: false,
        isAuthenticated: true,
      });

      toast.success(messages?.success ?? "Sign in successful!");
      router.push("/product/catalog");
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(
        typeof message === "string"
          ? message
          : (messages?.error ?? "Sign in failed"),
      );
    },
  });
};
