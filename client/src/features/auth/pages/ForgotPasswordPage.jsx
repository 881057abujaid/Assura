import { useState } from "react";
import { Link } from "react-router-dom";

import { Button, Input } from "../../../components/ui";

import AuthCard from "../components/AuthCard";
import AuthHeader from "../components/AuthHeader";
import AuthLayout from "../components/AuthLayout";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Password reset functionality
    // will be implemented in a future milestone.
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Forgot Password"
        subtitle="Enter your email to receive a password reset link."
      />

      <AuthCard className="mt-8">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6"
        >
          <Input
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Button
            type="submit"
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