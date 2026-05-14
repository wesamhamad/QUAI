"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
}

interface SelectContextType {
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  selectedLabel: React.ReactNode | null
  setSelectedLabel: (label: React.ReactNode) => void
}

const SelectContext = React.createContext<SelectContextType>({
  open: false,
  setOpen: () => {},
  selectedLabel: null,
  setSelectedLabel: () => {},
})

function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedLabel, setSelectedLabel] = React.useState<React.ReactNode | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, selectedLabel, setSelectedLabel }}>
      <div ref={containerRef} className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({
  className,
  children,
  id,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = React.useContext(SelectContext)

  return (
    <button
      type="button"
      role="combobox"
      aria-expanded={open}
      id={id}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="h-4 w-4 opacity-50 shrink-0" />
    </button>
  )
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value, selectedLabel } = React.useContext(SelectContext)

  if (!value && placeholder) {
    return <span className="text-muted-foreground">{placeholder}</span>
  }

  return <span>{selectedLabel || value}</span>
}

function SelectContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = React.useContext(SelectContext)
  const ref = React.useRef<HTMLDivElement>(null)
  const [openUpward, setOpenUpward] = React.useState(false)

  React.useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.top
      setOpenUpward(spaceBelow < 250)
    }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-[100] max-h-60 w-full overflow-auto rounded-md border border-dga-gray-200 bg-white p-1 text-foreground shadow-lg",
        openUpward ? "bottom-full mb-1" : "top-full mt-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function SelectItem({
  className,
  children,
  value,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { value: selectedValue, onValueChange, setOpen, setSelectedLabel } = React.useContext(SelectContext)
  const isSelected = selectedValue === value

  // Keep the label in sync when the item is selected
  React.useEffect(() => {
    if (isSelected) {
      setSelectedLabel(children)
    }
  }, [isSelected, children, setSelectedLabel])

  return (
    <div
      role="option"
      aria-selected={isSelected}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      onClick={() => {
        onValueChange?.(value)
        setSelectedLabel(children)
        setOpen(false)
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function SelectGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-1", className)} {...props} />
}

function SelectLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
