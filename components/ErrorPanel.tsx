'use client'

interface ErrorPanelProps {
  errors: Array<{ line: number; message: string }>
}

export function ErrorPanel({ errors }: ErrorPanelProps) {
  if (errors.length === 0) {
    return null
  }

  return (
    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-600 dark:text-red-400 font-semibold">
          ⚠ {errors.length} error{errors.length > 1 ? 's' : ''} found
        </span>
      </div>
      <ul className="space-y-1 text-sm">
        {errors.map((error, index) => (
          <li key={index} className="text-red-700 dark:text-red-300">
            • Line {error.line}: {error.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
