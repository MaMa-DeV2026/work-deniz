export default function ProductLoading() {
  return (
    <div className="container-luxury px-4 py-10 md:px-6 md:py-16 lg:px-0">
      <div className="mb-8 flex gap-2">
        <div className="h-3 w-12 animate-pulse rounded bg-accent/20" />
        <div className="h-3 w-3 text-accent/30">/</div>
        <div className="h-3 w-20 animate-pulse rounded bg-accent/20" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square w-full animate-pulse rounded bg-accent/10" />

        <div className="space-y-4">
          <div className="h-5 w-24 animate-pulse rounded bg-accent/20" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-accent/30" />
          <div className="h-4 w-32 animate-pulse rounded bg-accent/15" />
          <div className="my-6 h-px bg-accent" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-20 animate-pulse rounded bg-accent/15" />
                <div className="h-3 w-16 animate-pulse rounded bg-accent/15" />
              </div>
            ))}
          </div>
          <div className="my-6 h-px bg-accent" />
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-accent/10" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-accent/10" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-accent/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
