import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GET_EMPLOYEES } from "@/graphql/queries/employee.query";
import { signupSchema } from "@/schemas/validation.schema";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

const Home = () => {
  const { data, loading, fetchMore } = useQuery(GET_EMPLOYEES, {
    variables: { limit: 20, offset: 0 },
  });

  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight && !loadingMore && hasMore) {
      loadMore();
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    await fetchMore({
      variables: { limit: 20, offset: data.employees.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.employees.length < 20) {
          setHasMore(false);
        }
        return {
          ...prev,
          employees: [...prev.employees, ...fetchMoreResult.employees],
        };
      },
    });
    setLoadingMore(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data, hasMore, loadingMore]);

  if (loading)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {data &&
          data.employees.map((employee: z.infer<typeof signupSchema>) => (
            <Card key={employee._id}>
              <CardHeader>
                <CardTitle>
                  <Link to={`/employee/${employee._id}`}>{employee.name}</Link>
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex justify-between px-6">
                <div className="flex items-center space-x-2">
                  <p>Gender:</p>
                  <p>{employee.gender}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p>Age:</p>
                  <p>{employee.age}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        {loadingMore && <div>Loading ...</div>}
        {!hasMore && <div>No more employees to load.</div>}
      </div>
    </div>
  );
};

export default Home;
