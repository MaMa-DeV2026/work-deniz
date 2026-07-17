export default function BlogLoading() {
  return (
    <div className="bg-white">
      <section className="py-24 text-center">
        <div className="container-luxury">
          <div className="mx-auto h-3 w-20 animate-pulse rounded bg-accent" />
          <div className="mx-auto mt-4 h-14 w-72 animate-pulse rounded bg-accent/50" />
          <div className="mx-auto mt-3 h-5 w-56 animate-pulse rounded bg-accent/30" />
          <div className="mx-auto mt-8 h-px w-[80px] bg-accent" />
        </div>
      </section>

      <section className="container-luxury pb-16">
        <div className="h-[400px] w-full animate-pulse rounded bg-accent/10" />
      </section>

      <section className="container-luxury pb-24">
        <div className="grid gap-10 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-[240px] w-full animate-pulse rounded bg-accent/10" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-accent/20" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-accent/15" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
