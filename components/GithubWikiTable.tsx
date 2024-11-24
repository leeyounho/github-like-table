'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronRight, Copy, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export interface TableData {
  title: string
  rows: [string, string][]
  replacements?: { [key: string]: string }
}

interface GithubWikiTableProps {
  data: TableData[]
}

function generateUniqueId(title: string, index: number): string {
  return `${title.toLowerCase().replace(/\s+/g, '-')}-${index}`
}

export function GithubWikiTable({ data }: GithubWikiTableProps) {
  const [copiedRows, setCopiedRows] = useState<Set<string>>(new Set())
  const [showCopiedRows, setShowCopiedRows] = useState(true)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [tableData, setTableData] = useState<TableData[]>(data)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id)
            }
          })
        },
        { rootMargin: '-20% 0px -80% 0px' }
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observerRef.current?.observe(ref)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      const element = document.getElementById(hash)
      if (element) {
        const headerOffset = 100
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
      <div className="flex">
        <TableOfContents data={tableData} activeSection={activeSection} />
        <div className="flex-grow space-y-4 ml-64">
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 p-4">
            <h1 className="text-2xl font-bold">GitHub Wiki-style Tables</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm">복사한 행 표시</span>
              <Switch
                  checked={showCopiedRows}
                  onCheckedChange={setShowCopiedRows}
              />
            </div>
          </div>
          {tableData.map((table, index) => (
              <CollapsibleTable
                  key={generateUniqueId(table.title, index)}
                  table={table}
                  copiedRows={copiedRows}
                  setCopiedRows={setCopiedRows}
                  showCopiedRows={showCopiedRows}
                  sectionRef={(ref) => sectionRefs.current[generateUniqueId(table.title, index)] = ref}
                  uniqueId={generateUniqueId(table.title, index)}
                  onUpdateReplacements={(replacements) => {
                    const newTableData = [...tableData]
                    newTableData[index].replacements = replacements
                    setTableData(newTableData)
                  }}
              />
          ))}
        </div>
      </div>
  )
}

function TableOfContents({ data, activeSection }: { data: TableData[], activeSection: string | null }) {
  return (
      <nav className="fixed left-0 top-0 w-64 h-full overflow-auto p-4 bg-gray-100">
        <h2 className="text-lg font-semibold mb-2">목차</h2>
        <ul>
          {data.map((table, index) => {
            const uniqueId = generateUniqueId(table.title, index)
            return (
                <li key={uniqueId} className="mb-2">
                  <a
                      href={`#${uniqueId}`}
                      className={`block p-2 rounded hover:bg-gray-200 ${activeSection === uniqueId ? 'bg-gray-200 font-semibold' : ''}`}
                  >
                    {table.title}
                  </a>
                </li>
            )
          })}
        </ul>
      </nav>
  )
}

function CollapsibleTable({
                            table,
                            copiedRows,
                            setCopiedRows,
                            showCopiedRows,
                            sectionRef,
                            uniqueId,
                            onUpdateReplacements,
                          }: {
  table: TableData
  copiedRows: Set<string>
  setCopiedRows: React.Dispatch<React.SetStateAction<Set<string>>>
  showCopiedRows: boolean
  sectionRef: (ref: HTMLDivElement | null) => void
  uniqueId: string
  onUpdateReplacements: (replacements: { [key: string]: string }) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [replacements, setReplacements] = useState<{ [key: string]: string }>(table.replacements || {})
  const [localRows, setLocalRows] = useState<[string, string][]>(table.rows)

    const updateReplacements = (newReplacements: { [key: string]: string }) => {
        setReplacements(newReplacements);
        onUpdateReplacements(newReplacements);

        const updatedRows: [string, string][] = localRows.map(([key, value]) => {
            let newValue: string = value; // 명시적으로 string 타입 선언
            Object.entries(newReplacements).forEach(([replaceKey, replaceValue]) => {
                newValue = newValue.replace(new RegExp(replaceKey, 'g'), replaceValue);
            });
            return [key, newValue]; // [string, string] 반환
        });

        setLocalRows(updatedRows);
    };


  const clearHighlightsAndReplacements = () => {
    const newCopiedRows = new Set(copiedRows)
    localRows.forEach((_, rowIndex) => {
      newCopiedRows.delete(`${uniqueId}-${rowIndex}`)
    })
    setCopiedRows(newCopiedRows)
    setLocalRows(table.rows)
  }

  return (
      <div id={uniqueId} ref={sectionRef} className="border rounded-md">
        <div className="flex items-center justify-between p-4">
          <button
              className="flex items-center text-left font-medium"
              onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronDown className="mr-2" /> : <ChevronRight className="mr-2" />}
            {table.title}
          </button>
          <div className="flex items-center space-x-2">
            <ReplacementsDialog
                replacements={replacements}
                onUpdateReplacements={updateReplacements}
            />
            <Button
                variant="outline"
                size="sm"
                onClick={clearHighlightsAndReplacements}
            >
              Clear
            </Button>
          </div>
        </div>
        {isOpen && (
            <div className="p-4 overflow-x-auto">
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: '30%' }} />
                  <col style={{ width: '70%' }} />
                </colgroup>
                <tbody>
                {localRows.map((row, rowIndex) => (
                    <TableRow
                        key={rowIndex}
                        data={row as [string, string]}
                        isCopied={copiedRows.has(`${uniqueId}-${rowIndex}`)}
                        showCopied={showCopiedRows}
                        onCopy={() => {
                          const newCopiedRows = new Set(copiedRows)
                          newCopiedRows.add(`${uniqueId}-${rowIndex}`)
                          setCopiedRows(newCopiedRows)
                        }}
                        replacements={replacements}
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
                    onCopy,
                    replacements
                  }: {
  data: [string, string]
  isCopied: boolean
  showCopied: boolean
  onCopy: () => void
  replacements: { [key: string]: string }
}) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    let textToCopy = data[1];
    Object.entries(replacements).forEach(([key, value]) => {
      textToCopy = textToCopy.replace(new RegExp(key, 'g'), value);
    });
    navigator.clipboard.writeText(textToCopy);
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

function ReplacementsDialog({
                              replacements,
                              onUpdateReplacements,
                            }: {
  replacements: { [key: string]: string };
  onUpdateReplacements: (replacements: { [key: string]: string }) => void;
}) {
  const [localReplacements, setLocalReplacements] = useState<[string, string][]>(
      Object.entries(replacements)
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalReplacements(Object.entries(replacements));
    }
  }, [isOpen, replacements]);

  const handleAddNew = () => {
    setLocalReplacements([...localReplacements, ['', '']]);
  };

  const handleSave = () => {
    const filteredReplacements = Object.fromEntries(
        localReplacements.filter(([key, value]) => key && value)
    );
    onUpdateReplacements(filteredReplacements);
    setIsOpen(false);
  };

  const handleChange = (index: number, newKey: string, newValue: string) => {
    setLocalReplacements((prev) => {
      const updated = [...prev];
      updated[index] = [newKey, newValue];
      return updated;
    });
  };

  return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit2 className="h-4 w-4 mr-2" />
            Replace
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Replace Strings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {localReplacements.map(([key, value], index) => (
                <div key={index} className="grid grid-cols-2 items-center gap-4">
                  <Input
                      value={key}
                      onChange={(e) =>
                          handleChange(index, e.target.value, value)
                      }
                      placeholder="Key"
                  />
                  <Input
                      value={value}
                      onChange={(e) =>
                          handleChange(index, key, e.target.value)
                      }
                      placeholder="Value"
                  />
                </div>
            ))}
            <div className="flex justify-between items-center">
              <Button onClick={handleAddNew}>Add New Replacement</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
}


