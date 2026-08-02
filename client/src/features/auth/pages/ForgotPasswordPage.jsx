import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { Button, Input, Alert } from "../../../components/ui";

import { useForgotPassword } from "../hooks/useForgotPassword";
import { forgotPasswordSchema } from "../validations/auth.validation";
import AuthCard from "../components/AuthCard";
import AuthHeader from "../components/AuthHeader";
import AuthLayout from "../components/AuthLayout";

function ForgotPasswordPage() {
  const { forgotPassword, loading, error } = useForgotPassword();
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setSuccess("");
    try {
      const res = await forgotPassword(data);
      const message = res.message || "Password reset link sent successfully.";
      setSuccess(message);
      toast.success(message);
    } catch {
      // Error is already handled by the hook and displayed inline via Alert
    }
  };




  return (
    <AuthLayout>
      <AuthHeader
        title="Forgot Password"
        subtitle="Enter your email to receive a password reset link."
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
            <Alert variant="success">
              {success}
            </Alert>
          )}

          <Input
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            disabled={loading}
            {...register("email")}
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Send Reset Link
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;