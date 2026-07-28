import { useState } from "react";
import { Link } from "react-router-dom";

import { Button, Input } from "../../../components/ui";

import AuthCard from "../components/AuthCard";
import AuthHeader from "../components/AuthHeader";
import AuthLayout from "../components/AuthLayout";

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Registration logic will be implemented
    // in a future milestone.
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Create your account"
        subtitle="Create your account to manage your insurance policies securely."
      />

      <AuthCard className="mt-8">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6"
        >
          <div className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />

            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <Input
              type="password"
              label="Confirm Password"
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