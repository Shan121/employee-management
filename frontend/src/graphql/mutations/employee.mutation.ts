import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(data: $input) {
      _id
      name
      email
    }
  }
`;

export const LOG_IN = gql`
  mutation LogIn($input: LogInInput!) {
    login(data: $input) {
      _id
      name
      email
    }
  }
`;

export const LOG_OUT = gql`
  mutation LogOut {
    logout
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;
