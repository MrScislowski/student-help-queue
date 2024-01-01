import { Fragment, useContext } from "react";
import Queue from "./Queue";
import { useQuery, useQueryClient } from "react-query";
import { getTeacherInfo } from "../utils/requests";
import SessionContext from "./SessionContext";
import TimeOffsetContext from "./TimeOffsetContext";

interface TeacherPageProps {
  teacherSlug: string;
}

const TeacherPage = (props: TeacherPageProps) => {
  const session = useContext(SessionContext);

  const queryClient = useQueryClient();

  const getTeacherInfoQuery = useQuery({
    queryKey: ["entries"],
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
    return (
      <>
        <p>Error: {(getTeacherInfoQuery.error as Error).message}</p>
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
