import { useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft } from 'lucide-react'

import { Button, Card } from '../components/ui'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4 py-12">
      <Card className="w-full max-w-md text-center hover:border-border-custom">
        {/* Warning Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 border border-error/20 text-error mx-auto mb-6">
          <AlertCircle className="h-8 w-8" strokeWidth={2} />
        </div>

        {/* 404 Text */}
        <h1 className="text-6xl font-extrabold tracking-tight text-text-primary mb-2">
          404
        </h1>
        
        <h2 className="text-xl font-bold text-text-primary mb-3">
          Page Not Found
        </h2>
        
        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Button */}
        <Button
          variant="secondary"
          onClick={() => navigate('/login')}
          className="w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>
      </Card>
    </div>
  )
}

export default NotFoundPage

