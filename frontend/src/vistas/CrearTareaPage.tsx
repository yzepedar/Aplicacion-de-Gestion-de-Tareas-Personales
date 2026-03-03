import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  titulo: z.string().min(1, "El título es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  estado: z.enum(["TO_DO", "IN_PROGRESS", "DONE"]),
  prioridad: z.enum(["BAJA", "MEDIA", "ALTA"]),
  fechaLimite: z
    .string()
    .min(1, "La fecha límite es obligatoria")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida"),
  etiquetas: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CrearTareaPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      estado: "TO_DO",
      prioridad: "MEDIA",
      fechaLimite: "",
      etiquetas: "",
    },
  });

  const estado = watch("estado");
  const prioridad = watch("prioridad");

  const estadoLabel = useMemo(() => {
    if (estado === "TO_DO") return "To Do";
    if (estado === "IN_PROGRESS") return "En progreso";
    return "Completada";
  }, [estado]);

  const prioridadDot = useMemo(() => {
    if (prioridad === "ALTA") return "bg-red-500";
    if (prioridad === "MEDIA") return "bg-yellow-400";
    return "bg-green-500";
  }, [prioridad]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      estado: data.estado,
      prioridad: data.prioridad,
      fecha_limite: data.fechaLimite, // YYYY-MM-DD
      etiquetas: (data.etiquetas ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    // Aquí iría la llamada real a la API para crear la tarea, por ejemplo:
    // await fetch(`${import.meta.env.VITE_API_URL}/tareas`, { method:"POST", ... })

    alert(
      `✅ Tarea creada\n\nTítulo: ${payload.titulo}\nEstado: ${estadoLabel}\nPrioridad: ${data.prioridad}\nFecha límite: ${payload.fecha_limite}\nEtiquetas: ${payload.etiquetas.join(", ")}`
    );

    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Volver */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <span className="text-lg">←</span>
          Volver
        </button>

        {/* Encabezado */}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Crear Nueva Tarea
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Completa el formulario para crear una nueva tarea
        </p>

        {/* Card */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10">
            <div className="space-y-8">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Título de la tarea <span className="text-red-600">*</span>
                </label>
                <input
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Ej: terminar proyecto de React"
                  {...register("titulo")}
                />
                {errors.titulo && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.titulo.message}
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Descripción <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={5}
                  className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Describe los detalles de la tarea..."
                  {...register("descripcion")}
                />
                {errors.descripcion && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.descripcion.message}
                  </p>
                )}
              </div>

              {/* Estado + Prioridad */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Estado */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900">
                    Estado inicial
                  </label>
                  <div className="mt-2">
                    <select
                      className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-10 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      {...register("estado")}
                    >
                      <option value="TO_DO">📄 To Do</option>
                      <option value="IN_PROGRESS">⏳ En progreso</option>
                      <option value="DONE">✅ Completada</option>
                    </select>
                    <div className="pointer-events-none relative -mt-9 ml-auto mr-4 w-fit text-gray-500">
                      ▾
                    </div>
                  </div>
                </div>

                {/* Prioridad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900">
                    Prioridad
                  </label>
                  <div className="mt-2">
                    <div className="relative">
                      <select
                        className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-10 pr-10 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        {...register("prioridad")}
                      >
                        <option value="BAJA">Baja</option>
                        <option value="MEDIA">Media</option>
                        <option value="ALTA">Alta</option>
                      </select>

                      {/* bolita color */}
                      <span
                        className={`absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full ${prioridadDot}`}
                      />

                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        ▾
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fecha límite */}
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Fecha límite <span className="text-red-600">*</span>
                </label>
                <div className="relative mt-2">
                  <input
                    type="date"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    {...register("fechaLimite")}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    📅
                  </span>
                </div>
                {errors.fechaLimite && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.fechaLimite.message}
                  </p>
                )}
              </div>

              {/* Etiquetas */}
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Etiquetas
                </label>
                <input
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Ingrese"
                  {...register("etiquetas")}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Ingresa las etiquetas separadas por comas
                </p>
              </div>

              {/* Botones */}
              <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50 sm:w-56"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 px-6 py-3 font-extrabold text-white shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-56"
                >
                  {isSubmitting ? "Guardando..." : "Crear Tarea"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Mini debug opcional ;) */}
        <p className="mt-4 text-sm text-gray-500">
          Estado: <span className="font-medium">{estadoLabel}</span> · Prioridad:{" "}
          <span className="font-medium">{prioridad}</span>
        </p>
      </div>
    </div>
  );
}