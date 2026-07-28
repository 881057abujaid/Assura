import clsx from 'clsx'

const AuthLayout = ({ children, className }) => {
  return (
    <div className={clsx(
      "flex min-h-screen flex-col items-center justify-center bg-bg-base px-4 py-12 sm:px-6 lg:px-8",
      className
    )}>
      <main className="w-full max-w-md space-y-8">
        {children}
      </main>
    </div>
  )
}

export default AuthLayout
