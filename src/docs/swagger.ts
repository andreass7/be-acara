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
    },
  },
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
