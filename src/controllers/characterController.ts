import AWS from 'aws-sdk';
import axios from 'axios';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { translate } from '../services/translationService';
import { Character } from '../models/Character';  // Importación del modelo

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME as string;

// Función para obtener datos de la API SWAPI
const fetchSWAPIData = async (): Promise<{ name: string; gender: string }[]> => {
    try {
        const response = await axios.get('https://swapi.py4e.com/api/people/');
        return response.data.results.slice(0, 2); // Limitar a 2 personajes
    } catch (error) {
        console.error("Error fetching SWAPI data:", error);
        throw error;
    }
};

const translateKey = async (key: string): Promise<string> => {
    const translatedKey = await translate(key);
    return translatedKey ? translatedKey.toLowerCase() : 'undefined_key';
};

// Función para crear un personaje
export const createCharacter = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const swapiData = await fetchSWAPIData();
    const translatedCharacters: Character[] = [];

    for (const character of swapiData) {
        const translatedCharacter: Partial<Character> = {};

        const keysToTranslate = ['name', 'gender'] as const;

        for (const key of keysToTranslate) {
            if (character[key]) {
                const translatedKey = await translateKey(key);
                const translatedValue = await translate(character[key]);
                translatedCharacter[translatedKey as keyof Character] = translatedValue;
                console.log(`Translated ${key} to ${translatedKey}: ${translatedValue}`);
            } else {
                console.warn(`El personaje no tiene la clave ${key}:`, character);
            }
        }

        console.log("Translated Character Object:", translatedCharacter);

        if (!translatedCharacter.nombre || !translatedCharacter.sexo) {
            console.error("El personaje está faltando las claves requeridas:", translatedCharacter);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "El personaje está faltando las claves requeridas" }),
            };
        }

        if (translatedCharacter.nombre && translatedCharacter.sexo) {
            const params = {
                TableName: TABLE_NAME,
                Item: translatedCharacter,
            };

            await dynamoDB.put(params).promise();
            translatedCharacters.push(translatedCharacter as Character);
            console.log("Personaje insertado en DynamoDB:", translatedCharacter);
        } else {
            console.error("El personaje está faltando las claves requeridas:", translatedCharacter);
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Characters added successfully!' }),
    };
};

// Función para obtener todos los personajes de DynamoDB
export const getCharacters = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const params = {
            TableName: TABLE_NAME,
        };
        const data = await dynamoDB.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        console.error("Error getting characters:", error);
        throw new Error('Error fetching characters from DynamoDB');
    }
};
