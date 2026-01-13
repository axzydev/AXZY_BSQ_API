import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createEvaluation = async (data: any) => {
    // Expected data structure:
    // {
    //   childId: number,
    //   coachId: number,
    //   age: number,
    //   category: string,
    //   notes: string,
    //   swingMetrics: [{ level: 'BASE', speedMph: 45 }],
    //   technicalRatings: [{ areaId: 1, level: 'ALTO', indicator: 'PROGRESO' }],
    //   developmentLog: { comments: '...', indicator: 'PROGRESO' }
    // }

    const child = await prisma.child.findUnique({ where: { id: Number(data.childId) } });
    
    let age = data.age;
    let category = data.category;

    if (child && child.birthDate) {
        // Calculate age
        const today = new Date();
        const birth = new Date(child.birthDate);
        let calculatedAge = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            calculatedAge--;
        }
        age = calculatedAge;
        
        // Calculate category
        if (age <= 11) category = "Infantil";
        else if (age <= 17) category = "Juvenil";
        else category = "Normal";
    }

    return await prisma.evaluation.create({
        data: {
            childId: data.childId,
            coachId: data.coachId,
            age: age,
            category: category,
            notes: data.notes,
            swingMetrics: {
                create: data.swingMetrics
            },
            technicalRatings: {
                create: data.technicalRatings
            },
            developmentLogs: {
                create: {
                    date: new Date(),
                    age: age,
                    comments: data.developmentLog?.comments || "",
                    indicator: data.developmentLog?.indicator || "ESTABLE"
                }
            }
        },
        include: {
            swingMetrics: true,
            technicalRatings: { include: { area: true } },
            developmentLogs: true,
            child: true,
            coach: true
        }
    });
};

export const getEvaluationById = async (id: number) => {
    return await prisma.evaluation.findUnique({
        where: { id },
        include: {
            swingMetrics: true,
            technicalRatings: { include: { area: true } },
            developmentLogs: true,
            child: true,
            coach: true
        }
    });
};

export const getEvaluationsByChild = async (childId: number) => {
    return await prisma.evaluation.findMany({
        where: { childId },
        orderBy: { date: 'desc' },
        include: {
            swingMetrics: true,
            technicalRatings: { include: { area: true } },
            developmentLogs: true,
            coach: true
        }
    });
};

export const getTechnicalAreas = async () => {
    return await prisma.technicalArea.findMany();
};
