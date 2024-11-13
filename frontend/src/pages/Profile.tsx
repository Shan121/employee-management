import { GET_AUTHENTICATED_EMPLOYEE } from "@/graphql/queries/employee.query";
import { useQuery } from "@apollo/client";

const Profile = () => {
  const { loading, data } = useQuery(GET_AUTHENTICATED_EMPLOYEE);

  if (loading)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="card bg-white w-96 overflow-hidden 
                rounded-lg shadow-lg flex flex-col"
      >
        <div className="card-image">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            alt="Image"
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </div>

        <div className="card-content text-center py-4">
          <h3 className="text-xl font-semibold mb-4">
            {data.authenticatedEmployee?.name}
          </h3>
          <div className="flex justify-between px-6">
            <div className="flex items-center space-x-2">
              <p>Gender:</p>
              <p>{data.authenticatedEmployee?.gender}</p>
            </div>
            <div className="flex items-center space-x-2">
              <p>Age:</p>
              <p>{data.authenticatedEmployee?.age}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;