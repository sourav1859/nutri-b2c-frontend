"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Heart } from "lucide-react"
import { format } from "date-fns"
import type { User as MockUser } from "@/lib/mock-auth"

interface ProfileOverviewProps {
  user: MockUser
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

function calculateBMI(height: { value: number; unit: string }, weight: { value: number; unit: string }): number {
  let heightInM = height.value
  let weightInKg = weight.value

  // Convert height to meters
  if (height.unit === "ft") {
    heightInM = height.value * 0.3048
  } else {
    heightInM = height.value / 100
  }

  // Convert weight to kg
  if (weight.unit === "lb") {
    weightInKg = weight.value * 0.453592
  }

  return weightInKg / (heightInM * heightInM)
}

function getBMICategory(bmi: number): { category: string; color: string } {
  if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" }
  if (bmi < 25) return { category: "Normal", color: "text-green-600" }
  if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" }
  return { category: "Obese", color: "text-red-600" }
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
  const age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null
  const bmi = user.height && user.weight ? calculateBMI(user.height, user.weight) : null
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  const profileCompleteness = [
    user.dateOfBirth,
    user.sex,
    user.height,
    user.weight,
    user.activityLevel,
    user.goal,
  ].filter(Boolean).length

  const completenessPercentage = (profileCompleteness / 6) * 100

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Profile Completeness</span>
                  <span>{Math.round(completenessPercentage)}%</span>
                </div>
                <Progress value={completenessPercentage} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.dateOfBirth ? `${age} years old` : "Age not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm capitalize">{user.sex || "Not specified"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Height: {user.height ? `${user.height.value} ${user.height.unit}` : "Not set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Weight: {user.weight ? `${user.weight.value} ${user.weight.unit}` : "Not set"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Health Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bmi ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm">BMI</span>
                  <span className="font-medium">{bmi.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Category</span>
                  <span className={`font-medium ${bmiCategory?.color}`}>{bmiCategory?.category}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Complete height and weight to see BMI</p>
            )}
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm capitalize">
                {user.activityLevel?.replace("_", " ") || "Activity level not set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm capitalize">{user.goal?.replace("_", " ") || "Goal not set"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Dietary Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Dietary Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium">Diets:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.diets && user.diets.length > 0 ? (
                  user.diets.map((diet) => (
                    <Badge key={diet} variant="secondary" className="text-xs">
                      {diet}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None specified</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">Allergies:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.allergens && user.allergens.length > 0 ? (
                  user.allergens.map((allergen) => (
                    <Badge key={allergen} variant="destructive" className="text-xs">
                      {allergen}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None specified</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Account Type</span>
              <Badge variant="outline">Demo Account</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Member Since</span>
              <span className="text-sm text-muted-foreground">{format(new Date(), "MMM yyyy")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Verified</span>
              <Badge variant="secondary">✓ Verified</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
