import Field from "./Field";
import {ProfileForm, UpdateField} from "@/app/(app)/profile/setup/types";
import {inputClass} from "@/app/(app)/profile/setup/constants";


type Props = {
    form: ProfileForm;
    updateField: UpdateField;
};

export default function PhysicalDataStep({
                                             form,
                                             updateField,
                                         }: Props) {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-medium">Datos físicos</h2>

                <p className="mt-1 text-sm text-white/40">
                    Estos datos ayudan a personalizar tus objetivos.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Peso actual" hint="En kilogramos (kg)">
                    <div className="relative">
                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            className={`${inputClass} pr-12`}
                            placeholder="65.5"
                            value={form.weight}
                            onChange={(event) =>
                                updateField("weight", event.target.value)
                            }
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/40">
                            kg
                        </span>
                    </div>
                </Field>

                <Field label="Altura" hint="En centímetros (cm)">
                    <div className="relative">
                        <input
                            type="number"
                            min="1"
                            step="0.1"
                            className={`${inputClass} pr-12`}
                            placeholder="165"
                            value={form.height}
                            onChange={(event) =>
                                updateField("height", event.target.value)
                            }
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/40">
                            cm
                        </span>
                    </div>
                </Field>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-sm text-white/70">
                    No te preocupes si tu peso cambia con el tiempo.
                </p>

                <p className="mt-1 text-xs leading-5 text-white/40">
                    Podrás registrar nuevas mediciones para seguir tu evolución.
                </p>
            </div>
        </div>
    );
}