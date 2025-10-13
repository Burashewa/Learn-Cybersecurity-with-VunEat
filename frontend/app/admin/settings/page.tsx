"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function AdminSettings() {
  const [maintenance, setMaintenance] = useState(false)

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Settings</h1>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="admin@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Change Password</Label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <Button>Update Account</Button>
        </CardContent>
      </Card>

      {/* System Management */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Maintenance Mode</Label>
            <Switch
              checked={maintenance}
              onCheckedChange={setMaintenance}
            />
          </div>
          <Separator />
          <Button variant="destructive">Clear System Logs</Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance & Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label>Dark Mode</Label>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
