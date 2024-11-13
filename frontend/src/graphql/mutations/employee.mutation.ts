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
