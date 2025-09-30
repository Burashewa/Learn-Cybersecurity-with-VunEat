import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Target, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Lab {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  estimatedTime: string
  vulnerabilities: string[]
}

interface LabCardProps {
  lab: Lab
}

const difficultyColors = {
  Beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function LabCard({ lab }: LabCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{lab.title}</CardTitle>
            <CardDescription className="text-sm">{lab.description}</CardDescription>
          </div>
          <Badge className={difficultyColors[lab.difficulty]} variant="secondary">
            {lab.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Target className="h-4 w-4 mr-2" />
            <span>{lab.category}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{lab.estimatedTime}</span>
          </div>

          <div className="flex items-start text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {lab.vulnerabilities.map((vuln, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {vuln}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Button asChild className="w-full">
            <Link href={`/labs/${lab.id}`}>Try Lab</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
