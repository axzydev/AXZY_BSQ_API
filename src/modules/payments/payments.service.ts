import { prismaClient } from "@src/core/config/database";

export const get = async () => {
  try {
    const payments = prismaClient.payment.findMany({
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
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            rfc: true,
          },
        },
      },
    });
    return payments;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const getById = async (id: number) => {
  try {
    const payment = prismaClient.payment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        invoiceDate: true,
        invoiceNumber: true,
        total: true,
        subTotal: true,
        pdfUrl: true,
        xmlUrl: true,
        hasFiles: true,
        paid: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            rfc: true,
          },
        },
      },
    });
    return payment;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const create = async (data: any) => {
  try {
    const hasFile: boolean = data.pdfUrl && data.xmlUrl ? true : false;

    const payment = prismaClient.payment.create({
      data: {
        invoiceDate: data.invoiceDate,
        invoiceNumber: data.invoiceNumber,
        total: Number(data.total),
        subTotal: Number(data.subTotal),
        invoiceExpiration: data.invoiceExpiration,
        pdfUrl: data.pdfUrl,
        xmlUrl: data.xmlUrl,
        hasFiles: hasFile,
        paid: data.paid,
        clientId: data.clientId,
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
        createdAt: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            rfc: true,
          },
        },
      },
    });
    return payment;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const update = async (id: number, data: any) => {
  try {
    const payment = prismaClient.payment.update({
      where: {
        id,
      },
      data: {
        invoiceDate: data.invoiceDate,
        invoiceNumber: data.invoiceNumber,
        total: Number(data.total),
        subTotal: Number(data.subTotal),
        invoiceExpiration: data.invoiceExpiration,
        paid: data.paid,
        clientId: data.clientId,
      },
    });
    return payment;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const remove = async (id: number) => {
  try {
    const payment = prismaClient.payment.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
    return payment;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const addDetail = async (id: number, data: any) => {
  try {
    const paymentDetail = prismaClient.paymentDetail.create({
      data: {
        paymentId: id,
        concept: data.concept,
        amount: Number(data.amount),
      },
      select: {
        amount: true,
        concept: true,
        createdAt: true,
        payment: {
          select: {
            id: true,
            invoiceDate: true,
            invoiceNumber: true,
            total: true,
            subTotal: true,
            pdfUrl: true,
            xmlUrl: true,
            hasFiles: true,
            paid: true,
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                rfc: true,
              },
            },
          },
        },
      },
    });

    await prismaClient.payment.update({
      where: {
        id,
      },
      data: {
        subTotal: {
          decrement: Number(data.amount),
        },
        paid: {
          increment: Number(data.amount),
        },
      },
    });

    return paymentDetail;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const updateDetail = async (id: number, data: any) => {
  try {
    const paymentDetail = prismaClient.paymentDetail.update({
      where: {
        id,
      },
      data,
    });
    return paymentDetail;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const removeDetail = async (id: number) => {
  try {
    const paymentDetail = prismaClient.paymentDetail.delete({
      where: {
        id,
      },
    });
    return paymentDetail;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
