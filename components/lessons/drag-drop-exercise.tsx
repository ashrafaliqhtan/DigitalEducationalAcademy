"use client"

import { useState, useEffect } from "react"
import { motion, Reorder, useDragControls } from "framer-motion"
import { GripVertical, CheckCircle, RefreshCw, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface DragDropItem {
  id: string
  content: string
  correctPosition: number
}

interface DragDropExerciseProps {
  exerciseData: {
    title?: string
    description?: string
    items: DragDropItem[]
    hint?: string
  }
  onComplete: () => void
}

export default function DragDropExercise({ exerciseData, onComplete }: DragDropExerciseProps) {
  const { toast } = useToast()
  const [items, setItems] = useState<DragDropItem[]>([])
  const [showHint, setShowHint] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    // Shuffle the items initially
    if (exerciseData.items && exerciseData.items.length > 0) {
      setItems([...exerciseData.items].sort(() => Math.random() - 0.5))
    }
  }, [exerciseData])

  const handleCheck = () => {
    setIsChecking(true)
    setAttempts(attempts + 1)

    // Check if items are in correct order
    const isOrderCorrect = items.every((item, index) => item.correctPosition === index + 1)
    setIsCorrect(isOrderCorrect)

    if (isOrderCorrect) {
      toast({
        title: "Correct!",
        description: "You've arranged the items in the correct order.",
        duration: 3000,
      })

      // Call onComplete callback
      onComplete()
    } else {
      toast({
        title: "Not quite right",
        description: "Try again! The order is not correct.",
        variant: "destructive",
        duration: 3000,
      })
    }

    setTimeout(() => {
      setIsChecking(false)
    }, 1500)
  }

  const handleReset = () => {
    // Shuffle the items again
    setItems([...items].sort(() => Math.random() - 0.5))
    setIsCorrect(null)

    toast({
      title: "Exercise reset",
      description: "The items have been shuffled again.",
      duration: 2000,
    })
  }

  if (!exerciseData.items || exerciseData.items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No exercise data</h3>
          <p className="text-muted-foreground">This exercise doesn't have any items to arrange.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "border-2 transition-colors duration-300",
        isCorrect === true ? "border-green-500" : isCorrect === false ? "border-red-500" : "border-muted",
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{exerciseData.title || "Arrange in the correct order"}</span>
          <Badge variant="outline">Drag & Drop</Badge>
        </CardTitle>
        {exerciseData.description && <p className="text-muted-foreground">{exerciseData.description}</p>}
      </CardHeader>

      <CardContent className="p-6">
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
          {items.map((item) => (
            <DraggableItem key={item.id} item={item} isCorrect={isCorrect} correctPosition={item.correctPosition} />
          ))}
        </Reorder.Group>

        {showHint && exerciseData.hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
          >
            <p className="font-medium">Hint:</p>
            <p>{exerciseData.hint}</p>
          </motion.div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>

          {exerciseData.hint && (
            <Button variant="ghost" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
          )}
        </div>

        <Button onClick={handleCheck} disabled={isChecking || isCorrect === true} className="gap-2">
          {isChecking ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
          ) : isCorrect === true ? (
            <CheckCircle className="h-4 w-4" />
          ) : null}
          {isChecking ? "Checking..." : isCorrect === true ? "Correct!" : "Check Order"}
        </Button>
      </CardFooter>
    </Card>
  )
}

interface DraggableItemProps {
  item: DragDropItem
  isCorrect: boolean | null
  correctPosition: number
}

function DraggableItem({ item, isCorrect, correctPosition }: DraggableItemProps) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={item}
      dragControls={dragControls}
      className={cn(
        "p-4 rounded-lg border bg-card flex items-center gap-3 cursor-move",
        isCorrect === true && correctPosition === 1 ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "",
      )}
    >
      <div className="touch-none" onPointerDown={(e) => dragControls.start(e)}>
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1">{item.content}</div>

      {isCorrect === true && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
    </Reorder.Item>
  )
}
