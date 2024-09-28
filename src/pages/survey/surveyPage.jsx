import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import * as roomAPI from "../../api/room/room";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QuestionAnalysis = () => {
  const [questions, setQuestions] = useState([]);
  const roomId = localStorage.getItem("roomId");
  const getQuestions = useCallback(async () => {
    try {
      const response = await roomAPI.getQuestions(roomId);
      setQuestions(response.data.data);
    } catch (error) {
      console.error("Failed to get questions:", error);
    }
  }, [roomId]);

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  const wordFrequency = useMemo(() => {
    const wordCount = {};
    questions.forEach((question) => {
      const words = (question.title + " " + question.content)
        .toLowerCase()
        .split(/\s+/);
      words.forEach((word) => {
        if (word.length > 2) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
    });
    return wordCount;
  }, [questions]);

  const chartData = useMemo(() => {
    if (Object.keys(wordFrequency).length > 0) {
      const sortedWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

      return {
        labels: sortedWords.map(([word]) => word),
        datasets: [
          {
            label: "Word Frequency",
            data: sortedWords.map(([, count]) => count),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      };
    }
    return null;
  }, [wordFrequency]);

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Most Frequent Words in Questions",
        },
      },
    }),
    []
  );

  return (
    <div>
      <h2>Question Content Analysis</h2>
      {chartData && <Bar options={options} data={chartData} />}
    </div>
  );
};

export default React.memo(QuestionAnalysis);
