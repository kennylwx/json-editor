'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ErrorPanel } from '@/components/ErrorPanel'

const JSONEditor = dynamic(() => import('@/components/JSONEditor').then(mod => ({ default: mod.JSONEditor })), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />,
})

const DEFAULT_JSON = `{
  "name": "example",
  "version": "1.0.0",
  "description": "A sample JSON object"
}`

export default function Home() {
  const [jsonValue, setJsonValue] = useState(DEFAULT_JSON)
  const [errors, setErrors] = useState<Array<{ line: number; message: string }>>([])
  const [isFormatting, setIsFormatting] = useState(false)

  const handleFormat = () => {
    setIsFormatting(true)
    try {
      const parsed = JSON.parse(jsonValue)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonValue(formatted)
    } catch (error) {
      if (error instanceof Error) {
        alert(`Cannot format invalid JSON: ${error.message}`)
      }
    }
    setIsFormatting(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              JSON Editor
            </h1>
            <div className="flex gap-3">
              <button
                onClick={handleFormat}
                disabled={isFormatting}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFormatting ? 'Formatting...' : 'Format'}
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Editor */}
          <JSONEditor
            value={jsonValue}
            onChange={setJsonValue}
            onValidation={setErrors}
            onFormat={handleFormat}
          />

          {/* Error Panel */}
          <ErrorPanel errors={errors} />
        </div>
      </div>
    </div>
  )
}
