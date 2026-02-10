import { PrismaClient, Appointment } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET ALL
export const get = async (): Promise<Appointment[]> => {
  return prisma.appointment.findMany({
    include: {
      schedule: {
        include: { coach: true }
      },
      mode: true,
      user: true,
      child: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// ✅ GET BY ID
export const getById = async (id: number): Promise<Appointment | null> => {
  return prisma.appointment.findUnique({
    where: { id },
    include: { schedule: { include: { coach: true } }, mode: true, user: true, child: true },
  });
};

// ✅ CREATE WITH FULL VALIDATIONS
export const create = async (data: any): Promise<Appointment> => {
  const { userId, childId, scheduleId, modeId } = data;

  // 1) validar que el horario exista
  const schedule = await prisma.daySchedule.findUnique({
    where: { id: scheduleId },
    include: { appointments: true },
  });

  if (!schedule) throw new Error("El horario no existe.");

  // 2) validar capacidad
  const taken = schedule.appointments.length;
  if (taken >= schedule.capacity) throw new Error("El horario ya está lleno.");

  // 3) validar que el modo coincida
  if (schedule.modeId !== modeId)
    throw new Error("El modo no coincide con el horario.");

  // 4) validar hijo (si existe childId)
  if (childId) {
    const child = await prisma.child.findUnique({
      where: { id: childId },
    });

    if (!child) throw new Error("El hijo no existe.");

    // 5) validar que el hijo pertenezca al usuario
    if (child.userId !== userId)
      throw new Error("El hijo no pertenece al usuario.");

    // 6) evitar duplicar al mismo hijo en el mismo horario
    const duplicate = await prisma.appointment.findFirst({
      where: {
        scheduleId,
        childId,
      },
    });

    if (duplicate) {
      throw new Error(
        `El hijo "${child.name}" ya está registrado en este horario.`
      );
    }
  } else {
    // Si no hay childId, es el usuario inscribiéndose a sí mismo
    // Validar que el usuario no esté ya inscrito en ese horario
    const duplicate = await prisma.appointment.findFirst({
      where: {
        scheduleId,
        userId,
        childId: null,
      },
    });

    if (duplicate) {
      throw new Error("Ya estás registrado en este horario.");
    }
  }

  // 7) crear cita
  return prisma.appointment.create({
    data: {
      userId,
      childId: childId || null,
      scheduleId,
      modeId,
    },
  });
};

// ✅ UPDATE
export const update = async (id: number, data: any): Promise<Appointment> => {
  const { scheduleId } = data;
  
  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) throw new Error("La cita no existe.");

  if (scheduleId && scheduleId !== existing.scheduleId) {
      // Validate new schedule
      const schedule = await prisma.daySchedule.findUnique({
        where: { id: scheduleId },
        include: { appointments: true },
      });

      if (!schedule) throw new Error("El horario no existe.");

      const taken = schedule.appointments.length;
      if (taken >= schedule.capacity) throw new Error("El horario ya está lleno.");

      // Ensure mode matches the original appointment's intent (or updated mode if provided)
      const targetModeId = data.modeId || existing.modeId;
      if (schedule.modeId !== targetModeId)
         throw new Error("El modo no coincide con el horario.");

      // Check duplicates
      const whereClause: any = {
          scheduleId,
          id: { not: id }
      };

      if (existing.childId) {
          whereClause.childId = existing.childId;
      } else {
          whereClause.userId = existing.userId;
          whereClause.childId = null;
      }

       const duplicate = await prisma.appointment.findFirst({
        where: whereClause
      });

      if (duplicate) {
        throw new Error(existing.childId ? "El hijo ya está registrado en este horario." : "Ya estás registrado en este horario.");
      }
  }

  return prisma.appointment.update({
    where: { id },
    data: {
      scheduleId: scheduleId || undefined,
      modeId: data.modeId || undefined,
    }
  });
};

// ✅ DELETE
export const remove = async (id: number): Promise<Appointment> => {
  // 1. Get details before delete to notify admins
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { child: true, schedule: true, user: true }
  });

  if (!appointment) {
      // If not found, just try to delete or throw. existing logic was just delete.
      // Let's stick to simple delete if not found, but findUnique is better check.
      // Actually if it doesn't exist, delete throws.
  }

  const deleted = await prisma.appointment.delete({
    where: { id },
  });

  // 2. Notify Admins
  if (appointment) {
      try {
        const admins = await prisma.user.findMany({
            where: { role: "ADMIN" }
        });

        const date = new Date(appointment.schedule.date).toLocaleDateString('es-MX'); // or locale
        const time = new Date(appointment.schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const attendeeName = appointment.child 
            ? `${appointment.child.name} ${appointment.child.lastName || ''}`
            : `${appointment.user.name} ${appointment.user.lastName || ''}`;

        const message = `Cita cancelada: ${attendeeName} - ${date} ${time}`;

        await prisma.notification.createMany({
            data: admins.map(admin => ({
                userId: admin.id,
                message: message,
                read: false
            }))
        });
      } catch (e) {
          console.error("Error creating notifications", e);
      }
  }

  return deleted;
};

// ✅ FILTER: BY DATE (scheduled date)
export const getByDate = async (dateStr: string): Promise<Appointment[]> => {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  return prisma.appointment.findMany({
    where: {
      schedule: { date },
    },
    include: { schedule: { include: { coach: true } }, mode: true, user: true, child: true },
    orderBy: { schedule: { startTime: "asc" } },
  });
};

// ✅ FILTER: BY SCHEDULE ID
export const getBySchedule = async (
  scheduleId: number
): Promise<Appointment[]> => {
  return prisma.appointment.findMany({
    where: { scheduleId },
    include: { schedule: { include: { coach: true } }, mode: true, user: true, child: true },
  });
};

// ✅ FILTER: BY CHILD NAME (usa relación)
export const getByStudent = async (name: string): Promise<Appointment[]> => {
  return prisma.appointment.findMany({
    where: {
      child: {
        name: {
          contains: name,
        },
      },
    },
    include: { schedule: { include: { coach: true } }, mode: true, user: true, child: true },
  });
};

// ✅ FILTER: BY MODE ID
export const getByMode = async (modeId: number): Promise<Appointment[]> => {
  return prisma.appointment.findMany({
    where: { modeId },
    include: { schedule: { include: { coach: true } }, mode: true, user: true, child: true },
  });
};

// ✅ FILTER: BY USER ID
export const getByUser = async (userId: number): Promise<Appointment[]> => {
  return prisma.appointment.findMany({
    where: { userId },
    include: { schedule: { include: { coach: true } }, mode: true, user: true, child: true },
    orderBy: { schedule: { startTime: "asc" } },
  });
};
