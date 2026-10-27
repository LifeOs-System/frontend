import Field from "./Field";
import {ProfileForm, UpdateField} from "@/app/(app)/profile/setup/types";
import {inputClass} from "@/app/(app)/profile/setup/constants";


type Props = {
    form: ProfileForm;
    updateField: UpdateField;
};

export default function PersonalInfoStep({
                                             form,
                                             updateField,
                                         }: Props) {
    const today = new Date();
    const maxBirthDay = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-medium">
                    Información personal
                </h2>

                <p className="mt-1 text-sm text-white/40">
                    Cuéntanos un poco sobre ti.
                </p>
            </div>

            <Field label="Nombre">
                <input
                    className={inputClass}
                    placeholder="Tu nombre"
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) =>
                        updateField("name", event.target.value)
                    }
                />
            </Field>

            <Field label="Fecha de nacimiento">
                <input
                    type="date"
                    max={maxBirthDay}
                    className={inputClass}
                    value={form.birthDay}
                    onChange={(event) =>
                        updateField("birthDay", event.target.value)
                    }
                />
            </Field>

            <Field label="Género">
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { value: "Male", label: "Masculino" },
                        { value: "Female", label: "Femenino" },
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                                updateField("gender", option.value)
                            }
                            className={`rounded-xl border px-4 py-3 text-sm transition ${
                                form.gender === option.value
                                    ? "border-white/30 bg-white/[0.08] text-white"
                                    : "border-white/10 bg-white/[0.02] text-white/50 hover:bg-white/[0.05]"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </Field>
        </div>
    );
}