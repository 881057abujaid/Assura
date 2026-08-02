import { useEffect } from 'react'
import { FolderOpen } from 'lucide-react'

import { Card, Alert, Spinner } from '../../../components/ui'
import { useCustomerProfile } from '../hooks/useCustomerProfile'

export function CustomerDocumentsPage() {
  const { fetchMyProfile, profile, loading, error } = useCustomerProfile()

  useEffect(() => {
    fetchMyProfile()
  }, [])

  const documents = profile?.documents || []

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">My Documents</h1>
        <p className="text-text-secondary">
          View all documents uploaded to your account by your agent.
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <Card className="hover:border-border-custom">
        {documents.length === 0 ? (
          <div className="py-16 text-center">
            <FolderOpen className="h-12 w-12 text-text-secondary mx-auto mb-3 opacity-30" />
            <p className="text-text-secondary text-sm">No documents uploaded yet.</p>
            <p className="text-text-secondary text-xs mt-1">Your agent can upload policy agreements and other files here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col justify-between p-4 border border-border-custom rounded-2xl bg-bg-base hover:border-primary/30 transition-all duration-150"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <FolderOpen className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-primary truncate" title={doc.fileName}>
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-text-secondary font-mono mt-0.5 uppercase">
                      {(doc.mimeType || '').split('/')[1] || 'File'} | {(doc.fileSize / 1024).toFixed(1)} KB
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {new Date(doc.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border-custom">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View / Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Info note */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 text-sm text-primary">
        <strong>Note:</strong> Documents are uploaded by your assigned agent. Contact your agent if you need a specific document added or updated.
      </div>
    </div>
  )
}

export default CustomerDocumentsPage
