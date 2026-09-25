"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LandingSkeleton from "@/components/LandingSkeleton";

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    function checkAuth() {
      setIsAuthenticated(!!localStorage.getItem("access"));
    }

    checkAuth();

    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  if (isAuthenticated === null) {
    return <LandingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500 selection:text-white">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col">
          <section className="flex flex-1 flex-col justify-center py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-4xl text-center">
              {isAuthenticated ? (
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Session active
                </div>
              ) : (
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Simple project management
                </div>
              )}

              <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl xl:text-7xl">
                {isAuthenticated ? (
                  <>
                    Welcome back.
                    <span className="mt-2 block bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
                      Keep the work moving.
                    </span>
                  </>
                ) : (
                  <>
                    Plan your work.
                    <span className="mt-2 block bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
                      Get more done.
                    </span>
                  </>
                )}
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                {isAuthenticated
                  ? "Manage your workspaces, projects, and tasks from one place."
                  : "Keep your workspaces, projects, and tasks organized in one simple place."}
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href={isAuthenticated ? "/dashboard" : "/register"}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98]"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href={isAuthenticated ? "/workspaces" : "/login"}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 px-6 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
                >
                  {isAuthenticated ? "View Workspaces" : "Sign In"}
                </Link>
              </div>
            </div>
          </section>

          <section
            id="features"
            className="border-t border-slate-900 py-16"
          >
            <div className="mb-8">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-400">
                What NexaFlow offers
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Everything in one place
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Keep your team, projects, and daily work organized without
                unnecessary complexity.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-indigo-500/20 hover:bg-slate-900/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                  W
                </div>

                <h3 className="mt-5 text-base font-semibold text-white">
                  Workspaces
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Keep related projects and team work together in one
                  workspace.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-indigo-500/20 hover:bg-slate-900/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                  P
                </div>

                <h3 className="mt-5 text-base font-semibold text-white">
                  Projects
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Organize work into projects and keep track of what needs to
                  be done.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-indigo-500/20 hover:bg-slate-900/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                  T
                </div>

                <h3 className="mt-5 text-base font-semibold text-white">
                  Tasks
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Create, assign, and track tasks so everyone knows what to
                  work on.
                </p>
              </div>
            </div>
          </section>

          <section
            id="about"
            className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10"
          >
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-400">
                {isAuthenticated ? "Your work" : "Get started"}
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                {isAuthenticated
                  ? "Ready to continue?"
                  : "Start organizing your work"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {isAuthenticated
                  ? "Your workspaces and projects are ready when you are."
                  : "Bring your team, projects, and tasks together with NexaFlow."}
              </p>
            </div>

            <Link
              href={isAuthenticated ? "/dashboard" : "/register"}
              className="mt-6 inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 lg:mt-0"
            >
              {isAuthenticated ? "Open Dashboard" : "Create Workspace"}
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}