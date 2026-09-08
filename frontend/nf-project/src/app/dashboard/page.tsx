"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardSkeleton from "@/components/DashboardSkeleton";

interface Task {
    id: string;
    title: string;
    project: string;
    workspace: string;
    status: "DONE" | "IN_PROGRESS" | "TODO";
    dueDate: string;
}

interface Project {
    id: string;
    name: string;
    workspace: string;
    completedTasks: number;
    totalTasks: number;
    status: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        function checkAuth() {
            const token = localStorage.getItem("access");

            if (!token) {
                setIsAuthenticated(false);
                router.replace("/login");
            } else {
                setIsAuthenticated(true);
            }
        }

        checkAuth();

        window.addEventListener("auth-change", checkAuth);

        return () => {
            window.removeEventListener("auth-change", checkAuth);
        };
    }, [router]);

    const projects: Project[] = [
        {
            id: "p1",
            name: "College Management System",
            workspace: "TechNova",
            completedTasks: 8,
            totalTasks: 12,
            status: "Active",
        },
        {
            id: "p2",
            name: "E-Commerce Core API",
            workspace: "ApexStriker",
            completedTasks: 15,
            totalTasks: 15,
            status: "Completed",
        },
        {
            id: "p3",
            name: "Mobile App Redesign",
            workspace: "TechNova",
            completedTasks: 3,
            totalTasks: 10,
            status: "In Review",
        },
    ];

    const recentTasks: Task[] = [
        {
            id: "t1",
            title: "Create Student Module",
            project: "College Management System",
            workspace: "TechNova",
            status: "IN_PROGRESS",
            dueDate: "Today",
        },
        {
            id: "t2",
            title: "Create Login System",
            project: "College Management System",
            workspace: "TechNova",
            status: "DONE",
            dueDate: "Yesterday",
        },
        {
            id: "t3",
            title: "Attendance Module Integration",
            project: "College Management System",
            workspace: "TechNova",
            status: "TODO",
            dueDate: "Sep 12",
        },
        {
            id: "t4",
            title: "Payment Gateway Webhook Setup",
            project: "E-Commerce Core API",
            workspace: "ApexStriker",
            status: "DONE",
            dueDate: "Sep 05",
        },
    ];

    if (!isAuthenticated) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
            <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-1 space-y-10">
                <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                                Workspace Dashboard
                            </span>

                            <span className="text-xs font-mono text-slate-500">
                                TechNova Ecosystem
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                            Execution Control Center
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/workspaces"
                            className="border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white font-medium px-4 py-2.5 rounded-xl transition-all text-sm"
                        >
                            + New Workspace
                        </Link>

                        <Link
                            href="/projects"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25 text-sm active:scale-95"
                        >
                            + Create Project
                        </Link>
                    </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                        href="/workspaces"
                        className="group p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/70 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                                    Workspace
                                </span>

                                <h3 className="text-lg font-bold text-slate-100 mt-1">
                                    Workspaces
                                </h3>

                                <p className="text-xs text-slate-500 mt-1">
                                    Manage your teams and workspaces
                                </p>
                            </div>

                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
                                →
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs font-mono text-slate-400">
                                04 Active
                            </span>

                            <span className="text-xs font-mono text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                Open →
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/projects"
                        className="group p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/70 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                                    Projects
                                </span>

                                <h3 className="text-lg font-bold text-slate-100 mt-1">
                                    Projects
                                </h3>

                                <p className="text-xs text-slate-500 mt-1">
                                    Track and manage your projects
                                </p>
                            </div>

                            <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/20 transition-all">
                                →
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs font-mono text-slate-400">
                                12 Total
                            </span>

                            <span className="text-xs font-mono text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                Open →
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/tasks"
                        className="group p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/70 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                                    Tasks
                                </span>

                                <h3 className="text-lg font-bold text-slate-100 mt-1">
                                    Tasks
                                </h3>

                                <p className="text-xs text-slate-500 mt-1">
                                    View and manage your tasks
                                </p>
                            </div>

                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                                →
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs font-mono text-slate-400">
                                19 Pending
                            </span>

                            <span className="text-xs font-mono text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                Open →
                            </span>
                        </div>
                    </Link>
                </section>

                <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                            Active Workspaces
                        </span>

                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-white">
                                04
                            </span>

                            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                OWNER
                            </span>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                            Total Projects
                        </span>

                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-white">
                                12
                            </span>

                            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                8 Active
                            </span>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                            Pending Tasks
                        </span>

                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-white">
                                19
                            </span>

                            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                In Progress
                            </span>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                            Overall Completion
                        </span>

                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-white">
                                74%
                            </span>

                            <span className="text-xs font-mono text-sky-400">
                                +12% this wk
                            </span>
                        </div>
                    </div>
                </section>

                <section className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                                Active Projects
                            </h2>

                            <Link
                                href="/projects"
                                className="text-xs font-mono text-indigo-400 hover:underline"
                            >
                                View All Projects &rarr;
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {projects.map((project) => {
                                const percent = Math.round(
                                    (project.completedTasks /
                                        project.totalTasks) *
                                    100
                                );

                                return (
                                    <div
                                        key={project.id}
                                        className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono text-indigo-400 font-bold">
                                                        {project.workspace}
                                                    </span>

                                                    <span className="text-slate-600">
                                                        •
                                                    </span>

                                                    <span className="text-xs text-slate-400">
                                                        {project.status}
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-bold text-slate-100 mt-1">
                                                    {project.name}
                                                </h3>
                                            </div>

                                            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                                                {project.completedTasks}/
                                                {project.totalTasks} Tasks
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-mono text-slate-400">
                                                <span>Progress</span>
                                                <span>{percent}%</span>
                                            </div>

                                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${percent}% `,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                                Live Hierarchy Logs
                            </h2>

                            <span className="text-xs font-mono text-slate-500">
                                Real-time Sync
                            </span>
                        </div>

                        <div className="p-1 bg-gradient-to-b from-slate-800 to-slate-900/40 rounded-2xl border border-slate-800 shadow-2xl">
                            <div className="bg-slate-950 p-5 rounded-[14px] font-mono text-xs space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
                                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></div>
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80"></div>
                                    </div>

                                    <span className="text-[10px] text-slate-500">
                                        NexaFlow Terminal
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-indigo-400 font-bold flex items-center justify-between">
                                        <span>TechNova</span>

                                        <span className="text-[9px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded font-sans">
                                            OWNER
                                        </span>
                                    </div>

                                    <div className="pl-4 border-l border-slate-800 space-y-2.5">
                                        <div className="text-slate-300 font-semibold">
                                            CMS Engine
                                        </div>

                                        <div className="pl-3 space-y-1 text-[11px]">
                                            <div className="text-emerald-400">
                                                ✓ Login system deployed
                                            </div>

                                            <div className="text-amber-400">
                                                &gt; Student module compiling
                                            </div>

                                            <div className="text-slate-500">
                                                o Attendance queue open
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-indigo-400 font-bold flex items-center justify-between pt-2 border-t border-slate-900">
                                        <span>ApexStriker</span>

                                        <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-sans">
                                            ADMIN
                                        </span>
                                    </div>

                                    <div className="pl-4 border-l border-slate-800 text-[11px] text-emerald-400">
                                        ✓ Webhooks synchronized
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-sky-400"></span>
                            Priority Task Stream
                        </h2>

                        <Link
                            href="/tasks"
                            className="text-xs font-mono text-indigo-400 hover:underline"
                        >
                            Open Tasks &rarr;
                        </Link>
                    </div>

                    <div className="p-1 bg-gradient-to-b from-slate-800 to-slate-900/40 rounded-2xl border border-slate-800">
                        <div className="bg-slate-950 p-4 sm:p-6 rounded-[14px] divide-y divide-slate-800/60">
                            {recentTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-indigo-400">
                                                {task.workspace}
                                            </span>

                                            <span className="text-slate-600">
                                                •
                                            </span>

                                            <span className="text-xs text-slate-400">
                                                {task.project}
                                            </span>
                                        </div>

                                        <p className="text-sm font-semibold text-slate-200">
                                            {task.title}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-mono text-slate-500">
                                            Due: {task.dueDate}
                                        </span>

                                        {task.status === "DONE" && (
                                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                DONE
                                            </span>
                                        )}

                                        {task.status === "IN_PROGRESS" && (
                                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                IN PROGRESS
                                            </span>
                                        )}

                                        {task.status === "TODO" && (
                                            <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                TODO
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
