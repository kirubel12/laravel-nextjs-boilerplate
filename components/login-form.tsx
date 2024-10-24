'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useAuth } from '@/hooks/auth'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
})

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [shouldRemember, setShouldRemember] = useState(false)


    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard'
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            login({
                email: values.email,
                password: values.password,
                remember: shouldRemember,
                setErrors: (errorMessages: any) => {
                    if (errorMessages.email) {
                        form.setError('email', {
                            type: 'server',
                            message: errorMessages.email[0]
                        })
                    }

                    if (errorMessages.password) {
                        form.setError('password', {
                            type: 'server',
                            message: errorMessages.password[0]
                        })
                    }
                },





            })
            setIsLoading(false)
        }, 2000)
    }

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="your-email@example.com"
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
                                    <div className="flex items-center">
                                        <FormLabel>Password</FormLabel>
                                        <Link href="/reset-password" className="ml-auto inline-block text-sm underline">
                                            Forgot your password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input placeholder='*******' type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}

                        />
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remmeber_me" name='remember' onChange={event =>
                                setShouldRemember(event.target.checked)
                            } />
                            <Label htmlFor="remember_me" >Remember me</Label>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </Form>
                {/*
       -----------------------------------------
       Add here if you want social oath provider
       -----------------------------------------
       */}

            </CardContent>
            <CardFooter className="mt-4 text-center text-sm gap-2">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="">
                    <span className='text-indigo-700'>create an acocunt</span>
                </Link>
            </CardFooter>
        </Card>
    )
}
