/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ForgotPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from "@/types/api.type";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useState } from "react";


type AuthToastMessages = {
  success?: string;
  error?: string;
  verifyEmail?: string;
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

      queryClient.setQueryData(["auth", "user"], {
        user: response.user,
        isGuest: false,
        isAuthenticated: true,
      });

      if (response.token) {
        toast.success(messages?.success ?? "Account created successfully!");
        router.push("/product/catalog");
        return;
      }
      //chưa có session cần xác mình email
      toast.info(
        messages?.verifyEmail ??
          messages?.success ??
          "Account created! Please verify your email.",
      );
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

export const useResendVerificationEmail = (messages?: {
  success?: string;
  error?: string;
}) => {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerificationEmail(email),
    onSuccess: () => {
      toast.success(
        messages?.success ?? "Verification email sent successfully!",
      );
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(
        typeof message === "string"
          ? message
          : (messages?.error ?? "Failed to resend verification email"),
      );
    },
  });
};

export const useForgotPassword = (messages?: AuthToastMessages) => {
  return useMutation({
    mutationFn: (data: ForgotPasswordDto) => authService.forgotPassword(data),
    onSuccess: () => {
      toast.success(
        messages?.success ?? "Password reset request sent successfully!",
      );
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(
        typeof message === "string"
          ? message
          : (messages?.error ?? "Failed to send password reset request"),
      );
    },
  });
};

export const useResetPassword = (messages?: AuthToastMessages) => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: ResetPasswordDto) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success(
        messages?.success ?? "Password reset request sent successfully!",
      );
      router.push("/auth/signin");
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(
        typeof message === "string"
          ? message
          : (messages?.error ?? "Failed to send password reset request"),
      );
    },
  });
};