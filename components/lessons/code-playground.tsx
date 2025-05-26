"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, RefreshCw, Download, Copy, Check, Terminal, CodeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface CodePlaygroundProps {
  language: string
  code: string
  editable?: boolean
  onComplete?: () => void
  autoRun?: boolean
  height?: string
  showLineNumbers?: boolean
  theme?: "light" | "dark" | "system"
}

export default function CodePlayground({
  language,
  code: initialCode,
  editable = true,
  onComplete,
  autoRun = false,
  height = "400px",
  showLineNumbers = true,
  theme: propTheme,
}: CodePlaygroundProps) {
  const { toast } = useToast()
  const { theme: systemTheme } = useTheme()
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("code")
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const theme = propTheme || systemTheme || "light"

  useEffect(() => {
    if (autoRun) {
      handleRun()
    }
  }, [])

  const handleRun = async () => {
    setIsRunning(true)
    setOutput("")
    setActiveTab("output")

    try {
      // For JavaScript/TypeScript, we can use a simple eval in a try/catch
      // For other languages, in a real implementation, this would call an API
      if (language === "javascript" || language === "typescript") {
        // Create a safe execution environment
        const originalConsoleLog = console.log
        const logs: string[] = []

        // Override console.log to capture output
        console.log = (...args) => {
          logs.push(args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" "))
        }

        try {
          // Execute the code
          const result = new Function(`
            "use strict";
            try {
              ${code}
            } catch (error) {
              return "Error: " + error.message;
            }
          `)()

          // Set the output
          setOutput(logs.join("\n") + (result !== undefined ? `\n${result}` : ""))

          // Mark as complete if provided
          if (onComplete) {
            onComplete()
          }
        } catch (error) {
          setOutput(`Error: ${(error as Error).message}`)
        } finally {
          // Restore original console.log
          console.log = originalConsoleLog
        }
      } else {
        // For other languages, show a mock response
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setOutput(
          `[${language} execution simulated]\n\nHello, world!\nThis is a simulated output for ${language} code.`,
        )

        if (onComplete) {
          onComplete()
        }
      }
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)

    toast({
      title: "Code copied",
      description: "The code has been copied to your clipboard",
      duration: 2000,
    })
  }

  const handleDownload = () => {
    const fileExtension = getFileExtension(language)
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code-snippet.${fileExtension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Code downloaded",
      description: `The code has been downloaded as code-snippet.${fileExtension}`,
      duration: 2000,
    })
  }

  const handleReset = () => {
    setCode(initialCode)
    setOutput("")

    toast({
      title: "Code reset",
      description: "The code has been reset to its initial state",
      duration: 2000,
    })
  }

  const getFileExtension = (lang: string): string => {
    switch (lang.toLowerCase()) {
      case "javascript":
        return "js"
      case "typescript":
        return "ts"
      case "python":
        return "py"
      case "java":
        return "java"
      case "c":
        return "c"
      case "cpp":
      case "c++":
        return "cpp"
      case "csharp":
      case "c#":
        return "cs"
      case "php":
        return "php"
      case "ruby":
        return "rb"
      case "go":
        return "go"
      case "rust":
        return "rs"
      case "swift":
        return "swift"
      case "kotlin":
        return "kt"
      case "html":
        return "html"
      case "css":
        return "css"
      default:
        return "txt"
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CodeIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{language.charAt(0).toUpperCase() + language.slice(1)} Playground</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy} title="Copy code">
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload} title="Download code">
            <Download className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset} title="Reset code">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start rounded-none border-b bg-muted">
          <TabsTrigger value="code" className="rounded-none data-[state=active]:bg-background">
            Code
          </TabsTrigger>
          <TabsTrigger value="output" className="rounded-none data-[state=active]:bg-background">
            Output
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="m-0">
          <div className="relative" style={{ height }}>
            {showLineNumbers && (
              <div
                className="absolute left-0 top-0 bottom-0 w-10 bg-muted/50 text-right pr-2 pt-2 pb-2 text-xs text-muted-foreground font-mono"
                aria-hidden="true"
              >
                {code.split("\n").map((_, i) => (
                  <div key={i} className="h-6">
                    {i + 1}
                  </div>
                ))}
              </div>
            )}

            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={cn(
                "font-mono text-sm w-full h-full resize-none p-2 focus:outline-none",
                showLineNumbers && "pl-12",
                theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900",
              )}
              disabled={!editable}
              spellCheck="false"
              aria-label="Code editor"
            />
          </div>

          <div className="p-2 bg-muted flex justify-end">
            <Button onClick={handleRun} disabled={isRunning} className="gap-2">
              {isRunning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.div>
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Code
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="output" className="m-0">
          <div
            ref={outputRef}
            className={cn(
              "font-mono text-sm p-4 overflow-auto",
              theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-black text-green-400",
            )}
            style={{ height, whiteSpace: "pre-wrap" }}
            aria-live="polite"
          >
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Terminal className="h-4 w-4" />
              <span>Console Output</span>
            </div>

            {output || (
              <span className="text-muted-foreground">
                {isRunning ? "Running code..." : "Run the code to see output here"}
              </span>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
