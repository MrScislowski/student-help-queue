"use client";

export default function Home({ params }: { params: { teacherSlug: string } }) {
  return (
    <p>
      You are asking for all classes of teacher with slug {params.teacherSlug}
    </p>
  );
}
