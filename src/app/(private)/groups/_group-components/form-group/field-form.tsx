import { DetailedHTMLProps, LabelHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type FieldFormProps = DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> & {
  children: ReactNode
  label: string
  errorMessage?: string
  className?: string
}

export function FieldForm({
  children,
  label,
  errorMessage,
  className,
  ...props
}: FieldFormProps) {
  return (
    <label className={twMerge('flex flex-col gap-2', className)} {...props}>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {children}
      {errorMessage && (
        <span className="text-xs text-red-400">{errorMessage}</span>
      )}
    </label>
  )
}
