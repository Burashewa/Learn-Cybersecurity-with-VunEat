import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ExternalLink, Target } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <Shield className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Learn Cybersecurity with <span className="text-primary">VulnEat</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Practice ethical hacking on our vulnerable web application. Find vulnerabilities, submit reports, and
              compete with other students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Target Application */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">Target Application</CardTitle>
                  <CardDescription>
                    Practice your skills on our intentionally vulnerable web application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-card border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">VulnEat - Food Delivery Platform</h3>
                        <p className="text-muted-foreground">A deliberately vulnerable online Food Delivery application</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      This application contains various security vulnerabilities including SQL injection, XSS, CSRF, and
                      more. Your goal is to identify these vulnerabilities and submit detailed reports.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="https://vulnshop.vuneeat.com" target="_blank" rel="noopener noreferrer">
                        Access Target Application
                      </Link>
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span>Multiple vulnerability types</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Safe testing environment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* NEW Leaderboard Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Climb the Leaderboard</h2>
            <p className="text-muted-foreground mb-6">
              Compete with fellow students by reporting vulnerabilities. Earn points based on severity 
              and see how you rank against others on the leaderboard.
            </p>
            <Button size="lg" asChild>
              <Link href="../../leaderboard">View Leaderboard</Link>
            </Button>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Explore</h3>
                <p className="text-muted-foreground text-sm">
                  Access the vulnerable web application and explore its features to identify security weaknesses.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Report</h3>
                <p className="text-muted-foreground text-sm">
                  Submit detailed reports of vulnerabilities you discover, including severity and exploitation steps.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Compete</h3>
                <p className="text-muted-foreground text-sm">
                  Earn points based on vulnerability severity and climb the leaderboard to showcase your skills.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
