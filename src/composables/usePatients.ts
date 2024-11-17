const data = [
    {
        "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "name": "Buddy",
        "dob": "2018-02-15",
        "sex": true,
        "ownerName": "John Doe",
        "ownerPhoneNumber": "123-456-7890",
        "ownerEmail": "johndoe@example.com",
        "description": "Friendly labrador retriever",
        "species": "Dog",
        "breed": "Labrador"
    },
    {
        "id": "4c4b137a-0c5c-4a7f-b6c4-5b4b1a7c9e2d",
        "name": "Mittens",
        "dob": "2015-08-20",
        "sex": false,
        "ownerName": "Jane Smith",
        "ownerPhoneNumber": "987-654-3210",
        "ownerEmail": "janesmith@example.com",
        "description": "Playful siamese cat",
        "species": "Cat",
        "breed": "Siamese"
    },
    {
        "id": "67e6a7d9-cd8f-458b-9c7a-6d9e8f7a3b1c",
        "name": "Whiskers",
        "dob": "2012-01-10",
        "sex": false,
        "ownerName": "Bob Johnson",
        "ownerPhoneNumber": "555-123-4567",
        "ownerEmail": "bobjohnson@example.com",
        "description": "Gentle persian cat",
        "species": "Cat",
        "breed": "Persian"
    },
    {
        "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
        "name": "Fido",
        "dob": "2019-05-25",
        "sex": true,
        "ownerName": "Alice Brown",
        "ownerPhoneNumber": "901-234-5678",
        "ownerEmail": "alicebrown@example.com",
        "description": "Energetic golden retriever",
        "species": "Dog",
        "breed": "Golden Retriever"
    },
    {
        "id": "8f6e4d2c-1a2b-3c4d-5e6f-7g8h9i0j1k",
        "name": "Fluffy",
        "dob": "2020-03-01",
        "sex": false,
        "ownerName": "Mike Davis",
        "ownerPhoneNumber": "111-222-3333",
        "ownerEmail": "mikedavis@example.com",
        "description": "Cute holland lop rabbit",
        "species": "Rabbit",
        "breed": "Holland Lop"
    },
    {
        "id": "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p",
        "name": "Snowball",
        "dob": "2021-09-15",
        "sex": true,
        "ownerName": "Emily Chen",
        "ownerPhoneNumber": "444-555-6666",
        "ownerEmail": "emilychen@example.com",
        "description": "Tiny syrian hamster",
        "species": "Hamster",
        "breed": "Syrian"
    },
    {
        "id": "5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s",
        "name": "Puddles",
        "dob": "2016-04-10",
        "sex": false,
        "ownerName": "Sarah Lee",
        "ownerPhoneNumber": "777-888-9999",
        "ownerEmail": "sarahlee@example.com",
        "description": "Playful poodle",
        "species": "Dog",
        "breed": "Poodle"
    },
]

export const usePatients = () => {

    const getPatients = () => {
        return data;
    }

    const getPatient = (id: string) => {
        return data.find((patient) => patient.id === id);
    }

    return {
        getPatients,
        getPatient,
    }
}
