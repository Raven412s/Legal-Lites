"use client"

import { Users } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
type DisplayCardProps = {
count:string
text:string
}
export default function DisplayCard(
    {count,
    text
    }:DisplayCardProps
) {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{text}</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{count}</div>
        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
      </CardContent>
    </Card>
  )
}
