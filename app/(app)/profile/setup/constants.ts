import type { MeasurementKey, ProfileForm } from "./types";


export const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ?? ""
).replace(/\/+$/, "");

export const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-white/[0.05]";

export const measurementFields: {
    key: MeasurementKey;
    label: string;
}[] = [
    { key: "neck", label: "Cuello" },
    { key: "chest", label: "Pecho" },
    { key: "waist", label: "Cintura" },
    { key: "hips", label: "Cadera" },
    { key: "leftArm", label: "Brazo izquierdo" },
    { key: "rightArm", label: "Brazo derecho" },
    { key: "leftForearm", label: "Antebrazo izquierdo" },
    { key: "rightForearm", label: "Antebrazo derecho" },
    { key: "leftThigh", label: "Muslo izquierdo" },
    { key: "rightThigh", label: "Muslo derecho" },
    { key: "leftCalf", label: "Pantorrilla izquierda" },
    { key: "rightCalf", label: "Pantorrilla derecha" },
];

export const measurementApiNames: Record<MeasurementKey, string> = {
    neck: "Neck",
    chest: "Chest",
    waist: "Waist",
    hips: "Hips",
    leftArm: "LeftArm",
    rightArm: "RightArm",
    leftForearm: "LeftForearm",
    rightForearm: "RightForearm",
    leftThigh: "LeftThigh",
    rightThigh: "RightThigh",
    leftCalf: "LeftCalf",
    rightCalf: "RightCalf",
};

export const initialForm: ProfileForm = {
    name: "",
    birthDay: "",
    gender: "",
    weight: "",
    height: "",
    neck: "",
    chest: "",
    waist: "",
    hips: "",
    leftArm: "",
    rightArm: "",
    leftForearm: "",
    rightForearm: "",
    leftThigh: "",
    rightThigh: "",
    leftCalf: "",
    rightCalf: "",
};