export interface Label {
    id: number;
    workspace: number;
    name: string;
    description: string | null;
}

export interface TaskLabel {
    id: number;
    task: number;
    label: number;
}
