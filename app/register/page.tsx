import { RegisterForm } from "@/components/Register";

export default function RegisterPage() {
  return (
    <div className="bg-surface-base flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </div>
  );
}
