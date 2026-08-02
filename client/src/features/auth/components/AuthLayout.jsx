import clsx from 'clsx'
import { PrismaticBackground } from '../../../components/ui'

const AuthLayout = ({ children, className }) => {
  return (
    <div className={clsx(
      "flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden",
      className
    )}>
      <PrismaticBackground />
      <main className="w-full max-w-md space-y-8 relative z-10">
        {children}
      </main>
    </div>
  )
}

export default AuthLayout
