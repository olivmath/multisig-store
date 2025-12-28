import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-gray-900 border border-gray-800 rounded-md p-6',
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:border-blue-600/50 hover:shadow-lg',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
