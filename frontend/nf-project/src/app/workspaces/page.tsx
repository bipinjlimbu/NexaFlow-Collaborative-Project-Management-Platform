"use client";

import {
    Activity,
    ArrowUpRight,
    CheckCircle2,
    FolderKanban,
    MoreHorizontal,
    Plus,
    Settings,
    Users,
} from "lucide-react";

const projects = [
    {
        name: "NexaFlow Website",
        description: "Main platform redesign and development",
        progress: 78,
        tasks: 23,
        completed: 18,
        members: 6,
    },
    {
        name: "Mobile Application",
        description: "NexaFlow mobile application",
        progress: 52,
        tasks: 25,
        completed: 13,
        members: 8,
    },
    {
        name: "Marketing Campaign",
        description: "Product launch and marketing campaign",
        progress: 34,
        tasks: 24,
        completed: 8,
        members: 5,
    },
    {
        name: "API Infrastructure",
        description: "Backend API and service infrastructure",
        progress: 91,
        tasks: 22,
        completed: 20,
        members: 4,
    },
];

const members = [
    {
        name: "Bipin Sharma",
        role: "Owner",
        initials: "BS",
    },
    {
        name: "Alex Morgan",
        role: "Project Manager",
        initials: "AM",
    },
    {
        name: "Sarah Wilson",
        role: "Designer",
        initials: "SW",
    },
    {
        name: "David Kim",
        role: "Developer",
        initials: "DK",
    },
    {
        name: "Emma Brown",
        role: "Developer",
        initials: "EB",
    },
];

const activities = [
    {
        user: "Alex Morgan",
        action: "created a new project",
        target: "Mobile Application",
        time: "10 minutes ago",
    },
    {
        user: "Sarah Wilson",
        action: "completed a task in",
        target: "NexaFlow Website",
        time: "32 minutes ago",
    },
    {
        user: "David Kim",
        action: "joined the workspace",
        target: "",
        time: "1 hour ago",
    },
    {
        user: "Emma Brown",
        action: "updated",
        target: "API Infrastructure",
        time: "2 hours ago",
    },
];

export default function WorkspacePage() {
    return (
        <main className="min-h-screen bg-[#f7f8fa] text-[#17191c]">
            <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8 lg:px-10">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-[#777b83]">
                            <span>Workspace</span>
                            <span>/</span>
                            <span className="text-[#17191c]">NexaFlow Team</span>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            NexaFlow Team
                        </h1>

                        <p className="mt-1 text-sm text-[#777b83]">
                            Manage your projects, team members, and workspace activity.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button className="flex h-10 items-center gap-2 rounded-xl border border-[#dedfe2] bg-white px-4 text-sm font-medium transition hover:bg-[#f1f2f4]">
                            <Settings size={16} />
                            Settings
                        </button>

                        <button className="flex h-10 items-center gap-2 rounded-xl bg-[#17191c] px-4 text-sm font-medium text-white transition hover:bg-[#292c31]">
                            <Plus size={17} />
                            New Project
                        </button>
                    </div>
                </div>

                {/* Workspace Overview */}
                <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-[#e7e8eb] bg-white p-5">
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f2f4]">
                            <FolderKanban size={19} />
                        </div>

                        <p className="text-sm text-[#777b83]">Projects</p>
                        <p className="mt-1 text-3xl font-semibold">12</p>

                        <p className="mt-2 text-xs text-[#858990]">
                            8 currently active
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#e7e8eb] bg-white p-5">
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f2f4]">
                            <CheckCircle2 size={19} />
                        </div>

                        <p className="text-sm text-[#777b83]">Tasks</p>
                        <p className="mt-1 text-3xl font-semibold">148</p>

                        <p className="mt-2 text-xs text-[#858990]">
                            86 completed
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#e7e8eb] bg-white p-5">
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f2f4]">
                            <Users size={19} />
                        </div>

                        <p className="text-sm text-[#777b83]">Members</p>
                        <p className="mt-1 text-3xl font-semibold">24</p>

                        <p className="mt-2 text-xs text-[#858990]">
                            3 joined this month
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#e7e8eb] bg-white p-5">
                        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f2f4]">
                            <Activity size={19} />
                        </div>

                        <p className="text-sm text-[#777b83]">Completion Rate</p>
                        <p className="mt-1 text-3xl font-semibold">68%</p>

                        <p className="mt-2 text-xs text-[#858990]">
                            +6% from last month
                        </p>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
                    {/* Projects */}
                    <section className="rounded-2xl border border-[#e7e8eb] bg-white">
                        <div className="flex items-center justify-between border-b border-[#ececef] px-5 py-5 sm:px-6">
                            <div>
                                <h2 className="font-semibold">Projects</h2>

                                <p className="mt-1 text-sm text-[#858990]">
                                    Projects inside this workspace.
                                </p>
                            </div>

                            <button className="flex items-center gap-1 text-sm font-medium text-[#555960] transition hover:text-[#17191c]">
                                View all
                                <ArrowUpRight size={15} />
                            </button>
                        </div>

                        <div className="divide-y divide-[#ececef]">
                            {projects.map((project) => (
                                <div
                                    key={project.name}
                                    className="px-5 py-5 sm:px-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1f2f4]">
                                                <FolderKanban size={18} />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="text-sm font-semibold">
                                                    {project.name}
                                                </h3>

                                                <p className="mt-1 truncate text-xs text-[#858990]">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>

                                        <button className="shrink-0 text-[#92969d] hover:text-[#17191c]">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between text-xs">
                                        <span className="text-[#777b83]">
                                            {project.completed} of {project.tasks} tasks
                                        </span>

                                        <span className="font-semibold">
                                            {project.progress}%
                                        </span>
                                    </div>

                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eceef0]">
                                        <div
                                            className="h-full rounded-full bg-[#17191c]"
                                            style={{
                                                width: `${project.progress}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {Array.from({
                                                length: Math.min(project.members, 5),
                                            }).map((_, index) => (
                                                <div
                                                    key={index}
                                                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#dedfe2] text-[10px] font-semibold text-[#555960]"
                                                >
                                                    {String.fromCharCode(65 + index)}
                                                </div>
                                            ))}
                                        </div>

                                        <span className="text-xs text-[#858990]">
                                            {project.members} members
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Members */}
                    <section className="rounded-2xl border border-[#e7e8eb] bg-white">
                        <div className="flex items-center justify-between border-b border-[#ececef] px-5 py-5">
                            <div>
                                <h2 className="font-semibold">Team Members</h2>

                                <p className="mt-1 text-sm text-[#858990]">
                                    People in this workspace.
                                </p>
                            </div>

                            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e1e2e5] transition hover:bg-[#f5f6f7]">
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="divide-y divide-[#ececef]">
                            {members.map((member) => (
                                <div
                                    key={member.name}
                                    className="flex items-center gap-3 px-5 py-4"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8e9eb] text-xs font-semibold">
                                        {member.initials}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">
                                            {member.name}
                                        </p>

                                        <p className="mt-0.5 text-xs text-[#858990]">
                                            {member.role}
                                        </p>
                                    </div>

                                    <button className="text-[#92969d] hover:text-[#17191c]">
                                        <MoreHorizontal size={17} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-[#ececef] p-4">
                            <button className="w-full rounded-xl border border-[#e2e3e6] py-2.5 text-sm font-medium transition hover:bg-[#f7f8fa]">
                                View all members
                            </button>
                        </div>
                    </section>
                </div>

                {/* Activity */}
                <section className="mt-6 rounded-2xl border border-[#e7e8eb] bg-white">
                    <div className="flex items-center justify-between border-b border-[#ececef] px-5 py-5 sm:px-6">
                        <div>
                            <h2 className="font-semibold">Workspace Activity</h2>

                            <p className="mt-1 text-sm text-[#858990]">
                                Recent activity from your team.
                            </p>
                        </div>

                        <button className="flex items-center gap-1 text-sm font-medium text-[#555960] hover:text-[#17191c]">
                            View all
                            <ArrowUpRight size={15} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 divide-y divide-[#ececef] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
                        {activities.map((activity, index) => (
                            <div
                                key={`${activity.user}-${index}`}
                                className="flex items-center gap-3 px-5 py-4 sm:px-6"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8e9eb] text-xs font-semibold">
                                    {activity.user
                                        .split(" ")
                                        .map((name) => name[0])
                                        .join("")}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm">
                                        <span className="font-medium">
                                            {activity.user}
                                        </span>{" "}
                                        <span className="text-[#777b83]">
                                            {activity.action}
                                        </span>{" "}
                                        {activity.target && (
                                            <span className="font-medium">
                                                {activity.target}
                                            </span>
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs text-[#9699a0]">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Workspace Details */}
                <section className="mt-6 rounded-2xl border border-[#e7e8eb] bg-white">
                    <div className="border-b border-[#ececef] px-5 py-5 sm:px-6">
                        <h2 className="font-semibold">Workspace Details</h2>

                        <p className="mt-1 text-sm text-[#858990]">
                            Basic information about this workspace.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
                        <div>
                            <p className="text-xs text-[#858990]">Workspace name</p>
                            <p className="mt-1 text-sm font-medium">
                                NexaFlow Team
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-[#858990]">Workspace type</p>
                            <p className="mt-1 text-sm font-medium">
                                Team Workspace
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-[#858990]">Created</p>
                            <p className="mt-1 text-sm font-medium">
                                September 2026
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-[#858990]">Members</p>
                            <p className="mt-1 text-sm font-medium">
                                24 members
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}