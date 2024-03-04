import { FileImage } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, ReactNode, useState } from 'react'

import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

type ImageSelectorProps = {
  children: ReactNode
  onChangeFile?: (file: File) => void
  onSend?: () => void
}

export function ImageSelector({
  children,
  onChangeFile,
  onSend,
}: ImageSelectorProps) {
  const [image, setImage] = useState<File | null>(null)
  const [open, setOpen] = useState(false)

  const handleCloseDialog = () => {
    setImage(null)
    setOpen(false)
  }

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target

    if (files) {
      setImage(files[0])
      onChangeFile?.(files[0])
    }
  }

  const handleSave = () => {
    onSend?.()
    handleCloseDialog()
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="text-left">
          <DialogTitle className="text-md text-muted-foreground">
            Select an image
          </DialogTitle>
        </DialogHeader>
        <label
          htmlFor="file"
          className="my-5 flex h-48 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-zinc-700 hover:bg-zinc-900"
        >
          {image ? (
            <Image
              alt=""
              src={URL.createObjectURL(image)}
              width={250}
              height={192}
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <FileImage className="text-muted-foreground" />
              <span className="text-muted-foreground">
                Click here to select an image
              </span>
            </>
          )}
        </label>
        <input
          type="file"
          id="file"
          accept="image/*"
          className="sr-only"
          onChange={handleChangeFile}
        />

        <DialogFooter>
          <Button variant="outline" onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={handleSave}
            disabled={!image}
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
