import { CheckCheck } from 'lucide-react'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

type CardMessageProps = {
  image?: string
  text?: string
  createdAt?: string
  read?: boolean
  name?: string
  profilePicture?: string
  fallbackNameImage?: string
  isLoggedIn?: boolean
}

export const CardMessage = ({
  image,
  text,
  createdAt,
  read,
  name,
  profilePicture,
  fallbackNameImage,
  isLoggedIn,
}: CardMessageProps) => {
  const avatar = () => {
    return (
      <Avatar className="size-8">
        <AvatarImage src={profilePicture} />
        <AvatarFallback>{fallbackNameImage}</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <div
      className={twMerge(
        'mt-4 flex',
        isLoggedIn ? 'justify-end' : 'justify-start',
      )}
    >
      <div className="flex gap-2">
        {!isLoggedIn && avatar()}

        <div
          className={twMerge(
            'flex flex-col',
            isLoggedIn ? 'items-end' : 'items-start',
          )}
        >
          <div
            className={twMerge(
              'max-w-[300px] rounded-xl border p-2 shadow-lg lg:max-w-[400px]',
              isLoggedIn
                ? 'rounded-br-none border-zinc-400 bg-zinc-300 dark:border-zinc-700 dark:bg-zinc-800'
                : 'rounded-bl-none border-zinc-300 bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-600',
            )}
          >
            <span
              className={twMerge(
                'block pb-1 text-xs font-bold',
                isLoggedIn
                  ? 'text-violet-500 dark:text-violet-400'
                  : 'text-blue-600 dark:text-blue-400',
              )}
            >
              {name}
            </span>
            {image && (
              <Dialog>
                <DialogTrigger asChild>
                  <Image
                    src={image}
                    alt=""
                    width={200}
                    height={200}
                    priority
                    className="h-40 w-40 cursor-pointer object-cover"
                  />
                </DialogTrigger>
                <DialogContent className="w-full">
                  <Image
                    src={image}
                    alt=""
                    width={200}
                    height={200}
                    quality={100}
                    priority
                    className="h-full w-full object-cover"
                  />
                </DialogContent>
              </Dialog>
            )}

            {text && (
              <span className="text-pretty text-sm font-medium">{text}</span>
            )}
          </div>

          <div
            className={twMerge(
              'flex items-center gap-2',
              isLoggedIn ? 'flex-row-reverse' : '',
            )}
          >
            <span className="pt-1 text-right text-xs text-muted-foreground">
              {createdAt}
            </span>

            {isLoggedIn && (
              <CheckCheck
                className={twMerge(
                  read ? 'text-blue-500' : 'text-gray-400',
                  'size-5',
                )}
              />
            )}
          </div>
        </div>

        {isLoggedIn && avatar()}
      </div>
    </div>
  )
}
