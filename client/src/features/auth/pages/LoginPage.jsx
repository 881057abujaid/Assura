import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { Button, Input, Alert } from "../../../components/ui";

import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../../../context/AuthContext";
import { loginSchema } from "../validations/auth.validation";
import AuthCard from "../components/AuthCard";
import AuthHeader from "../components/AuthHeader";
import AuthLayout from "../components/AuthLayout";

function LoginPage() {
  const { login, loading, error } = useLogin();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      setUser(res.user);
      toast.success("Signed in successfully!");
      navigate("/");
    } catch {
      // Error is already handled by the hook and displayed inline via Alert
    }
  };





  return (
    <AuthLayout>
      <AuthHeader
        title="Sign in to Assura"
        subtitle="Manage your policies and claims securely."
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
              label={
                <span className="flex w-full items-center justify-between">
                  <span>Password</span>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    Forgot password?
                  </Link>
                </span>
              }
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              disabled={loading}
              {...register("password")}
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Sign In
          </Button>

          <p className="text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Create Account
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default LoginPage;