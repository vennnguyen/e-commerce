/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {  SignUpDto } from "@/types/api.type";
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
