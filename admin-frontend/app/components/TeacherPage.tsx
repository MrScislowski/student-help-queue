import { useEffect, useState } from "react";
import { getTeachers, createTeacher } from "../requests/requests";
import { Teacher } from "../types";

interface TeacherPageProps {}

const TeacherPage = (props: TeacherPageProps) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [newTeacherEmail, setNewTeacherEmail] = useState<string>("");
  const [newTeacherSlug, setNewTeacherSlug] = useState<string>("");

  useEffect(() => {
    getTeachers().then((data) => {
      setTeachers(data);
    });
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createTeacher(newTeacherEmail, newTeacherSlug).then((data) => {
      setTeachers([...teachers, data]);
      setNewTeacherEmail("");
      setNewTeacherSlug("");
    });
  }

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              # Classes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <tr key={teacher._id}>
              <td className="px-6 py-4 whitespace-nowrap">{teacher.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{teacher.slug}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {teacher.classes.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="mt-8 space-y-6"
      >
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={newTeacherEmail}
              onChange={(e) => setNewTeacherEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="slug" className="sr-only">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Slug"
              value={newTeacherSlug}
              onChange={(e) => setNewTeacherSlug(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default TeacherPage;
