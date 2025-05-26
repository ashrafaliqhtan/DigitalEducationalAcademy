"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Pause, Play, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface TextToSpeechProps {
  text: string
  autoDetectLanguage?: boolean
}

export default function TextToSpeech({ text, autoDetectLanguage = true }: TextToSpeechProps) {
  const { toast } = useToast()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [rate, setRate] = useState<number>(1)
  const [pitch, setPitch] = useState<number>(1)
  const [volume, setVolume] = useState<number>(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Check if speech synthesis is supported
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      setIsSupported(false)
      return
    }

    // Initialize voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      if (availableVoices.length > 0) {
        setVoices(availableVoices)

        // Try to select a default voice based on browser language
        const browserLang = navigator.language || "en-US"
        const defaultVoice =
          availableVoices.find((voice) => voice.lang.includes(browserLang) && voice.default) ||
          availableVoices.find((voice) => voice.lang.includes(browserLang)) ||
          availableVoices[0]

        setSelectedVoice(defaultVoice.name)
      }
    }

    loadVoices()

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    // Cleanup
    return () => {
      if (utteranceRef.current && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handlePlay = () => {
    if (!isSupported) {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      })
      return
    }

    if (isPaused && utteranceRef.current) {
      window.speechSynthesis.resume()
      setIsPlaying(true)
      setIsPaused(false)
      return
    }

    if (isPlaying) {
      window.speechSynthesis.pause()
      setIsPaused(true)
      setIsPlaying(false)
      return
    }

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    // Set voice
    if (selectedVoice) {
      const voice = voices.find((v) => v.name === selectedVoice)
      if (voice) {
        utterance.voice = voice
      }
    }

    // Set other properties
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = isMuted ? 0 : volume

    // Handle events
    utterance.onstart = () => {
      setIsPlaying(true)
    }

    utterance.onpause = () => {
      setIsPaused(true)
      setIsPlaying(false)
    }

    utterance.onresume = () => {
      setIsPlaying(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = (event) => {
      console.error("TTS Error:", event)
      setIsPlaying(false)
      setIsPaused(false)
      toast({
        title: "Error",
        description: "An error occurred while playing text-to-speech.",
        variant: "destructive",
      })
    }

    // Speak
    window.speechSynthesis.cancel() // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance)
  }

  const handleStop = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setIsPaused(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (utteranceRef.current) {
      utteranceRef.current.volume = !isMuted ? 0 : volume
    }
  }

  if (!isSupported) {
    return (
      <Button variant="outline" size="sm" className="gap-2 opacity-50 cursor-not-allowed" disabled>
        <VolumeX className="h-4 w-4" />
        Not supported
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePlay}
        className="gap-2"
        aria-label={isPlaying ? "Pause speech" : "Play speech"}
      >
        {isPlaying ? (
          <>
            <Pause className="h-4 w-4" />
            Pause
          </>
        ) : isPaused ? (
          <>
            <Play className="h-4 w-4" />
            Resume
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            Listen
          </>
        )}
      </Button>

      {(isPlaying || isPaused) && (
        <Button variant="ghost" size="sm" onClick={handleStop} aria-label="Stop speech">
          Stop
        </Button>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
            <span className="sr-only">TTS Settings</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Text-to-Speech Settings</h4>

            <div className="space-y-2">
              <Label htmlFor="voice-select">Voice</Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger id="voice-select">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="rate-slider">Speed</Label>
                <span className="text-sm text-muted-foreground">{rate}x</span>
              </div>
              <Slider
                id="rate-slider"
                min={0.5}
                max={2}
                step={0.1}
                value={[rate]}
                onValueChange={(value) => setRate(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="pitch-slider">Pitch</Label>
                <span className="text-sm text-muted-foreground">{pitch}</span>
              </div>
              <Slider
                id="pitch-slider"
                min={0.5}
                max={2}
                step={0.1}
                value={[pitch]}
                onValueChange={(value) => setPitch(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="volume-slider">Volume</Label>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
              <Slider
                id="volume-slider"
                min={0}
                max={1}
                step={0.1}
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                disabled={isMuted}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
