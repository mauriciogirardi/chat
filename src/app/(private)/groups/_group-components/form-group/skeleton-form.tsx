import { twMerge } from 'tailwind-merge'

import { Skeleton } from '@/components/ui/skeleton'

import { FieldForm } from './field-form'

export const SelectUserSkeleton = () => {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">
        Selected users (0)
      </p>

      <div
        dir="rtl"
        className={twMerge(
          'mt-4 h-[calc(100vh_-_16.1rem)] w-full md:w-[350px] lg:w-[400px] ',
          'overflow-y-auto scrollbar-thin dark:scrollbar-track-zinc-800 dark:scrollbar-thumb-zinc-700',
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            className="mt-6 flex items-center space-x-3 pl-3"
            dir="ltr"
            key={i}
          >
            <Skeleton className="h-5 w-5 rounded-md" />
            <label className="flex items-center gap-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-40 rounded" />
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonForm() {
  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="hidden md:block">
        <SelectUserSkeleton />
      </div>

      <div className="flex justify-end md:hidden">
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>

      <div className="w-full">
        <div className="flex flex-col items-center gap-11 md:flex-row md:items-start">
          <FieldForm label=" Group Profile Picture" className="md:inline-flex">
            <Skeleton className="ml-4 mt-2 size-28 rounded-full" />
          </FieldForm>

          <div className="mb-9 w-full flex-1 space-y-6">
            <FieldForm label="Group Name">
              <Skeleton className="h-10 w-full rounded-md " />
            </FieldForm>

            <FieldForm label="Group Description">
              <Skeleton className="min-h-[80px] w-full rounded-md" />
            </FieldForm>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-end md:pt-0">
          <Skeleton className="h-10 w-full rounded-md md:w-32" />
          <Skeleton className="h-10 w-full rounded-md md:w-36" />
        </div>
      </div>
    </div>
  )
}
