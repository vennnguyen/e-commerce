import { getAuthClient } from "@/lib/auth/auth-client";
import { AuthResponse, ForgotPasswordDto, ForgotPasswordResponse, ResetPasswordDto, ResetPasswordResponse, SignInDto, SignUpDto, User } from "@/types/api.type";

function mapAuthUser(u: {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    image: u.image ?? undefined,
    emailVerified: u.emailVerified,
    createdAt:
      u.createdAt instanceof Date
        ? u.createdAt.toISOString()
        : String(u.createdAt),
    updatedAt:
      u.updatedAt instanceof Date
        ? u.updatedAt.toISOString()
        : String(u.updatedAt),
  };
}
async function readSessionToken(): Promise<string> {
  const s = await getAuthClient().getSession();
  return s.data?.session?.token ?? "";
}
function publicAppOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/+$/,
    "",
  );
}
export const authService = {
  signUp: async (data: SignUpDto): Promise<AuthResponse> => {
    const res = await getAuthClient().signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });
    if (res.error) {
      throw Object.assign(new Error(res.error.message || "Đăng ký thất bại"), {
        response: { data: { message: res.error.message } },
      });
    }
    const raw = res.data?.user;
    if (!raw) {
      throw Object.assign(new Error("Đăng ký thất bại"), {
        response: { data: { message: "Không lấy được thông tin user" } },
      });
    }
    const user = mapAuthUser(raw);
    const token = await readSessionToken();
    return {
      success: true,
      user,
      token,
    };
  },
  signIn: async (data: SignInDto): Promise<AuthResponse> => {
    const res = await getAuthClient().signIn.email({
      email: data.email,
      password: data.password,
    });
    if (res.error) {
      throw Object.assign(
        new Error(res.error.message || "Đăng nhập thất bại"),
        {
          response: { data: { message: res.error.message } },
        },
      );
    }
    const raw = res.data?.user;
    if (!raw) {
      throw Object.assign(new Error("Đăng nhập thất bại"), {
        response: { data: { message: "Không lấy được thông tin user" } },
      });
    }
    const user = mapAuthUser(raw);
    if (user.emailVerified === false) {
      throw Object.assign(
        new Error(
          "Vui lòng xác thực email trước khi đăng nhập. Kiểm tra hộp thư của bạn.",
        ),
        {
          response: {
            data: {
              message:
                "Vui lòng xác thực email trước khi đăng nhập. Kiểm tra hộp thư của bạn.",
            },
          },
        },
      );
    }
    const token = await readSessionToken();
    return {
      success: true,
      user,
      token,
    };
  },
  signInWithGoogle: async (redirectPath?: string): Promise<void> => {
    if (typeof window === "undefined") return;

    const redirect =
      redirectPath !== undefined && redirectPath !== ""
        ? redirectPath
        : "/product/catalog";
    const encoded = encodeURIComponent(
      redirect.startsWith("/") ? redirect : `/${redirect}`,
    );
    const callbackURL = `${publicAppOrigin()}/auth/callback/google?redirect=${encoded}`;
    const res = await getAuthClient().signIn.social({
      provider: "google",
      callbackURL,
    });
    if (res.error) {
      throw new Error(
        res.error.message || "Khởi tạo đăng nhập Google thất bại",
      );
    }
    if (res.data?.url) {
      window.location.href = res.data.url;
    }
  },
  resendVerificationEmail: async (email: string): Promise<void> => {
    const res = await getAuthClient().sendVerificationEmail({ email });
    if (res.error) {
      throw new Error(
        res.error.message || "Gửi lại email xác thực thất bại",
      );
    }
  },
  forgotPassword: async (data: ForgotPasswordDto): Promise<ForgotPasswordResponse> => {
    const res = await getAuthClient().requestPasswordReset({ email: data.email, redirectTo: `/auth/reset-password` });
    if (res.error) {
      throw new Error(
        res.error.message || "Gửi yêu cầu khôi phục mật khẩu thất bại",
      );
    }
    return {
      success: true,
      message: "Yêu cầu khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.",
    };
  },

  resetPassword: async (data: ResetPasswordDto): Promise<ResetPasswordResponse> => {
    const res = await getAuthClient().resetPassword({ token: data.token, newPassword: data.newPassword });
    if (res.error) {
      throw new Error(
        res.error.message || "Đặt lại mật khẩu thất bại",
      );
    }
    return {
      success: true,
      message: "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.",
    };
  }
};