import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { Button, Input, Alert } from "../../../components/ui";

import { useResetPassword } from "../hooks/useResetPassword";
import { resetPasswordSchema } from "../validations/auth.validation";
import AuthCard from "../components/AuthCard";
import AuthHeader from "../components/AuthHeader";
import AuthLayout from "../components/AuthLayout";

function ResetPasswordPage() {
  const { resetPassword, loading, error } = useResetPassword();
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setSuccess("");
    try {
      const res = await resetPassword(data);
      const message = res.message || "Password reset successfully.";
      setSuccess(message);
      toast.success(message);
    } catch {
      // Error is already handled by the hook and displayed inline via Alert
    }
  };




  return (
    <AuthLayout>
      <AuthHeader
        title="Reset Password"
        subtitle="Create a new, secure password for your account."
      />

      <AuthCard className="mt-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          {error && (
            <Alert variant="error">
              {error}
            </Alert>
          )}

          {success && (
            <div className="space-y-4">
              <Alert variant="success">
                {success}
              </Alert>
              
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-block text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Go to Sign In
                </Link>
              </div>
            </div>
          )}

          {!success && (
            <>
              <div className="space-y-4">
                <Input
                  type="password"
                  label="New Password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  disabled={loading}
                  {...register("password")}
                />

                <Input
                  type="password"
                  label="Confirm New Password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  error={errors.confirmPassword?.message}
                  disabled={loading}
                  {...register("confirmPassword")}
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Reset Password
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default ResetPasswordPage;