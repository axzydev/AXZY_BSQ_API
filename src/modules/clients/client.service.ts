import { prismaClient } from "@src/core/config/database";

export const get = async () => {
  try {
    const clients = await prismaClient.client.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        rfc: true,
        payments: {
          where: {
            active: true,
          },
          select: {
            id: true,
            invoiceDate: true,
            invoiceNumber: true,
            pdfUrl: true,
            xmlUrl: true,
            hasFiles: true,
            total: true,
            subTotal: true,
            paid: true,
          },
        },
      },
    });

    const clientsWithPayments = clients.map((client) => {
      const absoluteTotal = client.payments.reduce((acc, payment) => {
        return acc + payment.total;
      }, 0);

      const totalPendingToPaid = client.payments.reduce((acc, payment) => {
        return acc + payment.subTotal;
      }, 0);

      const totalPaid = client.payments.reduce((acc, payment) => {
        return acc + payment.paid;
      }, 0);

      const isPaid = totalPendingToPaid === 0 ;

      return {
        ...client,
        total: absoluteTotal,
        totalPendingToPaid,
        totalPaid,
        isPaid,
      };
    });

    return clientsWithPayments;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const create = async (data: any) => {
  try {
    const client = await prismaClient.client.create({
      data,
    });

    return client;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const update = async (id: number, data: any) => {
  try {
    const client = await prismaClient.client.update({
      where: {
        id,
      },
      data,
    });

    return client;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const remove = async (id: number) => {
  try {
    const client = await prismaClient.client.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });

    return client;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const getDetails = async (id: number) => {
  try {
    const client = await prismaClient.client.findUnique({
      where: {
        id,
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        rfc: true,
        payments: {
          where: {
            active: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            invoiceDate: true,
            invoiceNumber: true,
            pdfUrl: true,
            xmlUrl: true,
            hasFiles: true,
            total: true,
            subTotal: true,
            paid: true,
            paymentDetail: {
              where: {
                active: true,
              },
              select: {
                id: true,
                concept: true,
                amount: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!client) {
      return null;
    }

    const absoluteTotal = client.payments.reduce((acc, payment) => {
      return acc + payment.total;
    }, 0);

    const totalPendingToPaid = client.payments.reduce((acc, payment) => {
      return acc + payment.subTotal;
    }, 0);

    const totalPaid = client.payments.reduce((acc, payment) => {
      return acc + payment.paid;
    }, 0);

    const isPaid = totalPendingToPaid === 0;

    return {
      ...client,
      total: absoluteTotal,
      totalPendingToPaid,
      totalPaid,
      isPaid,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const getClientDetailsByPaymentId = async (id: number) => {
  try {
    const client = await prismaClient.client.findFirst({
      where: {
        payments: {
          some: {
            id,
          },
        },
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        rfc: true,
        payments: {
          where: {
            active: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            invoiceDate: true,
            invoiceNumber: true,
            pdfUrl: true,
            xmlUrl: true,
            hasFiles: true,
            total: true,
            subTotal: true,
            paid: true,
            paymentDetail: {
              where: {
                active: true,
              },
              select: {
                id: true,
                concept: true,
                amount: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!client) {
      return null;
    }

    const absoluteTotal = client.payments.reduce((acc, payment) => {
      return acc + payment.total;
    }, 0);

    const totalPendingToPaid = client.payments.reduce((acc, payment) => {
      return acc + payment.subTotal;
    }, 0);

    const totalPaid = client.payments.reduce((acc, payment) => {
      return acc + payment.paid;
    }, 0);

    const isPaid = totalPendingToPaid === 0;

    return {
      ...client,
      total: absoluteTotal,
      totalPendingToPaid,
      totalPaid,
      isPaid,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
