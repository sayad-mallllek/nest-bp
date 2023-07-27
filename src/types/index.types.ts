export type PackageManagerType = "npm" | "yarn" | "pnpm";

export type ProjectPromptType = {
    folder: string;
    packageManager: PackageManagerType;
    aws: boolean;
}

