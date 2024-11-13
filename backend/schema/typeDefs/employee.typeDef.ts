const employeeTypeDef = `#graphql
    type Employee {
        _id: ID!
        name: String!
        email: String!
        password: String!
        age: Int
        gender: String!
        role: String!
    }

    type Query {
        employees(limit: Int, offset: Int): [Employee!]
        employee(id: ID!): Employee
        authenticatedEmployee: Employee
    }

    type Mutation {
        signUp(data: SignUpInput!): Employee
        login(data: LogInInput!): Employee
        logout: Boolean
        deleteEmployee(id: ID!): Boolean
    }

    input SignUpInput {
        name: String!
        email: String!
        password: String!
        age: Int
        gender: String!
    }

    input LogInInput {
        email: String!
        password: String!
    }
`;

export default employeeTypeDef;
