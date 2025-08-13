import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "1.0.0",
    title: "Dokumentasi API ACARA",
    description: "Dokumentasi API ACARA",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "https://be-acara-ten.vercel.app/api",
      description: "Deploy Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "andreas",
        password: "123456",
      },
      RegisterRequest: {
        fullName: "Andreas Adi",
        username: "andreas",
        email: "andre@example.co",
        password: "123456",
        confirmPassword: "123456",
      },
      ActivationRequest: {
        code: "abcdef",
      },
      CreateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateEventRequest: {
        name: "",
        banner: "",
        category: "",
        description: "",
        startDate: "YY-MM-DD HH:MM:SS",
        endDate: "YY-MM-DD HH:MM:SS",
        location: {
          region: "region id",
          coordinates: [0, 0],
          address: "",
        },
        isOnline: "false",
        isFeatured: "false",
        isPublish: "false",
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
      CreateBannerRequest: {
        title: "Banner 10 title",
        image:
          "https://res.cloudinary.com/dv6nzx26s/image/upload/v1754646637/lhpi2ab833z6boh7uqox.jpg",
        isShow: false,
      },
      CreateTicketRequest: {
        price: 2000,
        name: "Acara",
        events: "689573b300d9260ef8ba467d",
        description: "Makan Makan",
        quantity: 100,
      },
      CreateOrderRequest: {
        events: "event object id",
        ticket: "ticket object id",
        quantity: 1,
      },
    },
  },
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
