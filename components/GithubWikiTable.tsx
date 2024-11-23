'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

interface TableData {
  title: string
  rows: [string, string][]
}

interface GithubWikiTableProps {
  data: TableData[]
}

export default function GithubWikiTable({ data }: GithubWikiTableProps) {
  const [copiedRows, setCopiedRows] = useState<Set<string>>(new Set())
  const [showCopiedRows, setShowCopiedRows] = useState(true)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Command Snippets</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm">복사한 행 표시</span>
          <Switch
            checked={showCopiedRows}
            onCheckedChange={setShowCopiedRows}
          />
        </div>
      </div>
      {data.map((table, index) => (
        <CollapsibleTable
          key={index}
          table={table}
          copiedRows={copiedRows}
          setCopiedRows={setCopiedRows}
          showCopiedRows={showCopiedRows}
        />
      ))}
    </div>
  )
}

function CollapsibleTable({
  table,
  copiedRows,
  setCopiedRows,
  showCopiedRows,
}: {
  table: TableData
  copiedRows: Set<string>
  setCopiedRows: React.Dispatch<React.SetStateAction<Set<string>>>
  showCopiedRows: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded-md">
      <div className="flex items-center justify-between p-4">
        <button
          className="flex items-center text-left font-medium"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown className="mr-2" /> : <ChevronRight className="mr-2" />}
          {table.title}
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newCopiedRows = new Set(copiedRows);
            table.rows.forEach((_, rowIndex) => {
              newCopiedRows.delete(`${table.title}-${rowIndex}`);
            });
            setCopiedRows(newCopiedRows);
          }}
        >
          표시 지우기
        </Button>
      </div>
      {isOpen && (
        <div className="p-4 overflow-x-auto">
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: '30%' }} />
              <col style={{ width: '70%' }} />
            </colgroup>
            <tbody>
              {table.rows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  data={row}
                  isCopied={copiedRows.has(`${table.title}-${rowIndex}`)}
                  showCopied={showCopiedRows}
                  onCopy={() => {
                    const newCopiedRows = new Set(copiedRows)
                    newCopiedRows.add(`${table.title}-${rowIndex}`)
                    setCopiedRows(newCopiedRows)
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function TableRow({
  data,
  isCopied,
  showCopied,
  onCopy
}: {
  data: [string, string]
  isCopied: boolean
  showCopied: boolean
  onCopy: () => void
}) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data[1])
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <tr className={`border-b last:border-b-0 ${showCopied && isCopied ? 'bg-blue-50' : ''}`}>
      <td className="py-2 pr-4 font-medium align-top">{data[0]}</td>
      <td className="py-2 pl-4">
        <div className="flex justify-between items-start">
          <pre className="font-mono bg-gray-100 p-1 rounded whitespace-pre-wrap break-all max-w-[calc(100%-3rem)]">
            {data[1]}
          </pre>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="ml-2 flex-shrink-0 w-[70px]"
          >
            {copied ? (
              <span className="text-xs">Copied!</span>
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </td>
    </tr>
  )
}

