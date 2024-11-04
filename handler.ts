import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createCharacter, getCharacters } from './src/controllers/characterController';

export const create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const response = await createCharacter(event);
        return response;
    } catch (error) {
        console.error("Error in Lambda handler:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }
};

export const get = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const response = await getCharacters(event); // Asegúrate de que `event` es un argumento válido
        return response;
    } catch (error) {
        console.error("Error in Lambda handler:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }
};
