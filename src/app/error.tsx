'use client'

import { Button } from '@/components/ui/button'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="w-full md:w-3/12">
        <h2 className="text-xl font-bold">Oh no!</h2>
        <p className="my-2">
          There was an issue with our chat. This could be a temporary issue,
          please try your action again.
        </p>
        <Button
          onClick={() => reset()}
          variant="secondary"
          className="mt-6 w-full"
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}
