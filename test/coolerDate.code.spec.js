const expect = require("chai").expect;

const rootURL = "http://localhost:3001/coolerdate/code";

describe("Test /coolerDate/code", () => {
  const mockEntry = {
    username: "rodonguyen",
    code: "newcode99",
    profileCode: "neutral"
  };

  const mockEntry02 = {
    username: "rodonguyen",
    code: "newcode99",
    profileCode: "goodboy"
  }


  describe("Testing endpoints with unexisted entry", function() {
    describe("POST /queryOne", () => {
      it("Response should include {found: false}", async () => {
        const actualResult = await fetch(
          `${rootURL}/queryOne`,
          {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            // Make sure to serialize your JSON body
            body: JSON.stringify(mockEntry),
          })
        .then((res) => {
          return res.json();});
        
        // console.log('actualResult:', actualResult);  // For debugging
        expect(actualResult).to.include({found: false})
      }).timeout(10000);;
    });
    
    describe("POST /check", () => {
      it("Response should have 'isValid': false (Entry does not exist)", async () => {
        const actualResult = await fetch(
          `${rootURL}/check`,
          {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mockEntry),
          }
        )
        .then((res) => {return res.json();});

        expect(actualResult).to.include({'isValid': false})
      });
    });
  })



  //=====================================================================//

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
      .then((res) => {return res.json();});

      // console.log('actualResult:', actualResult);  // For debugging
      expect(actualResult).to.have.property('username')
      // actualResult.should.have.status(201)
    });
  });


  describe("Testing endpoints after adding the entry", function(){

    describe("POST /queryOne", () => {
      it("Response should include found: true and an entry with firstAccessTime: null  ", async () => {
        const actualResult = await fetch(
          `${rootURL}/queryOne`,
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
        .then((res) => {return res.json();});
  
        // console.log('actualResult:', actualResult);  // For debugging
        expect(actualResult).to.include({found: true})
        expect(actualResult).to.have.property('entry')
        expect(actualResult.entry).to.include({firstAccessTime: null})
      });
    });
  
    describe("POST /check", () => {
      it("Response should have 'isValid': true (Entry does not exist)", async () => {
        const actualResult = await fetch(
          `${rootURL}/check`,
          {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mockEntry),
          }
        )
        .then((res) => {return res.json();});

        expect(actualResult).to.include({'isValid': true})
        expect(actualResult).to.have.property('message')
      });
    });

    describe("POST /queryOne", () => {
      it("Response should have entry.firstAccessTime updated and not equal `null`", async () => {
        const actualResult = await fetch(
          `${rootURL}/queryOne`,
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
        .then((res) => {return res.json();});
  
        expect(actualResult.entry.firstAccessTime).to.not.eql(null)
      });
    });

    describe("POST /add", () => {
      it("Response should have 'found' property (Entry already added above)", async () => {
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
        .then((res) => {return res.json();});
  
        expect(actualResult).to.have.property('message')
      });
    });
  
    describe("PATCH /patchProfileCode", () => {
      it("Response should have new profileCode (Patch entry added above)", async () => {
        const actualResult = await fetch(
          `${rootURL}/patchProfileCode`,
          {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mockEntry02),
          }
        )
        .then((res) => {return res.json();});
  
        // console.log('actualResult:', actualResult);  // For debugging
        expect(actualResult).to.include({ message: "Patch new ProfileCode successfully" })
      });
    });
  
    describe("PATCH /nullifyFirstAccessTime", () => {
      it("Response should include 'message':'Nullify firstAccessTime successfully')", async () => {
        const actualResult = await fetch(
          `${rootURL}/nullifyFirstAccessTime`,
          {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mockEntry),
          }
        )
        .then((res) => {return res.json();});
  
        expect(actualResult).to.include({message: 'Nullify firstAccessTime successfully'})
      });
    });

    describe("POST /queryOne", () => {
      it("Response should include found: true and an entry with firstAccessTime: null  ", async () => {
        const actualResult = await fetch(
          `${rootURL}/queryOne`,
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
        .then((res) => {return res.json();});
  
        // console.log('actualResult:', actualResult);  // For debugging
        expect(actualResult).to.include({found: true})
        expect(actualResult).to.have.property('entry')
        expect(actualResult.entry).to.include({firstAccessTime: null})
      });
    });
  
    describe("PATCH /addFirstAccessTime", () => {
      it("Response should have 'username' property (Patch entry added above)", async () => {
        const actualResult = await fetch(
          `${rootURL}/addFirstAccessTime`,
          {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mockEntry),
          }
        )
        .then((res) => {return res.json();});
  
        // console.log('actualResult:', actualResult);  // For debugging
        expect(actualResult).to.include({message: 'Add firstAccessTime successfully'})
      });
    });
  })


  //=====================================================================//
  
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
      .then((res) => {return res.json();});

      // console.log('actualResult:', actualResult);  // For debugging
      expect(actualResult).to.have.property('message')
    });
  });
    
  describe("Testing endpoints after deleting the entry", function(){

    describe("PATCH /addFirstAccessTime", () => {
      it("Response should have 'message' property (Entry not found)", async () => {
        const actualResult = await fetch(
          `${rootURL}/addFirstAccessTime`,
          {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mockEntry),
          }
        )
        .then((res) => {return res.json();});
  
        expect(actualResult).to.have.property('message')
      });
    });
  })

});
