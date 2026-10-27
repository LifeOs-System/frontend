import type { ProfileForm, MeasurementKey } from "./types";
import { measurementFields } from "./constants";

type BodyFatPromptParams = {
    form: ProfileForm;
    age: number;
    bmi: number;
};

export function getBodyFatPrompts({
    form,
    age,
    bmi,
}: BodyFatPromptParams) {
    const measurements = measurementFields
        .filter(({ key }) => form[key].trim() !== "")
        .map(({ key, label }) => `- ${label}: ${form[key]} cm`);

    const measurementsText =
        measurements.length > 0
            ? measurements.join("\n")
            : "No se proporcionaron medidas corporales.";

    const systemPrompt = `
Eres un evaluador experto en composición corporal, antropometría y
fisicoculturismo que estima el porcentaje de grasa corporal a partir de
fotografías y datos antropométricos.

    Tus estimaciones deben ser calibradas y conservadoras. Evita halagar,
    exagerar o asumir que una persona tiene menos grasa de la que muestran
las evidencias. Considera las limitaciones de la estimación visual.

    Respondes únicamente con JSON válido, sin markdown ni texto adicional.
    `;

    const prompt = `
Estima el porcentaje de grasa corporal de la persona en las fotografías.

    DATOS DE CONTEXTO
- Sexo: ${form.gender === "Male" ? "Masculino" : "Femenino"}
- Edad: ${age} años
- Altura: ${form.height} cm
- Peso: ${form.weight} kg
- IMC: ${bmi} (solo contexto; NO es el porcentaje de grasa corporal).

MEDIDAS CORPORALES
${measurementsText}

INSTRUCCIONES PARA LAS MEDIDAS
- Utiliza las medidas disponibles como evidencia complementaria.
- Todas las medidas están expresadas en centímetros.
- Considera especialmente cintura, cuello, cadera y pecho cuando estén
disponibles.
- Contrasta las medidas con las fotografías, el peso, la altura y el sexo.
- No inventes medidas que no hayan sido proporcionadas.
- No interpretes la ausencia de medidas como un valor de cero.
- Las medidas por sí solas no permiten conocer con exactitud el porcentaje
de grasa corporal.

MÉTODO (síguelo internamente)
1. Revisa todas las fotografías conjuntamente y contrasta las vistas
frontal, posterior y lateral cuando estén disponibles.
2. Evalúa estos indicadores:
    - Abdomen: pliegue o saliente en perfil, definición abdominal y línea alba.
- Cintura: relación cintura-cadera y forma en V o recta.
- Costados y zona lumbar: acumulación de grasa.
- Pecho y espalda: separación muscular y tejido blando.
- Brazos y piernas: definición, venas y separación entre músculos.
- Cara y cuello: afinamiento o redondez, si son visibles.
3. Compara con estas referencias de calibración:

    ${
    form.gender === "Male"
        ? `- 6–9%: abdominales muy marcados y venas visibles en el abdomen.
- 10–13%: abdominales visibles y cintura definida.
- 14–17%: abdominales apenas insinuados y poca grasa abdominal.
- 18–22%: sin abdominales visibles, abdomen bajo suave y algo de grasa en los costados.
- 23–27%: abdomen redondeado y grasa evidente en costados o pecho.
- 28%+: acumulación generalizada y pliegues marcados.`
        : `- 14–17%: definición muscular muy marcada.
- 18–22%: cuerpo tonificado, cintura definida y abdomen plano.
- 23–27%: sin definición abdominal marcada y contornos más suaves.
- 28–32%: grasa visible en abdomen, caderas y muslos.
- 33%+: acumulación generalizada.`
}

4. Contrasta la apariencia visual con el IMC, las medidas y la masa muscular
visible. Una mayor masa muscular puede elevar el IMC sin implicar un
porcentaje elevado de grasa.
5. Considera que la iluminación, la postura, la ropa y los ángulos pueden
sesgar la estimación. No concluyas más de lo que permiten las imágenes.
6. Si las evidencias son insuficientes, reduce el nivel de confianza y
devuelve null cuando no sea posible una estimación razonable.

    REGLAS
- No presentes la estimación como una medición exacta.
- El valor debe estar entre 3 y 60.
- Si las fotografías no permiten una estimación razonable, devuelve
"bodyFat": null.
- El campo "range" debe contener un intervalo plausible alrededor de la
estimación. Si bodyFat es null, devuelve "range": null.
- "confidence" debe ser "alta", "media" o "baja".
- El campo "analysis" debe resumir brevemente las evidencias observadas.
- No inventes características visuales que no se aprecien en las fotos.

    FORMATO DE SALIDA (solo JSON válido, sin texto extra ni markdown)
{
    "analysis": "2-3 frases con los rasgos visuales y antropométricos relevantes",
    "bodyFat": <número con un decimal o null>,
    "range": [<mínimo>, <máximo>] o null,
    "confidence": "alta" | "media" | "baja"
}
`;

    return { systemPrompt, prompt };
}
