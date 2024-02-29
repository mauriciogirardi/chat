import { z } from 'zod'

export const schemaForm = z.object({
  groupName: z
    .string()
    .min(2, 'Group name must be at least 2 characters.')
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((word) => word[0].toLocaleUpperCase().concat(word.substring(1)))
        .join(' ')
    }),
  groupBio: z
    .string()
    .min(2, { message: 'Group description must be at least 3 characters.' }),
  users: z.array(z.string()).min(1),
  groupProfilePictureFile: z
    .optional(z.instanceof(FileList))
    .transform((list) => (list ? list.item(0) : undefined))
    .refine((file) => {
      if (!file) return true
      return file.size <= 5 * 1024 * 1024 // 5MB
    }, 'The file must have at most 5Mb.'),
})

export type FormData = z.infer<typeof schemaForm>
