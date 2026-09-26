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
    <div className="min-h-screen overflow-x-hidden bg-[#020617] text-[#F8FAFC] selection:bg-indigo-500 selection:text-white">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col">
          <section className="relative flex flex-1 items-center justify-center py-16 sm:py-20 lg:py-24">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/[0.07] blur-3xl" />
              <div className="absolute bottom-10 left-1/4 h-40 w-40 rounded-full bg-indigo-500/[0.04] blur-3xl" />
            </div>

            <div className="relative mx-auto w-full max-w-4xl text-center">
              {isAuthenticated ? (
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Session active
                </div>
              ) : (
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Simple project management
                </div>
              )}

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-slate-50 sm:text-5xl md:text-6xl lg:text-7xl">
                {isAuthenticated ? (
                  <>
                    Welcome back.
                    <span className="mt-2 block text-indigo-400">
                      Keep the work moving.
                    </span>
                  </>
                ) : (
                  <>
                    Plan your work.
                    <span className="mt-2 block text-indigo-400">
                      Get more done.
                    </span>
                  </>
                )}
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-7 lg:text-lg">
                {isAuthenticated
                  ? "Manage your workspaces, projects, and tasks from one place."
                  : "Keep your workspaces, projects, and tasks organized in one simple place."}
              </p>

              <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  href={isAuthenticated ? "/dashboard" : "/register"}
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition-all duration-200 hover:bg-indigo-400 hover:shadow-indigo-500/10 active:scale-[0.98]"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>

                <Link
                  href={isAuthenticated ? "/workspaces" : "/login"}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 px-6 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900 hover:text-white active:scale-[0.98]"
                >
                  {isAuthenticated ? "View Workspaces" : "Sign In"}
                </Link>
              </div>

              <div className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Workspaces
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Projects
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Tasks
                </span>
              </div>
            </div>
          </section>

          <section
            id="features"
            className="border-t border-slate-800/70 py-16 sm:py-20"
          >
            <div className="mb-9 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-400">
                What NexaFlow offers
              </p>

              <h2 className="mt-2.5 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                Everything in one place
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                Keep your team, projects, and daily work organized without
                unnecessary complexity.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="group rounded-2xl border border-slate-800 bg-[#111827] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/30 hover:bg-[#151d2d]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-sm font-semibold text-indigo-400 transition-colors group-hover:border-indigo-500/30 group-hover:bg-indigo-500/15">
                  W
                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-50">
                  Workspaces
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Keep related projects and team work together in one
                  workspace.
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-800 bg-[#111827] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/30 hover:bg-[#151d2d]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-sm font-semibold text-indigo-400 transition-colors group-hover:border-indigo-500/30 group-hover:bg-indigo-500/15">
                  P
                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-50">
                  Projects
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Organize work into projects and keep track of what needs to
                  be done.
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-800 bg-[#111827] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/30 hover:bg-[#151d2d]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-sm font-semibold text-indigo-400 transition-colors group-hover:border-indigo-500/30 group-hover:bg-indigo-500/15">
                  T
                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-50">
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
            className="mb-8 rounded-2xl border border-slate-800 bg-[#0F172A] p-6 shadow-sm sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10"
          >
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-400">
                {isAuthenticated ? "Your work" : "Get started"}
              </p>

              <h2 className="mt-2.5 text-2xl font-semibold tracking-tight text-slate-50">
                {isAuthenticated
                  ? "Ready to continue?"
                  : "Start organizing your work"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {isAuthenticated
                  ? "Your workspaces and projects are ready when you are."
                  : "Bring your team, projects, and tasks together with NexaFlow."}
              </p>
            </div>

            <Link
              href={isAuthenticated ? "/dashboard" : "/register"}
              className="mt-7 inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-950/20 transition-all duration-200 hover:bg-indigo-400 active:scale-[0.98] lg:mt-0"
            >
              {isAuthenticated ? "Open Dashboard" : "Create Workspace"}
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}