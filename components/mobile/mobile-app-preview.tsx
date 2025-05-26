"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Smartphone,
  Download,
  Play,
  Pause,
  BookOpen,
  User,
  Search,
  Bell,
  Settings,
  Home,
  Star,
  Trophy,
  Video,
  Wifi,
  WifiOff,
  Battery,
  Signal,
} from "lucide-react"

interface MobileScreen {
  id: string
  title: string
  component: React.ReactNode
}

export default function MobileAppPreview() {
  const [currentScreen, setCurrentScreen] = useState("home")
  const [isPlaying, setIsPlaying] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  const screens: MobileScreen[] = [
    {
      id: "home",
      title: "Home",
      component: <HomeScreen />,
    },
    {
      id: "courses",
      title: "Courses",
      component: <CoursesScreen />,
    },
    {
      id: "learning",
      title: "Learning",
      component: <LearningScreen isPlaying={isPlaying} setIsPlaying={setIsPlaying} />,
    },
    {
      id: "profile",
      title: "Profile",
      component: <ProfileScreen />,
    },
    {
      id: "offline",
      title: "Offline",
      component: <OfflineScreen downloadProgress={downloadProgress} />,
    },
  ]

  const currentScreenData = screens.find((screen) => screen.id === currentScreen)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Educational Academy Mobile App</h1>
        <p className="text-muted-foreground">Learn anywhere, anytime with our mobile application</p>
      </div>

      <div className="flex justify-center gap-8">
        {/* Mobile Device Frame */}
        <div className="relative">
          <div className="w-80 h-[640px] bg-black rounded-[2.5rem] p-2 shadow-2xl">
            <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
              {/* Status Bar */}
              <div className="bg-gray-900 text-white px-6 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <span>9:41</span>
                </div>
                <div className="flex items-center gap-1">
                  {isOfflineMode ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
                  <Signal className="h-3 w-3" />
                  <Battery className="h-3 w-3" />
                  <span>100%</span>
                </div>
              </div>

              {/* Screen Content */}
              <div className="flex-1 h-[calc(100%-8rem)]">{currentScreenData?.component}</div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
                <div className="flex items-center justify-around">
                  {[
                    { id: "home", icon: Home, label: "Home" },
                    { id: "courses", icon: BookOpen, label: "Courses" },
                    { id: "learning", icon: Play, label: "Learning" },
                    { id: "offline", icon: Download, label: "Offline" },
                    { id: "profile", icon: User, label: "Profile" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentScreen(item.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                        currentScreen === item.id ? "text-blue-600 bg-blue-50" : "text-gray-600"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Features */}
        <div className="flex-1 max-w-md space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Mobile Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Download className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Offline Learning</h4>
                  <p className="text-sm text-muted-foreground">Download courses for offline access</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Video className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Video Streaming</h4>
                  <p className="text-sm text-muted-foreground">High-quality video playback with adaptive streaming</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Stay updated with course reminders</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium">Progress Tracking</h4>
                  <p className="text-sm text-muted-foreground">Track your learning progress on the go</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Download App</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Get the Educational Academy mobile app for iOS and Android devices.
              </p>

              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <div className="w-6 h-6 bg-black rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  Download for iOS
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <div className="w-6 h-6 bg-green-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  Download for Android
                </Button>
              </div>

              <div className="text-center pt-4">
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Screen Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>App Screens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {screens.map((screen) => (
              <Button
                key={screen.id}
                variant={currentScreen === screen.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentScreen(screen.id)}
              >
                {screen.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HomeScreen() {
  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Good morning, Sarah!</h2>
          <p className="text-sm text-gray-600">Ready to continue learning?</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full bg-gray-100">
            <Search className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 relative">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
        <h3 className="font-medium mb-2">Continue Learning</h3>
        <p className="text-sm opacity-90 mb-3">React Hooks Masterclass</p>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="bg-white/20 rounded-full h-2 mb-2">
              <div className="bg-white rounded-full h-2 w-3/4" />
            </div>
            <p className="text-xs opacity-75">75% complete</p>
          </div>
          <button className="ml-4 p-2 bg-white/20 rounded-full">
            <Play className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="w-8 h-8 bg-orange-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm font-medium">My Courses</p>
          <p className="text-xs text-gray-600">5 active</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <Download className="h-4 w-4 text-white" />
          </div>
          <p className="text-sm font-medium">Downloads</p>
          <p className="text-xs text-gray-600">3 offline</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="font-medium mb-3">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Trophy className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Achievement Unlocked!</p>
              <p className="text-xs text-gray-600">Completed 5 React lessons</p>
            </div>
            <span className="text-xs text-gray-500">2h ago</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Quiz Completed</p>
              <p className="text-xs text-gray-600">JavaScript Fundamentals - 95%</p>
            </div>
            <span className="text-xs text-gray-500">1d ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CoursesScreen() {
  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">My Courses</h2>
        <button className="p-2 rounded-full bg-gray-100">
          <Search className="h-4 w-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">All</button>
        <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">In Progress</button>
        <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">Completed</button>
      </div>

      {/* Courses List */}
      <div className="space-y-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex gap-3">
            <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
            <div className="flex-1">
              <h3 className="font-medium text-sm">React Hooks Masterclass</h3>
              <p className="text-xs text-gray-600 mb-2">by Sarah Johnson</p>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-1.5 mb-1">
                    <div className="bg-blue-500 rounded-full h-1.5 w-3/4" />
                  </div>
                  <p className="text-xs text-gray-500">75% complete</p>
                </div>
                <button className="ml-3 p-1.5 bg-blue-500 text-white rounded-full">
                  <Play className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex gap-3">
            <div className="w-16 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg" />
            <div className="flex-1">
              <h3 className="font-medium text-sm">JavaScript Fundamentals</h3>
              <p className="text-xs text-gray-600 mb-2">by Mike Chen</p>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-1.5 mb-1">
                    <div className="bg-green-500 rounded-full h-1.5 w-full" />
                  </div>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div className="ml-3 p-1.5 bg-green-500 text-white rounded-full">
                  <Star className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex gap-3">
            <div className="w-16 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg" />
            <div className="flex-1">
              <h3 className="font-medium text-sm">UI/UX Design Principles</h3>
              <p className="text-xs text-gray-600 mb-2">by Emma Davis</p>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-1.5 mb-1">
                    <div className="bg-purple-500 rounded-full h-1.5 w-1/3" />
                  </div>
                  <p className="text-xs text-gray-500">33% complete</p>
                </div>
                <button className="ml-3 p-1.5 bg-purple-500 text-white rounded-full">
                  <Play className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LearningScreen({ isPlaying, setIsPlaying }: { isPlaying: boolean; setIsPlaying: (playing: boolean) => void }) {
  return (
    <div className="h-full flex flex-col">
      {/* Video Player */}
      <div className="bg-black aspect-video relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white ml-1" />}
          </button>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center gap-3 text-white">
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <div className="flex-1">
              <div className="bg-white/20 rounded-full h-1">
                <div className="bg-white rounded-full h-1 w-1/3" />
              </div>
            </div>
            <span className="text-sm">5:23 / 15:47</span>
            <button>
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div>
          <h2 className="font-bold">Introduction to React Hooks</h2>
          <p className="text-sm text-gray-600">Lesson 3 of 12 • React Hooks Masterclass</p>
        </div>

        {/* Lesson Navigation */}
        <div className="flex gap-2">
          <button className="flex-1 p-2 bg-gray-100 rounded-lg text-sm">Previous</button>
          <button className="flex-1 p-2 bg-blue-500 text-white rounded-lg text-sm">Next Lesson</button>
        </div>

        {/* Lesson Content */}
        <div className="space-y-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <h3 className="font-medium text-sm mb-2">Key Concepts</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• useState Hook</li>
              <li>• useEffect Hook</li>
              <li>• Custom Hooks</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <h3 className="font-medium text-sm mb-2">Practice Exercise</h3>
            <p className="text-sm text-gray-600">Create a counter component using useState</p>
            <button className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm">Start Exercise</button>
          </div>
        </div>

        {/* Comments */}
        <div>
          <h3 className="font-medium mb-3">Discussion</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                M
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Mike Chen</p>
                <p className="text-sm text-gray-600">Great explanation of useState! The examples really helped.</p>
                <div className="flex items-center gap-3 mt-1">
                  <button className="text-xs text-gray-500">Like</button>
                  <button className="text-xs text-gray-500">Reply</button>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileScreen() {
  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      {/* Profile Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
          S
        </div>
        <h2 className="font-bold">Sarah Johnson</h2>
        <p className="text-sm text-gray-600">Frontend Developer</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-lg font-bold">12</div>
          <div className="text-xs text-gray-600">Courses</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">156h</div>
          <div className="text-xs text-gray-600">Study Time</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">8</div>
          <div className="text-xs text-gray-600">Certificates</div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="font-medium mb-3">Recent Achievements</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-sm font-medium">React Master</p>
              <p className="text-xs text-gray-600">Completed all React courses</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
            <Star className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Quick Learner</p>
              <p className="text-xs text-gray-600">Finished 5 courses this month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
          <Download className="h-5 w-5 text-gray-600" />
          <span className="text-sm">Downloaded Courses</span>
        </button>
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="text-sm">Notifications</span>
        </button>
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
          <Settings className="h-5 w-5 text-gray-600" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </div>
  )
}

function OfflineScreen({ downloadProgress }: { downloadProgress: number }) {
  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Offline Learning</h2>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <WifiOff className="h-4 w-4" />
          <span>Offline</span>
        </div>
      </div>

      {/* Storage Info */}
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Storage Used</span>
          <span className="text-sm text-gray-600">2.4 GB / 5 GB</span>
        </div>
        <div className="bg-blue-200 rounded-full h-2">
          <div className="bg-blue-500 rounded-full h-2 w-1/2" />
        </div>
      </div>

      {/* Downloaded Courses */}
      <div>
        <h3 className="font-medium mb-3">Downloaded Courses</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <div className="w-12 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
            <div className="flex-1">
              <h4 className="text-sm font-medium">React Hooks Masterclass</h4>
              <p className="text-xs text-gray-600">12 lessons • 850 MB</p>
            </div>
            <button className="p-2 text-blue-500">
              <Play className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <div className="w-12 h-9 bg-gradient-to-br from-green-500 to-teal-600 rounded" />
            <div className="flex-1">
              <h4 className="text-sm font-medium">JavaScript Fundamentals</h4>
              <p className="text-xs text-gray-600">8 lessons • 620 MB</p>
            </div>
            <button className="p-2 text-green-500">
              <Play className="h-4 w-4" />
            </button>
          </div>

          {/* Downloading Course */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
            <div className="w-12 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded" />
            <div className="flex-1">
              <h4 className="text-sm font-medium">UI/UX Design Principles</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-purple-500 rounded-full h-1.5 w-1/3" />
                </div>
                <span className="text-xs text-gray-600">33%</span>
              </div>
            </div>
            <button className="p-2 text-gray-400">
              <Pause className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Available for Download */}
      <div>
        <h3 className="font-medium mb-3">Available for Download</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <div className="w-12 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded" />
            <div className="flex-1">
              <h4 className="text-sm font-medium">Node.js Backend Development</h4>
              <p className="text-xs text-gray-600">15 lessons • 1.2 GB</p>
            </div>
            <button className="p-2 text-blue-500">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
