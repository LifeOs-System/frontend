import Field from "./Field";
import {ProfileForm, UpdateField} from "@/app/(app)/profile/setup/types";
import {inputClass, measurementFields} from "@/app/(app)/profile/setup/constants";


type Props = {
    form: ProfileForm;
    updateField: UpdateField;
};

export default function BodyMeasurementsStep({
                                                 form,
                                                 updateField,
                                             }: Props) {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-medium">
                    Medidas corporales
                </h2>

                <p className="mt-1 text-sm leading-6 text-white/40">
                    Registra las medidas que utilizarás para seguir tus
                    cambios físicos. Este paso es opcional.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {measurementFields.map(({ key, label }) => (
                    <Field key={key} label={label}>
                        <div className="relative">
                            <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                className={`${inputClass} pr-12`}
                                placeholder="—"
                                value={form[key]}
                                onChange={(event) =>
                                    updateField(key, event.target.value)
                                }
                            />

                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/40">
                                cm
                            </span>
                        </div>
                    </Field>
                ))}
            </div>

            <p className="text-xs leading-5 text-white/40">
                Puedes dejar todas las medidas vacías. Si decides registrar
                alguna, completa las doce para que el servidor pueda crear
                el registro corporal.
            </p>
        </div>
    );
}