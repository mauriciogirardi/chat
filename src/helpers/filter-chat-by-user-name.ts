import { ChatType } from '@/interfaces/chat'

export function filterChatByUserName(chats: ChatType[], name?: string) {
  if (!name) return null

  return chats.filter((chat) =>
    chat.users.some((user) =>
      user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
    ),
  )
}
