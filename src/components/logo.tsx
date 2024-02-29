import { twMerge } from 'tailwind-merge'

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 51 49"
        className={twMerge(className, 'size-9 md:size-10')}
      >
        <path
          stroke="#8c59e5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16.79 40.83c4.05 2 8.72 2.54 13.15 1.53a19.19 19.19 0 0 0 11.03-7.06 17.86 17.86 0 0 0-1.93-23.8 19.7 19.7 0 0 0-24.79-1.86 18.35 18.35 0 0 0-7.34 10.6A17.73 17.73 0 0 0 8.5 32.86L4.25 44.92l12.54-4.09ZM17 24.5h.02M25.5 24.5h.02M34 24.5h.02"
        />
      </svg>
      <p className="sr-only">Chat</p>
      <p className="hidden text-2xl font-bold text-zinc-800 dark:text-zinc-300 md:block">
        Chat
      </p>
    </div>
  )
}
