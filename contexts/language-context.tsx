"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Default English translations
import enTranslations from "@/translations/en.json"
import arTranslations from "@/translations/ar.json"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
  isRTL: false,
})

export const useLanguage = () => useContext(LanguageContext)

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState(enTranslations)
  const [isRTL, setIsRTL] = useState(false)

  useEffect(() => {
    // Check if there's a saved language preference
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        if (language === "en") {
          setTranslations(enTranslations)
          setIsRTL(false)
        } else if (language === "ar") {
          // Use the imported Arabic translations
          setTranslations(arTranslations)
          setIsRTL(true)
        }

        // Save language preference
        localStorage.setItem("language", language)

        // Set document direction
        document.documentElement.dir = isRTL ? "rtl" : "ltr"
        document.documentElement.lang = language
      } catch (error) {
        console.error("Failed to load translations:", error)
        // Fallback to English
        setTranslations(enTranslations)
        setIsRTL(false)
      }
    }

    loadTranslations()
  }, [language, isRTL])

  const t = (key: string): string => {
    // Split the key by dots to access nested properties
    const keys = key.split(".")
    let value: any = translations

    // Traverse the translations object
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        // If key not found, return the key itself
        return key
      }
    }

    return typeof value === "string" ? value : key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>{children}</LanguageContext.Provider>
}
