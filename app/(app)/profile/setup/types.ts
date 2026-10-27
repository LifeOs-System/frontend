export type Gender = "Male" | "Female";

export type MeasurementKey =
    | "neck"
    | "chest"
    | "waist"
    | "hips"
    | "leftArm"
    | "rightArm"
    | "leftForearm"
    | "rightForearm"
    | "leftThigh"
    | "rightThigh"
    | "leftCalf"
    | "rightCalf";

export type ProfileForm = {
    name: string;
    birthDay: string;
    gender: Gender | "";
    weight: string;
    height: string;
} & Record<MeasurementKey, string>;

export type ProfilePhoto = {
    id: string;
    file: File;
    preview: string;
};

export type UpdateField = (
    key: keyof ProfileForm,
    value: string,
) => void;