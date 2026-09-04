export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            Simple project management for modern teams
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Plan projects.
            <br />
            <span className="text-slate-500">Get work done.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            NexaFlow helps teams organize projects, manage tasks, track
            progress, and collaborate from one simple workspace.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-800">
              Get Started
            </button>

            <a
              href="#features"
              className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            <div className="border-b border-slate-200 bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">NexaFlow Development</p>
                  <p className="text-sm text-slate-500">
                    Project workspace
                  </p>
                </div>

                <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm">
                  68% Complete
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-5">
              {[
                ["Backlog", 4],
                ["To Do", 7],
                ["In Progress", 5],
                ["Review", 3],
                ["Done", 12],
              ].map(([status, count]) => (
                <div
                  key={status}
                  className="rounded-xl bg-white p-4 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{status}</h3>
                    <span className="text-xs text-slate-500">{count}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-lg border border-slate-200 p-3">
                      <p className="text-sm font-medium">Design dashboard</p>
                      <p className="mt-2 text-xs text-slate-500">
                        High priority
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-3">
                      <p className="text-sm font-medium">Create API</p>
                      <p className="mt-2 text-xs text-slate-500">
                        Backend
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-y border-slate-200 bg-slate-50 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Features
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your team needs to stay organized.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Workspaces",
                description:
                  "Keep your teams, projects, and work organized in dedicated workspaces.",
              },
              {
                title: "Task Management",
                description:
                  "Create tasks, assign responsibilities, set priorities, and track deadlines.",
              },
              {
                title: "Project Tracking",
                description:
                  "Monitor project progress and understand what your team is working on.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Work together. Move forward.
          </h2>

          <p className="mt-5 leading-7 text-slate-600">
            NexaFlow brings projects and tasks into one organized workspace,
            giving teams a clear view of what needs to be done and what comes
            next.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl rounded-2xl bg-slate-900 px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold">
            Ready to organize your next project?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Start building better workflows with NexaFlow.
          </p>

          <button className="mt-8 rounded-lg bg-white px-6 py-3 font-medium text-slate-900 hover:bg-slate-100">
            Get Started
          </button>
        </div>
      </section>
    </main>
  );
}