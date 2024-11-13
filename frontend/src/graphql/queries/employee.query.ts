import { gql } from "@apollo/client";

export const GET_AUTHENTICATED_EMPLOYEE = gql`
  query GetAuthenticatedEmployee {
    authenticatedEmployee {
      _id
      email
      name
      role
      age
      gender
    }
  }
`;

export const GET_EMPLOYEES = gql`
  query GetEmployees($limit: Int, $offset: Int) {
    employees(limit: $limit, offset: $offset) {
      _id
      email
      name
      age
      gender
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      _id
      email
      name
      age
      gender
    }
  }
`;
