import { afterAll, beforeAll, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { StatusCode } from "../../../mod.ts";
import { MageTestServer } from "../../../test-utils/server.ts";

let server: MageTestServer;

beforeAll(() => {
  server = new MageTestServer();

  server.app.delete("/", (context) => {
    context.text(StatusCode.OK, "Hello, World!");
  });

  server.start();
});

afterAll(async () => {
  await server.stop();
});

describe("routing - HTTP methods - put", () => {
  it("should return correct response", async () => {
    const response = await fetch(server.url("/"), {
      method: "DELETE",
    });

    expect(response.status).toBe(StatusCode.OK);
    expect(await response.text()).toBe("Hello, World!");
  });
});
