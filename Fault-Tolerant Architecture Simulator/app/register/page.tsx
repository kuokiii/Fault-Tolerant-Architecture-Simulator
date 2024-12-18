import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create an account to access the simulator.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input id="name" placeholder="Name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input id="email" placeholder="Email" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input id="password" type="password" placeholder="Password" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input id="confirm-password" type="password" placeholder="Confirm Password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Register</Button>
        </CardFooter>
      </Card>
    </div>
  )
}


