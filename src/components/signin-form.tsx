"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function SignInForm() {
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        // Throw errors to be caught and shown as toast
        if (result.error === "CredentialsSignin") {
          throw new Error("Invalid email or password. Please verify your credentials and try again.")
        } else if (result.error === "AccessDenied") {
          throw new Error("Your account is pending approval from an administrator.")
        } else {
          throw new Error("Authentication failed. Please try again or contact support if the issue persists.")
        }
      } else if (result?.ok) {
        setRedirecting(true)
        toast.success("Sign In Successful!", {
          description: "You are being redirected to your profile.",
        })
        const callbackUrl = "/"
        router.push(callbackUrl)
      } else {
        throw new Error("An unexpected error occurred. Please try again or contact support.")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      toast.error("Authentication Error", {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  disabled={loading || redirecting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </div>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    disabled={loading || redirecting}
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || redirecting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading || redirecting}>
          {(loading || redirecting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Signing In..." : redirecting ? "Redirecting..." : "Sign In"}
        </Button>
        <div className="text-center text-sm mt-2 text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className={`text-blue-600 hover:underline font-medium ${redirecting ? "pointer-events-none opacity-50" : ""
              }`}
          >
            Create Account
          </Link>
        </div>
      </form>
    </Form>
  )
}
