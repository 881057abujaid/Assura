import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { Button, Input, Alert } from "../../../components/ui";

import { useRegister } from "../hooks/useRegister";
import { registerSchema } from "../validations/auth.validation";
import AuthCard from "../components/AuthCard";
import AuthHeader from "../components/AuthHeader";
import AuthLayout from "../components/AuthLayout";

function RegisterPage() {
  const { register: signup, loading, error } = useRegister();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch {
      // Error is already handled by the hook and displayed inline via Alert
    }
  };




  return (
    <AuthLayout>
      <AuthHeader
        title="Create your account"
        subtitle="Create your account to manage your insurance policies securely."
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

          <div className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              autoComplete="name"
              error={errors.fullName?.message}
              disabled={loading}
              {...register("fullName")}
            />

            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              disabled={loading}
              {...register("email")}
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.password?.message}
              disabled={loading}
              {...register("password")}
            />

            <Input
              type="password"
              label="Confirm Password"
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
            Create Account
          </Button>

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Sign In
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default RegisterPage;