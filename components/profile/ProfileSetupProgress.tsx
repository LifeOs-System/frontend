import {
    Check,
    ImagePlus,
    Ruler,
    UserRound,
    Weight,
} from "lucide-react";

const steps = [
    { label: "Información personal", shortLabel: "Personal" },
    { label: "Datos físicos", shortLabel: "Físico" },
    { label: "Medidas corporales", shortLabel: "Medidas" },
    { label: "Fotos de progreso", shortLabel: "Fotos" },
];

type Props = {
    step: number;
};

export default function ProfileSetupProgress({ step }: Props) {
    const current = steps[step - 1];
    const progress = (step / steps.length) * 100;

    const StepIcon = [
        UserRound,
        Weight,
        Ruler,
        ImagePlus,
    ][step - 1];

    return (
        <div className="mb-8">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                        <StepIcon className="size-5" />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-white">
                            Paso {step} de {steps.length}
                        </p>

                        <p className="mt-1 text-xs text-white/40">
                            {current.label}
                        </p>
                    </div>
                </div>

                <span className="text-sm tabular-nums text-white/40">
                    {Math.round(progress)}%
                </span>
            </div>

            <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div
                    className="h-full rounded-full bg-white transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2">
                {steps.map((item, index) => {
                    const itemStep = index + 1;
                    const isCurrent = itemStep === step;
                    const isComplete = itemStep < step;

                    return (
                        <div
                            key={item.shortLabel}
                            className="flex items-center gap-2"
                        >
                            <div
                                className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                                    isComplete
                                        ? "border-white bg-white text-black"
                                        : isCurrent
                                            ? "border-white/50 bg-white/10 text-white"
                                            : "border-white/10 text-white/30"
                                }`}
                            >
                                {isComplete ? (
                                    <Check className="size-3.5" />
                                ) : (
                                    itemStep
                                )}
                            </div>

                            <span
                                className={`hidden text-xs sm:block ${
                                    isCurrent
                                        ? "text-white"
                                        : "text-white/35"
                                }`}
                            >
                                {item.shortLabel}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}