"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

// Sample leaderboard data - in a real app, this would come from a database
const leaderboardData = [
  { rank: 1, username: "CyberNinja", totalPoints: 420 },
  { rank: 2, username: "HackMaster", totalPoints: 380 },
  { rank: 3, username: "SecureCode", totalPoints: 340 },
  { rank: 4, username: "PenTester", totalPoints: 290 },
  { rank: 5, username: "VulnHunter", totalPoints: 270 },
  { rank: 6, username: "EthicalHacker", totalPoints: 250 },
  { rank: 7, username: "BugBounty", totalPoints: 220 },
  { rank: 8, username: "RedTeamer", totalPoints: 200 },
]

export default function LeaderboardPage() {
  const router = useRouter()

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">Student rankings by total points earned</p>
          </div>

          {/* Back Button */}
          <div className="mb-6 flex justify-center">
            <Button variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>

          {/* Leaderboard Table */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                Student Rankings
              </CardTitle>
              <CardDescription className="text-center">
                Rankings based on approved vulnerability reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      entry.rank <= 3 ? "bg-muted/30" : "bg-card"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{entry.username}</h3>
                        {entry.rank <= 3 && (
                          <p className="text-sm text-muted-foreground">
                            {entry.rank === 1 && "🥇 Champion"}
                            {entry.rank === 2 && "🥈 Runner-up"}
                            {entry.rank === 3 && "🥉 Third Place"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{entry.totalPoints}</div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
