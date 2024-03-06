import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/'],
})

export const config = {
  matcher: ['/((?!api|trpc))(_next.*|.+.[w]+$)', '/'],
}
