export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-700 mb-4">
            <span className="text-white text-2xl font-bold">G</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Guidant 365</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Workflow tracker for contractors</p>
        </div>
        {children}
      </div>
    </div>
  )
}
