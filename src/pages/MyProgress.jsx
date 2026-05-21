import React, { useEffect, useState } from "react";

export default function MyProgress() {
  const [progress, setProgress] = useState({
    completedExperiments: [],
    quizAttempts: [],
    streak: 0,
    totalXP: 0,
  });

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("phx-progress")) || {
        completedExperiments: [],
        quizAttempts: [],
        streak: 0,
        totalXP: 0,
      };

    setProgress(saved);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-8">
        My Progress
      </h1>

      <div className="grid md:grid-cols-4 gap-5">

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold">
            Experiments
          </h2>

          <p className="text-4xl text-cyan-400 mt-3">
            {progress.completedExperiments.length}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold">
            Quiz Attempts
          </h2>

          <p className="text-4xl text-green-400 mt-3">
            {progress.quizAttempts.length}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold">
            Streak
          </h2>

          <p className="text-4xl text-orange-400 mt-3">
            {progress.streak}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold">
            XP
          </h2>

          <p className="text-4xl text-pink-400 mt-3">
            {progress.totalXP}
          </p>
        </div>

      </div>

      <div className="mt-10 bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-5">
          Completed Experiments
        </h2>

        {
          progress.completedExperiments.length === 0
          ? (
            <p className="text-zinc-400">
              No completed experiments yet.
            </p>
          )
          : (
            <div className="space-y-3">
              {
                progress.completedExperiments.map((item, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800 p-4 rounded-xl"
                  >
                    {item}
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  );
}
