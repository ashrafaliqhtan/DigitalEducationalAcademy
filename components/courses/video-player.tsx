"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  videoUrl: string
  lessonId: string
  userId: string
  progress: number
}

export default function VideoPlayer({ videoUrl, lessonId, userId, progress }: VideoPlayerProps) {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update progress to Supabase
  const updateProgress = async (progress: number) => {
    try {
      const supabase = getSupabaseBrowserClient()

      // Update lesson progress
      await supabase.from("lesson_progress").upsert({
        enrollment_id: userId, // This should be the enrollment ID, but we're using userId for simplicity
        lesson_id: lessonId,
        completed: progress >= 0.9,
        watched_seconds: Math.round(videoRef.current?.currentTime || 0),
        last_watched: new Date().toISOString(),
      })

      // Refresh the page to update UI
      router.refresh()
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  // Handle video end
  const handleEnded = () => {
    updateProgress(1)
  }

  // Format time
  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2, "0")

    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`
    }

    return `${mm}:${ss}`
  }

  // Show/hide controls on mouse movement
  const handleMouseMove = () => {
    setShowControls(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // For simplicity, we'll use a placeholder video
  return (
    <div
      className="relative aspect-video bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      )}

      <video
        ref={videoRef}
        src={videoUrl || "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"}
        className="w-full h-full"
        onLoadedMetadata={() => {
          setIsReady(true)
          setDuration(videoRef.current?.duration || 0)
        }}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setPlayed(videoRef.current.currentTime / videoRef.current.duration)
          }
        }}
        onEnded={handleEnded}
        onClick={() => setIsPlaying(!isPlaying)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Custom Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity",
          showControls || !isPlaying ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Progress bar */}
        <div className="mb-2">
          <Slider
            value={[played * 100]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={(value) => {
              if (videoRef.current) {
                const newTime = (value[0] / 100) * videoRef.current.duration
                videoRef.current.currentTime = newTime
              }
            }}
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => {
                if (videoRef.current) {
                  if (isPlaying) {
                    videoRef.current.pause()
                  } else {
                    videoRef.current.play()
                  }
                  setIsPlaying(!isPlaying)
                }
              }}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
                }
              }}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10)
                }
              }}
            >
              <SkipForward className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !isMuted
                    setIsMuted(!isMuted)
                  }
                }}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              <Slider
                value={[isMuted ? 0 : volume * 100]}
                min={0}
                max={100}
                step={10}
                onValueChange={(value) => {
                  const newVolume = value[0] / 100
                  setVolume(newVolume)
                  setIsMuted(newVolume === 0)
                  if (videoRef.current) {
                    videoRef.current.volume = newVolume
                    videoRef.current.muted = newVolume === 0
                  }
                }}
                className="w-20"
              />
            </div>

            <span className="text-xs text-white ml-2">
              {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => {
              if (videoRef.current) {
                if (videoRef.current.requestFullscreen) {
                  videoRef.current.requestFullscreen()
                }
              }
            }}
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
