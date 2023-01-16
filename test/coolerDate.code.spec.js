const expect = require("chai").expect;

const rootURL = "http://localhost:3001/coolerdate/code";

describe("Test /coolerDate/code", () => {
  const mockEntry = {
    username: "rodonguyen",
    code: "newcode99",
    profileCode: "neutral"
  };

  const flawMockEntry = {
    username: "rodonguyen",
    code: "newcode99"
  }

  describe("POST /find", () => {
    it("Response should include {found: false}", async () => {
      const actualResult = await fetch(
        `${rootURL}/find`,
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // Make sure to serialize your JSON body
          body: JSON.stringify(mockEntry),
        }
      )
      .then((res) => {
        return res.json();
      });

      // console.log('actualResult:', actualResult);  // For debugging
      expect(actualResult).to.include({found: false})
    });
  });
  

  describe("POST /add", () => {
    it("Response should have 'found' (Entry exists) or 'username' (Add entry) property", async () => {
      const actualResult = await fetch(
        `${rootURL}/add`,
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockEntry),
        }
      )
      .then((res) => {
        return res.json();
      });

      // console.log('actualResult:', actualResult);  // For debugging
      expect(actualResult).to.have.property('username')
      // actualResult.should.have.status(201)
    });
  });

  describe("POST /find", () => {
    it("Response should include {found: true}", async () => {
      const actualResult = await fetch(
        `${rootURL}/find`,
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // Make sure to serialize your JSON body
          body: JSON.stringify(mockEntry),
        }
      )
      .then((res) => {
        return res.json();
      });

      // console.log('actualResult:', actualResult);  // For debugging
      expect(actualResult).to.include({found: true})
    });
  });


  describe("POST /add", () => {
    it("Response should have 'found' property (Entry exists, added above)", async () => {
      const actualResult = await fetch(
        `${rootURL}/add`,
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockEntry),
        }
      )
      .then((res) => {
        return res.json();
      });

      // console.log('actualResult:', actualResult);  // For debugging
      expect(actualResult).to.have.property('message')
      // actualResult.should.have.status(201)
    });
  });

  describe("PATCH /patchProfileCode", () => {
    it("Response should have new profileCode (Patch entry added above)", async () => {
      const actualResult = await fetch(
        `${rootURL}/patchFirstAccessTime`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockEntry),
        }
      )
      .then((res) => {
        return res.json();
      });

      // console.log('actualResult:', actualResult);  // For debugging
      expect(actualResult).to.include({profileCode: mockEntry.profileCode})
    });
  });


  describe("PATCH /patchFirstAccessTime", () => {
    it("Response should have 'username' property (Patch entry added above)", async () => {
      const actualResult = await fetch(
        `${rootURL}/patchFirstAccessTime`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockEntry),
        }
      )
      .then((res) => {
        return res.json();
      });

      // console.log('actualResult:', actualResult);  // For debugging
      expect(actualResult).to.have.property('username')
    });
  });

  describe("DELETE /deleteOne", () => {
    it("Response should have 'message' property", async () => {
      const actualResult = await fetch(
        `${rootURL}/deleteOne`,
        {
          method: "delete",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockEntry),
        }
      )
      .then((res) => {
        return res.json();
      });

      // console.log('actualResult:', actualResult);  // For debugging
      expect(actualResult).to.have.property('message')
    });
  });


  describe("PATCH /patchFirstAccessTime", () => {
    it("Response should have 'message' property (Entry not found)", async () => {
      const actualResult = await fetch(
        `${rootURL}/patchFirstAccessTime`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockEntry),
        }
      )
      .then((res) => {
        return res.json();
      });

      // console.log('actualResult:', actualResult);  // For debugging
      expect(actualResult).to.have.property('message')
    });
  });

});
