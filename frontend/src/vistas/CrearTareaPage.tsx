import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  fechaLimite: z
    .string()
    .min(1, "La fecha límite es obligatoria")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida"),
});

type FormValues = z.infer<typeof schema>;

export default function CrearTareaPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { descripcion: "", fechaLimite: "" },
  });

  const onSubmit = async (data: FormValues) => {
    const tarea = {
      ...data,
      estado: "Pendiente",
    };

    alert(
      `✅ Tarea creada\n\nDescripción: ${tarea.descripcion}\nFecha límite: ${tarea.fechaLimite}\nEstado: ${tarea.estado}`
    );

    reset();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold">US-01 · Crear tarea</h1>
        <p className="text-sm text-gray-600 mt-1">
          Descripción obligatoria · Fecha límite obligatoria · Estado por defecto: Pendiente
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Terminar informe"
              {...register("descripcion")}
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha límite</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("fechaLimite")}
            />
            {errors.fechaLimite && (
              <p className="mt-1 text-sm text-red-600">{errors.fechaLimite.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "Guardando..." : "Crear tarea"}
          </button>

          <button
            type="button"
            onClick={() => reset()}
            className="w-full rounded-lg border border-gray-300 py-2 font-semibold hover:bg-gray-50"
          >
            Limpiar
          </button>
        </form>
      </div>
    </div>
  );
}