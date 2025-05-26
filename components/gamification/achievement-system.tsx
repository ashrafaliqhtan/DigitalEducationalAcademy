"use client"

import { useState, useEffect } from "react"
import { Trophy, Star, Target, Zap, Award, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "learning" | "social" | "completion" | "streak"
  points: number
  requirement: number
  current_progress: number
  unlocked: boolean
  unlocked_at?: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface UserStats {
  total_points: number
  level: number
  courses_completed: number
  current_streak: number
  longest_streak: number
  total_study_hours: number
  achievements_unlocked: number
}

export default function AchievementSystem() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    total_points: 0,
    level: 1,
    courses_completed: 0,
    current_streak: 0,
    longest_streak: 0,
    total_study_hours: 0,
    achievements_unlocked: 0,
  })
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    loadAchievements()
    loadUserStats()
  }, [user])

  const loadAchievements = async () => {
    // Mock achievements data
    const mockAchievements: Achievement[] = [
      {
        id: "first_course",
        title: t("achievements.firstCourse.title"),
        description: t("achievements.firstCourse.description"),
        icon: "🎓",
        category: "learning",
        points: 100,
        requirement: 1,
        current_progress: 1,
        unlocked: true,
        unlocked_at: "2024-01-15T10:00:00Z",
        rarity: "common",
      },
      {
        id: "course_master",
        title: t("achievements.courseMaster.title"),
        description: t("achievements.courseMaster.description"),
        icon: "🏆",
        category: "completion",
        points: 500,
        requirement: 10,
        current_progress: 3,
        unlocked: false,
        rarity: "rare",
      },
      {
        id: "streak_warrior",
        title: t("achievements.streakWarrior.title"),
        description: t("achievements.streakWarrior.description"),
        icon: "🔥",
        category: "streak",
        points: 300,
        requirement: 7,
        current_progress: 5,
        unlocked: false,
        rarity: "epic",
      },
      {
        id: "knowledge_seeker",
        title: t("achievements.knowledgeSeeker.title"),
        description: t("achievements.knowledgeSeeker.description"),
        icon: "📚",
        category: "learning",
        points: 200,
        requirement: 50,
        current_progress: 23,
        unlocked: false,
        rarity: "common",
      },
    ]

    setAchievements(mockAchievements)
  }

  const loadUserStats = async () => {
    // Mock user stats
    setUserStats({
      total_points: 1250,
      level: 5,
      courses_completed: 3,
      current_streak: 5,
      longest_streak: 12,
      total_study_hours: 23,
      achievements_unlocked: 1,
    })
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800"
      case "rare":
        return "bg-blue-100 text-blue-800"
      case "epic":
        return "bg-purple-100 text-purple-800"
      case "legendary":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "learning":
        return <Star className="h-4 w-4" />
      case "social":
        return <Trophy className="h-4 w-4" />
      case "completion":
        return <Award className="h-4 w-4" />
      case "streak":
        return <Zap className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const calculateLevelProgress = () => {
    const pointsForCurrentLevel = userStats.level * 500
    const pointsForNextLevel = (userStats.level + 1) * 500
    const progressInCurrentLevel = userStats.total_points - pointsForCurrentLevel
    const pointsNeededForNextLevel = pointsForNextLevel - pointsForCurrentLevel

    return {
      progress: (progressInCurrentLevel / (pointsForNextLevel - pointsForCurrentLevel)) * 100,
      pointsNeeded: pointsNeededForNextLevel,
    }
  }

  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter((achievement) => achievement.category === selectedCategory)

  const levelProgress = calculateLevelProgress()

  return (
    <div className="space-y-6">
      {/* User Level and Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {t("gamification.yourProgress")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">Level {userStats.level}</span>
                <span className="text-sm text-muted-foreground">
                  {userStats.total_points} {t("gamification.points")}
                </span>
              </div>
              <Progress value={levelProgress.progress} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">
                {levelProgress.pointsNeeded} {t("gamification.pointsToNextLevel")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.courses_completed}</div>
                <div className="text-sm text-muted-foreground">{t("gamification.coursesCompleted")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.current_streak}</div>
                <div className="text-sm text-muted-foreground">{t("gamification.currentStreak")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.total_study_hours}</div>
                <div className="text-sm text-muted-foreground">{t("gamification.studyHours")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.achievements_unlocked}</div>
                <div className="text-sm text-muted-foreground">{t("gamification.achievements")}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {["all", "learning", "completion", "streak", "social"].map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            {category === "all" ? t("gamification.allCategories") : t(`gamification.categories.${category}`)}
          </Badge>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <Card key={achievement.id} className={`relative ${achievement.unlocked ? "border-green-200" : "opacity-75"}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex items-center gap-2">
                  <Badge className={getRarityColor(achievement.rarity)}>
                    {t(`gamification.rarity.${achievement.rarity}`)}
                  </Badge>
                  {achievement.unlocked ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {t("gamification.unlocked")}
                    </Badge>
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              <h3 className="font-medium mb-2">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{t("gamification.progress")}</span>
                  <span>
                    {achievement.current_progress}/{achievement.requirement}
                  </span>
                </div>
                <Progress value={(achievement.current_progress / achievement.requirement) * 100} className="h-2" />
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1">
                  {getIconForCategory(achievement.category)}
                  <span className="text-sm text-muted-foreground">
                    {t(`gamification.categories.${achievement.category}`)}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  +{achievement.points} {t("gamification.points")}
                </span>
              </div>

              {achievement.unlocked && achievement.unlocked_at && (
                <div className="text-xs text-muted-foreground mt-2">
                  {t("gamification.unlockedOn")} {new Date(achievement.unlocked_at).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
