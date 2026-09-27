"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import LandingSkeleton from "@/components/LandingSkeleton";
import NFLOGO from "@/images/NFLOGO.png";
import NFBM from "@/images/NFBM.png";

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
          <section className="relative flex flex-1 items-center py-14 sm:py-20 lg:py-24">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-indigo-500/[0.06] blur-3xl" />
              <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-indigo-500/[0.04] blur-3xl" />
            </div>

            <div className="relative grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)] lg:gap-16">
              <div className="max-w-2xl">
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-[#111827] p-2.5 shadow-xl shadow-black/10">
                    <Image
                      src={NFLOGO}
                      alt="NexaFlow"
                      className="h-full w-full object-contain"
                      priority
                    />
                  </div>

                  <div>
                    <p className="text-base font-semibold tracking-tight text-slate-100">
                      NexaFlow
                    </p>
                    <p className="text-xs text-slate-500">
                      Simple project management
                    </p>
                  </div>
                </div>

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

                <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-slate-50 sm:text-5xl lg:text-6xl xl:text-7xl">
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

                <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base lg:text-lg">
                  {isAuthenticated
                    ? "Manage your workspaces, projects, and tasks from one place."
                    : "Keep your workspaces, projects, and tasks organized in one simple place."}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-800 bg-[#0F172A] px-6 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900 hover:text-white active:scale-[0.98]"
                  >
                    {isAuthenticated ? "View Workspaces" : "Sign In"}
                  </Link>
                </div>

                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500">
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

              <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                <div className="absolute -inset-5 rounded-[2rem] bg-indigo-500/[0.035] blur-2xl" />

                <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] p-3 shadow-2xl shadow-black/30">
                  <div className="flex items-center justify-between border-b border-slate-800 px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={NFLOGO}
                        alt="NexaFlow"
                        className="h-7 w-7 object-contain"
                      />
                      <div>
                        <div className="h-2.5 w-20 rounded-full bg-slate-700" />
                        <div className="mt-1.5 h-1.5 w-12 rounded-full bg-slate-800" />
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-slate-700" />
                      <span className="h-2 w-2 rounded-full bg-slate-700" />
                      <span className="h-2 w-2 rounded-full bg-slate-700" />
                    </div>
                  </div>

                  <div className="p-2">
                    <Image
                      src={NFBM}
                      alt="NexaFlow workspace preview"
                      className="h-auto w-full rounded-2xl object-cover"
                      priority
                    />
                  </div>
                </div>
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

          {!isAuthenticated && (
            <section
              id="hierarchy"
              className="border-t border-slate-800/70 py-16 sm:py-20"
            >
              <div className="mb-10 max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-400">
                  How it works
                </p>

                <h2 className="mt-2.5 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                  A simple work structure
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                  Keep your work organized from the bigger picture down to
                  individual tasks.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="relative rounded-2xl border border-slate-800 bg-[#111827] p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-sm font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                      01
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Foundation
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-slate-50">
                    Workspace
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Create a space for a team, department, or area of work.
                  </p>
                </div>

                <div className="relative rounded-2xl border border-slate-800 bg-[#111827] p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-sm font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                      02
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Organization
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-slate-50">
                    Project
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Group related work into projects with clear goals and
                    progress.
                  </p>
                </div>

                <div className="relative rounded-2xl border border-slate-800 bg-[#111827] p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-sm font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                      03
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Action
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-slate-50">
                    Task
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Break projects into actionable tasks and keep track of
                    progress.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.04] p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Workspace → Project → Task
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      One clear hierarchy for keeping work easy to manage.
                    </p>
                  </div>

                  <div className="hidden items-center gap-2 text-indigo-400 sm:flex">
                    <span className="h-px w-8 bg-indigo-500/30" />
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    <span className="h-px w-8 bg-indigo-500/30" />
                  </div>
                </div>
              </div>
            </section>
          )}

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