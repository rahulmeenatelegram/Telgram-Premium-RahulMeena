import { useAuth } from "@/hooks/use-auth";

export default function DebugAuth() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-4">
        <h1 className="text-2xl font-bold">Authentication Debug</h1>
        
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Current User Info</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email || 'No email'}</p>
              <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
              <p><strong>UID:</strong> {user.uid}</p>
              <p><strong>Display Name:</strong> {user.displayName || 'No display name'}</p>
              <p><strong>Provider:</strong> {user.providerData.map(p => p.providerId).join(', ')}</p>
              <p><strong>Is Admin:</strong> {user.email === "disruptivefounder@gmail.com" ? 'Yes' : 'No'}</p>
              
              <div className="mt-4 p-4 bg-muted rounded">
                <h3 className="font-semibold mb-2">Full User Object:</h3>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify({
                    email: user.email,
                    emailVerified: user.emailVerified,
                    uid: user.uid,
                    displayName: user.displayName,
                    providerData: user.providerData
                  }, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p>No user signed in</p>
          )}
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Access Tests</h2>
          <div className="space-y-2">
            <p><strong>Should have admin access:</strong> {user?.email === "disruptivefounder@gmail.com" ? 'YES' : 'NO'}</p>
            <p><strong>Email verification check:</strong> {user?.emailVerified || user?.email === "disruptivefounder@gmail.com" ? 'PASS' : 'FAIL'}</p>
            <p><strong>User exists check:</strong> {user ? 'PASS' : 'FAIL'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}