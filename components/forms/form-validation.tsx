"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { z } from "zod"

export interface ValidationRule<T = any> {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: T) => string | null
  email?: boolean
  url?: boolean
  number?: boolean
  min?: number
  max?: number
}

export interface FieldError {
  message: string
  type: string
}

export interface FormState<T extends Record<string, any>> {
  values: T
  errors: Partial<Record<keyof T, FieldError>>
  touched: Partial<Record<keyof T, boolean>>
  isValid: boolean
  isSubmitting: boolean
}

export function useFormValidation<T extends Record<string, any>>(initialValues: T, validationSchema?: z.ZodSchema<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isValid: true,
    isSubmitting: false,
  })

  const validateField = useCallback(
    (name: keyof T, value: any): FieldError | null => {
      if (validationSchema) {
        try {
          validationSchema.parse({ ...state.values, [name]: value })
          return null
        } catch (error) {
          if (error instanceof z.ZodError) {
            const fieldError = error.errors.find((err) => err.path.includes(name as string))
            if (fieldError) {
              return {
                message: fieldError.message,
                type: fieldError.code,
              }
            }
          }
        }
      }
      return null
    },
    [validationSchema, state.values],
  )

  const validateForm = useCallback((): boolean => {
    if (!validationSchema) return true

    try {
      validationSchema.parse(state.values)
      setState((prev) => ({ ...prev, errors: {}, isValid: true }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof T, FieldError>> = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof T
          if (field) {
            errors[field] = {
              message: err.message,
              type: err.code,
            }
          }
        })
        setState((prev) => ({ ...prev, errors, isValid: false }))
        return false
      }
    }
    return false
  }, [validationSchema, state.values])

  const setValue = useCallback(
    (name: keyof T, value: any) => {
      setState((prev) => {
        const newValues = { ...prev.values, [name]: value }
        const error = validateField(name, value)
        const newErrors = { ...prev.errors }

        if (error) {
          newErrors[name] = error
        } else {
          delete newErrors[name]
        }

        return {
          ...prev,
          values: newValues,
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        }
      })
    },
    [validateField],
  )

  const setTouched = useCallback((name: keyof T, touched = true) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [name]: touched },
    }))
  }, [])

  const setError = useCallback((name: keyof T, error: FieldError | null) => {
    setState((prev) => {
      const newErrors = { ...prev.errors }
      if (error) {
        newErrors[name] = error
      } else {
        delete newErrors[name]
      }
      return {
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      }
    })
  }, [])

  const reset = useCallback(
    (newValues?: Partial<T>) => {
      setState({
        values: { ...initialValues, ...newValues },
        errors: {},
        touched: {},
        isValid: true,
        isSubmitting: false,
      })
    },
    [initialValues],
  )

  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void> | void) => {
      setState((prev) => ({ ...prev, isSubmitting: true }))

      try {
        const isValid = validateForm()
        if (!isValid) {
          return false
        }

        await onSubmit(state.values)
        return true
      } catch (error) {
        console.error("Form submission error:", error)
        return false
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }))
      }
    },
    [validateForm, state.values],
  )

  return {
    ...state,
    setValue,
    setTouched,
    setError,
    reset,
    validateForm,
    handleSubmit,
  }
}

// Common validation schemas
export const commonSchemas = {
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),
  url: z.string().url("Please enter a valid URL"),
  required: (message = "This field is required") => z.string().min(1, message),
}

// Form field component with validation
export function ValidatedInput({
  name,
  value,
  error,
  touched,
  onChange,
  onBlur,
  ...props
}: {
  name: string
  value: string
  error?: FieldError
  touched?: boolean
  onChange: (value: string) => void
  onBlur: () => void
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full px-3 py-2 border rounded-md ${
          error && touched ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
        }`}
      />
      {error && touched && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}
