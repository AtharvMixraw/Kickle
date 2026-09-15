interface LoadingScreenProps {
  message?: string;
}

/** Shared full-page loading state used while app data or authentication is pending. */
export default function LoadingScreen({ message = "Loading" }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent" />
        <p className="text-on-background/60 text-xs tracking-[0.2em] font-bold uppercase">
          {message}
        </p>
      </div>
    </div>
  );
}
