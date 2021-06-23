export const BODY_RESPONSE: any = {
  HEART: [
    {
      value: "true",
      question: "¿Ha tenido un infarto del miocardio (ataque del corazón)?",
      id: "pmi",
      recommendation:
        "Haberlo tenido puede incrementar el riesgo de un nuevo evento vascular en el futuro.",
      response: [
        {
          key: true,
          value: "Si",
        },
        {
          key: false,
          value: "No",
        },
      ],
    },
    {
      value: "true",
      id: "afn",
      question: "¿Le han diagnosticado arritmia (ritmo cardíaco anormal)?",
      recommendation:
        "Las arritmias son situaciones dónde los latidos de su corazón son muy rápidos (taquicardia), muy lentos (bradicardia) o irregulares.",
      response: [
        {
          key: true,
          value: "Si",
        },
        {
          key: false,
          value: "No",
        },
      ],
    },
    {
      id: "chf",
      value: "true",
      response: [
        {
          key: true,
          value: "Si",
        },
        {
          key: false,
          value: "No",
        },
      ],
      question: "¿Le han diagnosticado insuficiencia cardíaca?",
      recommendation:
        "La insuficiencia cardíaca pueden incrementar el riesgo de problemas de hígado, riñones o válvula cardíaca, y pueden llevar a arritmia cardíaca.",
    },
    {
      id: "lvh",
      response: [
        {
          key: true,
          value: "Si",
        },
        {
          key: false,
          value: "No",
        },
      ],
      value: "true",
      question:
        "¿Le han diagnosticado hipertrofia del músculo cardíaco (engrosamiento del músculo cardíaco)?",
      recommendation:
        "Tener hipertrofia del corazón puede incrementar el riesgo de accidentes cerebro-vasculares y arritmias cardíacas.",
    },
    {
      recommendation:
        "Su riesgo de cardiovascular puede incrementarse cuando ha pasado en su familia.",
        value: "true",
        question:
        "¿Alguno de sus familiares de primer grado (padres o hermanos) han tenido infarto de miocardio o angina de pecho?",
        id: "fcv",
      response: [
        {
          key: true,
          value: "Si",
        },
        {
          key: false,
          value: "No",
        },
      ],
    },
    {
      id: "fmi",
      value: "true",
      question:
      "Alguno de sus familiares de primer grado (padres o hermanos) ha tenido infarto del miocardio (ataque cardíaco) antes de los 60 años?",
      response: [
        {
          key: true,
          value: "Si",
        },
        {
          key: false,
          value: "No",
        },
      ],
      recommendation:
        "Tener familiares cercanos que hayan tenido infarto agudo de miocardio puede incrementar el riesgo de desarrollar enfermedades cardíacas.",
    },
  ],
  HIPERTENSION: [
    {
      value: "true",
      question:
      "¿Tiene presión arterial alta? Según la OMS se es hipertenso con mediciones superiores a 90/140.",
      recommendation:
      "La presión arterial alta  puede aumentar el riesgo de ataques cardíaco, accidente cerebrovascular, falla cardíaca y otras afecciones.",
      id: "hyt",
      response: [
        {
          key: true,
          value: "Si",
        },
        {
          key: false,
          value: "No",
        },
      ],
    },
    {
      response: [
        {
          key: true,
          value: "Si",
        },
        {
          key: false,
          value: "No",
        },
      ],
      id: "tht",
      value: "true",
      question:
        "¿Está tomando medicamentos para la hipertensión (presión arterial alta)?",
      recommendation:
        "Recuerde que tomar los medicamentos para hipertensión implica que sea de manera constante, diaria y en los horarios recomendados por su médico.",
    },
    {
      id: "pht",
      value: "true",
      response: [
        {
          key: 1,
          value: "Si, uno de mis padres",
        },
        {
          key: 2,
          value: "Si, ambos",
        },
        {
          key: 0,
          value: "No",
        },
      ],
      question:
        "¿Alguno de sus padres (o ambos) tiene presión arterial alta (sobre 90/140)?",
      recommendation:
        "Su riesgo de desarrollar hipertensión puede incrementarse por factores hereditarios.",
    },
  ],
  DIABETES: [
    {
      response: [
        {
          key: true,
          value: "Si",
        },
        {
          key: false,
          value: "No",
        },
      ],
      value: "true",
      question: "¿Ha sido diagnosticado con diabetes?",
      id: "dm2",
      recommendation:
        "La diabetes puede incrementar el riesgo de ataques cardíacos, aterosclerosis, enfermedades nerviosas, de riñones, de ojos y otras.",
    },
    {
      id: "fdm",
      recommendation:
        "Tener familiares cercanos con diabetes puede aumentar su riesgo de volverse diabético.",
        question:
        "¿Alguno de sus familiares de primer grado (padres o hermanos) han tenido diabetes?",
        value: "true",
      response: [
        {
          key: true,
          value: "Si",
        },
        {
          key: false,
          value: "No",
        },
      ],
    },
  ],
  RENAL: [
    {
      id: "ckd",
      value: "true",
      question: "¿Ha sido diagnosticado con enfermedad renal crónica?",
      recommendation:
        "Esta puede aumentar el riesgo de enfermedad cardíaca, anemia, enfermedades óseas u otras enfermedades.",
      response: [
        {
          key: true,
          value: "Si",
        },
        {
          key: false,
          value: "No",
        },
      ],
    },
  ],
};

export const LIFE_STYLE_RESPONSE: any = [{
  id: "smoking",
  questions: [
    {
      id: "smokingNow",
      value: "",
      question: "¿Es fumador?",
      response: [
        {
          key: "true",
          value: "Si",
        },
        {
          key: "false",
          value: "No",
        },
      ],
    },
    {
      id: "smokingEver",
      value: "",
      question: "¿Ha sido fumador antes?",
      response: [
        {
          key: "true",
          value: "Si",
        },
        {
          key: "false",
          value: "No",
        },
      ],
    },
  ],
}];
