const  app = require("../src/app");
const { request, supertest } = require("supertest");
// import { supertest, request } from "supertest";

describe("Test coolerDate code", () => {
  const mockEntry = {
    username: "rodonguyen",
    code: "newcode999",
  };
  // describe("Test coolerDate code", () => {




  it("DELETE /coolerdate/code/ --> run", async () => {
    return request(app).delete("/coolerdate/code/deleteone").send(mockEntry);
  })


    // test("Delete One", async () => {
    // await app.request().delete("/coolerdate/code/deleteone").send(mockEntry);
    // const res = await request(app).delete("/coolerdate/code/deleteone").send(mockEntry);
    // const res = await supertest(app).delete("/coolerdate/code/deleteone").send(mockEntry);

  // test("Add One", async () => {
  //   await request(app)
  //     .post("/coolerdate/code/add")
  //     .send(mockEntry)
  //     .expect(201)
  //     .then((res) => {
  //       expect(res.body).toHaveProperty("entry");
  //       expect(res.body).toHaveProperty("message");
  //     });
  // });
});
