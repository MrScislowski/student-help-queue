import { useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getTeacherInfo } from "../utils/requests";
import SessionContext from "./SessionContext";

interface TeacherPageProps {
  teacherSlug: string;
}

const TeacherPage = (props: TeacherPageProps) => {
  const session = useContext(SessionContext);

  const queryClient = useQueryClient();

  const getTeacherInfoQuery = useQuery({
    queryKey: ["entries"],
    retry: false,
    queryFn: async () => await getTeacherInfo(props.teacherSlug),
  });

  if (getTeacherInfoQuery.isLoading) {
    return (
      <>
        <p> Loading data ... </p>
      </>
    );
  }

  if (getTeacherInfoQuery.isError) {
    let errorMessage = "An unknown error occurred";

    if (getTeacherInfoQuery.error instanceof Error) {
      errorMessage = getTeacherInfoQuery.error.message;
    }
    return (
      <>
        <p>Error: {errorMessage}</p>
      </>
    );
  }

  return (
    <div>
      <h1>{`${props.teacherSlug}'s classes:`}</h1>
      <ul>
        {getTeacherInfoQuery.data?.classes.map((classInfo) => {
          return (
            <li key={classInfo._id}>
              <a
                href={`/teachers/${props.teacherSlug}/classes/${classInfo.classSlug}`}
              >
                {classInfo.classSlug}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TeacherPage;
