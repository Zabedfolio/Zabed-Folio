'use client';

import dynamic from 'next/dynamic';

const ResumeClient = dynamic(
  () => import('./ResumeClient'),
  {
    ssr: false,
  }
);

export default function ResumePage() {
  return <ResumeClient />;
}