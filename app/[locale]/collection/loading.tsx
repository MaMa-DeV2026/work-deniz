export default function CollectionLoading() {
  return (
    <>
      <section className="flex min-h-[25vh] items-center justify-center bg-surface py-12 md:h-[35vh] md:py-0">
        <div className="text-center">
          <div className="mx-auto h-3 w-36 animate-pulse rounded bg-accent" />
          <div className="mx-auto mt-4 h-10 w-56 animate-pulse rounded bg-accent/50" />
          <div className="mx-auto mt-4 h-px w-[60px] bg-secondary" />
        </div>
      </section>

      <section className="container-luxury py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] w-full animate-pulse rounded bg-accent/10" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-accent/20" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-accent/15" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
