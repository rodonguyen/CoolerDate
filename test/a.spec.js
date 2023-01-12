const expect = require('chai').expect

const rootURL = 'http://localhost:3001'

describe('Test /coolerDate/code', () => {
  const mockEntry = {
    username: "rodonguyen",
    code: "newcode999",
  };

  describe('POST /findHealth  -->  have found', () => {

    it('health should be okay', async () => {

      // const actualResult = await fetch(`${rootURL}/coolerdate/code/deleteone`, {
      const actualResult = await fetch(`http://localhost:3001/coolerdate/code/find`, {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
      
        //make sure to serialize your JSON body
        body: JSON.stringify(mockEntry)
      })
      console.log('actualResult:', actualResult.body);
      expect(actualResult).to.equal('OK');

    });

  });

});