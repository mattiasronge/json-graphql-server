import { graphql } from 'graphql';
import schemaBuilder from './schemaBuilder';

/**
 * Starts a GraphQL Server in your browser: intercepts every call to http://localhost:3000/graphql 
 * and returns a response from the supplied data.
 * 
 * @export A sinon.js FakeServer (http://sinonjs.org/releases/v2.3.6/fake-xhr-and-server/#fake-server)
 * @param {any} data 
 * @param {any} url Specifies the endpoint to intercept (Default is 'http://localhost:3000/graphql').
 * 
 * @example
 * const data = {
 *    "posts": [
 *        {
 *            "id": 1,
 *            "title": "Lorem Ipsum",
 *            "views": 254,
 *            "user_id": 123,
 *        },
 *        {
 *            "id": 2,
 *            "title": "Sic Dolor amet",
 *            "views": 65,
 *            "user_id": 456,
 *        },
 *    ],
 *    "users": [
 *        {
 *            "id": 123,
 *            "name": "John Doe"
 *        },
 *        {
 *            "id": 456,
 *            "name": "Jane Doe"
 *        }
 *    ],
 * };
 * 
 * GraphQLClientServer(data);
 * GraphQLClientServer(data, 'http://localhost:8080/api/graphql');
 */
export default function(data) {
    const schema = schemaBuilder(data);
    return request => {
        const query = JSON.parse(request.requestBody);

        return graphql(
            schema,
            query.query,
            undefined,
            undefined,
            query.variables
        ).then(
            result => {
                request.respond(
                    200,
                    { 'Content-Type': 'application/json' },
                    JSON.stringify(result)
                );
            },
            error => {
                request.respond(
                    500,
                    { 'Content-Type': 'application/json' },
                    JSON.stringify(error)
                );
            }
        );
    };
}
