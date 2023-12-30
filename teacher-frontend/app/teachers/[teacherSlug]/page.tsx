"use client";

export default function Home({ params }: { params: { teacherSlug: string } }) {
  return (
    <p>you have reached the endpoint for teacherslug {params.teacherSlug} </p>
  );
}
