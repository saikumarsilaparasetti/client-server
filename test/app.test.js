const request = require("supertest");
const app = require("../app");
describe("homepage", () => {
  it("Launch of home page", (done) => {
    request(app)
      .get("/")
      .expect(200)
      .expect(/Enter the json data to be sent to server/, done);
  });
});

describe("subscribe", () => {
  it("sending subscription", (done) => {
    request(app).get("/").send({ type: "Subscribe" }).expect(200, done);
  });
});

describe("unsubscribe", () => {
  it("sending unsubscribe", (done) => {
    request(app).get("/").send({ type: "Unsubscribe" }).expect(200, done);
  });
});

describe("count subscribers", () => {
  it("count subscribers", (done) => {
    request(app).get("/").send({ type: "Unsubscribe" }).expect(200, done);
  });
});
