const expect = require('chai').expect;

const rootURL = 'http://localhost:3001/coolerdate/profile';

describe('Test /coolerDate/profile', function () {
	this.timeout(60000);

	const mockEntry01 = {
		username: 'rodonguyen',
		profile: 'p99997',
		content: ['p1', 'p2', 'p3'],
	};
	const mockEntry02 = {
		username: 'rodonguyen',
		profile: 'p99997',
		content: ['p1', 'p2'],
	};

	describe('POST /add -- Add a new entry', () => {
		it('Response should have username, profile, content', async () => {
			const actualResult = await fetch(`${rootURL}/add`, {
				method: 'post',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				// Make sure to serialize your JSON body
				body: JSON.stringify(mockEntry01),
			}).then((res) => {
				return res.json();
			});

			// console.log('actualResult:', actualResult);  // For debugging
			expect(actualResult).to.have.property('message');
		});
	});

	describe('POST /add -- Update the content', () => {
		it("Response should include property 'message': 'Updated the content'", async () => {
			const actualResult = await fetch(`${rootURL}/add`, {
				method: 'post',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				// Make sure to serialize your JSON body
				body: JSON.stringify(mockEntry02),
			}).then((res) => {
				return res.json();
			});

			// console.log('actualResult:', actualResult);  // For debugging
			expect(actualResult).to.include({ message: 'Updated the content.' });
		});
	});

	describe('POST /add -- Repeat mockEntry02 to test if it sees identical entries', () => {
		it("Response should include property 'message': 'Entry already exists, do nothing.'", async () => {
			const actualResult = await fetch(`${rootURL}/add`, {
				method: 'post',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				// Make sure to serialize your JSON body
				body: JSON.stringify(mockEntry02),
			}).then((res) => {
				return res.json();
			});

			// console.log('actualResult:', actualResult);  // For debugging
			expect(actualResult).to.include({ message: 'Entry already exists, do nothing.' });
		});
	});

	describe('DELETE /deleteOne -- Delete the entry before ending the test', () => {
		it("Response should include property 'message': 'Deleted Entry.'", async () => {
			const actualResult = await fetch(`${rootURL}/deleteOne`, {
				method: 'delete',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				// Make sure to serialize your JSON body
				body: JSON.stringify(mockEntry01),
			}).then((res) => {
				return res.json();
			});

			// console.log('actualResult:', actualResult);  // For debugging
			expect(actualResult).to.include({ message: 'Deleted Entry.' });
		});
	});
});
