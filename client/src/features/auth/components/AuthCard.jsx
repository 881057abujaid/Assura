import clsx from 'clsx'
import Card from '../../../components/ui/Card'

const AuthCard = ({ children, className }) => {
  return (
    <Card className={clsx(
      "rounded-2xl border border-border-custom bg-bg-base p-6 sm:p-8 shadow-sm",
      className
    )}>
      {children}
    </Card>
  )
}

export default AuthCard
