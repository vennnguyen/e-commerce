/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { SignInDto, SignUpDto } from "@/types/api.type";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useState } from "react";


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

export const useGoogleSignIn = (messages?: { error?: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async (redirectPath?: string) => {
    try {
      setIsLoading(true);
      await authService.signInWithGoogle(redirectPath);
    } catch (error: unknown) {
      const msg = (error as Error)?.message;
      setIsLoading(false);
      toast.error(
        (messages?.error ?? "Unable to initialize Google sign in: ") +
          (msg ?? ""),
      );
      return;
    }

    setIsLoading(false);
  };

  return { signInWithGoogle, isLoading };
};