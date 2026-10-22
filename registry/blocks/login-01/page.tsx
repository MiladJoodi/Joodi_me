import LoginForm from "@/registry/blocks/login-01/components/login-form"

export default function Login01Page() {
  return (
    <div className="flex min-h-[28rem] w-full items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
