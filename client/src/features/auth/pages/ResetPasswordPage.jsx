import { useState } from "react";
import { Link } from "react-router-dom";

import { Button, Input } from "../../../components/ui";

import AuthCard from "../components/AuthCard";
import AuthHeader from "../components/AuthHeader";
import AuthLayout from "../components/AuthLayout";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Password reset functionality
    // will be implemented in a future milestone.
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Reset Password"
        subtitle="Create a new, secure password for your account."
      />

      <AuthCard className="mt-8">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6"
        >
          <div className="space-y-4">
            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <Input
              type="password"
              label="Confirm New Password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          <Button
            type="submit"
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
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default ResetPasswordPage;