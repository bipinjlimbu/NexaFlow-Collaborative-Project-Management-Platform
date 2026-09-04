'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <main className="max-w-6xl mx-auto px-6 py-20 text-center flex-1 flex flex-col items-center justify-center">
        {isAuthenticated ? (
          <>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Session Active
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl leading-[1.1]">
              Welcome back. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
                Ready to execute?
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed">
              Jump directly into your active workspaces, manage your pending tasks, and collaborate with your team.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 text-base active:scale-95"
              >
                Go to Dashboard
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/workspaces"
                className="border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white font-medium px-8 py-3.5 rounded-xl transition-all flex items-center justify-center text-base"
              >
                My Workspaces
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Collaborative Project Platform
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl leading-[1.1]">
              Plan projects. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
                Get work done.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed">
              NexaFlow organizes team workflows through an intuitive structure of Workspaces, Projects, and Tasks with workspace-based role controls.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 text-base active:scale-95"
              >
                Get Started Free
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/login"
                className="border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white font-medium px-8 py-3.5 rounded-xl transition-all flex items-center justify-center text-base"
              >
                Sign In
              </Link>
            </div>
          </>
        )}

        <section id="hierarchy" className="mt-20 w-full text-left">
          <div className="p-1 bg-gradient-to-b from-slate-800 to-slate-900/40 rounded-2xl border border-slate-800 shadow-2xl">
            <div className="bg-slate-950 p-6 md:p-8 rounded-[14px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  NexaFlow Workflow Preview
                </span>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <span>Workspace: TechNova</span>
                  <span className="text-[10px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded font-sans">
                    OWNER
                  </span>
                </div>
                <div className="pl-6 border-l-2 border-slate-800 space-y-3">
                  <div className="text-slate-300 font-semibold">
                    Project: College Management System
                  </div>
                  <div className="pl-6 space-y-2 text-xs font-sans">
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-200">Create Login System</span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px]">
                        DONE
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-200">Create Student Module</span>
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[11px]">
                        IN PROGRESS
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-200">Attendance Module</span>
                      <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[11px]">
                        TODO
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-20 grid md:grid-cols-3 gap-6 text-left w-full">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold mb-4">
              W
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Workspace Hierarchy</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Organize team entities logically with dedicated workspaces, multi-project grouping, and task breakdowns.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold mb-4">
              R
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Role Permissions</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Contextual membership controls per workspace: OWNER, ADMIN, and MEMBER roles with explicit permission boundaries.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold mb-4">
              P
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Progress Analytics</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Monitor active project completion rates, track deadlines, assign tasks, and maintain productivity metrics.
            </p>
          </div>
        </section>

        <section id="about" className="mt-20 p-8 md:p-12 rounded-3xl bg-slate-900/30 border border-slate-800/80 text-left w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isAuthenticated ? 'Continue your workflow' : 'Designed for execution'}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isAuthenticated
                ? 'Your team workspaces and project milestones are synced and ready.'
                : 'Whether managing campus development groups, corporate websites, or multi-member software initiatives, NexaFlow keeps team activity centralized and trackable.'}
            </p>
          </div>
          <Link
            href={isAuthenticated ? '/dashboard' : '/register'}
            className="bg-white hover:bg-slate-100 text-slate-950 font-semibold px-6 py-3 rounded-xl transition-all whitespace-nowrap text-sm"
          >
            {isAuthenticated ? 'Open Workspace Dashboard' : 'Create Free Workspace'}
          </Link>
        </section>
      </main>
    </div>
  );
}