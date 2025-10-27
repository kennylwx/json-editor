'use client'

import Editor, { OnMount, Monaco } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useEffect, useState, useRef } from 'react'
import type { editor } from 'monaco-editor'

interface JSONEditorProps {
  value: string
  onChange: (value: string) => void
  onValidation: (errors: Array<{ line: number; message: string }>) => void
  onFormat: () => void
}

export function JSONEditor({ value, onChange, onValidation, onFormat }: JSONEditorProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const decorationsRef = useRef<string[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Register a custom hover provider for JSON errors
    monaco.languages.registerHoverProvider('json', {
      provideHover: (model, position) => {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri })
        const marker = markers.find(
          (m) =>
            m.startLineNumber <= position.lineNumber &&
            m.endLineNumber >= position.lineNumber
        )

        if (marker) {
          return {
            range: new monaco.Range(
              marker.startLineNumber,
              marker.startColumn,
              marker.endLineNumber,
              marker.endColumn
            ),
            contents: [
              {
                value: `**Error:** ${marker.message}`,
              },
              {
                value: `[Fix with AI](#fix-${marker.startLineNumber})`,
                isTrusted: true,
              },
            ],
          }
        }

        return null
      },
    })

    // Listen for marker changes to update validation
    editor.onDidChangeModelDecorations(() => {
      const model = editor.getModel()
      if (!model) return

      const markers = monaco.editor.getModelMarkers({ resource: model.uri })
      const errors = markers
        .filter((m) => m.severity === monaco.MarkerSeverity.Error)
        .map((m) => ({
          line: m.startLineNumber,
          message: m.message,
        }))

      onValidation(errors)
    })

    // Handle clicks on "Fix with AI" links
    editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.CONTENT_TEXT) {
        const position = e.target.position
        if (!position) return

        const model = editor.getModel()
        if (!model) return

        const markers = monaco.editor.getModelMarkers({ resource: model.uri })
        const marker = markers.find(
          (m) =>
            m.startLineNumber === position.lineNumber &&
            m.severity === monaco.MarkerSeverity.Error
        )

        if (marker) {
          handleAIFix(marker.startLineNumber, marker.message)
        }
      }
    })
  }

  const handleAIFix = async (line: number, errorMessage: string) => {
    try {
      const response = await fetch('/api/fix-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          json: value,
          error: errorMessage,
          line,
        }),
      })

      if (!response.ok) throw new Error('Failed to fix JSON')

      const data = await response.json()
      onChange(data.fixedJson)
    } catch (error) {
      console.error('Error fixing JSON:', error)
      alert('Failed to fix JSON with AI. Please try again.')
    }
  }

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const editor = editorRef.current
      const monaco = monacoRef.current

      // Add action to format JSON
      editor.addAction({
        id: 'format-json',
        label: 'Format JSON',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
        run: () => {
          onFormat()
        },
      })
    }
  }, [onFormat])

  if (!mounted) {
    return <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
  }

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      <Editor
        height="600px"
        defaultLanguage="json"
        value={value}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  )
}
