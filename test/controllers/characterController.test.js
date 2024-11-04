const AWS = require('aws-sdk');
const axios = require('axios');
const { createCharacter, getCharacters } = require('../../src/controllers/characterController');

// Simulación de DynamoDB
jest.mock('aws-sdk', () => {
    const mDocumentClient = {
        put: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue({}),
        scan: jest.fn().mockReturnThis(),
    };
    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => mDocumentClient),
        },
    };
});

// Simulación de axios
jest.mock('axios');

// Simulación del servicio de traducción
jest.mock('../../src/services/translationService', () => ({
    translate: jest.fn((key) => {
        // Devolver valores para `name` y `gender`, y `default` para otros
        const translations = {
            name: 'nombre',
            gender: 'sexo',
        };
        return translations[key] || 'default'; // Evita valores null
    }),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

// Prueba para crear un nuevo personaje
describe('Character Controller', () => {
    it('should create a new character', async () => {
        const mockSWAPIResponse = {
            data: {
                results: [
                    { name: 'Luke Skywalker', gender: 'male' },
                    { name: 'Darth Vader', gender: 'male' },
                ],
            },
        };

        axios.get.mockResolvedValue(mockSWAPIResponse);

        const event = {}; // Evento de entrada si es necesario
        const response = await createCharacter(event);

        expect(response.statusCode).toBe(200);
        expect(response.body).toContain('Characters added successfully!');

        // Confirmar que `put` fue llamado dos veces en DynamoDB
        expect(AWS.DynamoDB.DocumentClient().put).toHaveBeenCalledTimes(2);
    });

    it('should handle missing required keys', async () => {
        // Simular que `translate` devuelva `null` para las claves, lo que hace fallar la creación
        require('../../src/services/translationService').translate.mockImplementation(() => null);

        const event = {};
        const response = await createCharacter(event);

        // Verificar que se logre el mensaje de error esperado
        expect(response.statusCode).toBe(500);
        expect(response.body).toContain("El personaje está faltando las claves requeridas");
    });

    it('should get all characters', async () => {
        const mockCharacters = [
            { name: 'C-3PO', gender: 'n/a' },
            { name: 'R2-D2', gender: 'n/a' },
        ];

        AWS.DynamoDB.DocumentClient().scan.mockReturnValue({
            promise: jest.fn().mockResolvedValue({ Items: mockCharacters }),
        });

        const response = await getCharacters();

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual(mockCharacters);
        expect(AWS.DynamoDB.DocumentClient().scan).toHaveBeenCalled();
    });

    it('should handle errors when getting characters', async () => {
        AWS.DynamoDB.DocumentClient().scan.mockReturnValue({
            promise: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
        });

        await expect(getCharacters()).rejects.toThrow('Error fetching characters from DynamoDB');
    });
});
