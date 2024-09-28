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

  const generateColorArray = (count) => {
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#FF6384",
      "#C9CBCF",
      "#4BC0C0",
      "#FF9F40",
    ];
    return Array(count)
      .fill()
      .map((_, i) => colors[i % colors.length]);
  };

  const chartData = useMemo(() => {
    if (Object.keys(wordFrequency).length > 0) {
      const sortedWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

      const backgroundColors = generateColorArray(sortedWords.length);

      return {
        labels: sortedWords.map(([word]) => word),
        datasets: [
          {
            label: "Word Frequency",
            data: sortedWords.map(([, count]) => count),
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) =>
              color.replace("0.6", "1")
            ),
            borderWidth: 1,
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
          text: "질문 단어 빈도수 분석",
          font: {
            size: 20,
            weight: "bold",
          },
          color: "#333",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `빈도수: ${context.parsed.y}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "빈도수",
            font: {
              size: 14,
              weight: "bold",
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "단어",
            font: {
              size: 14,
              weight: "bold",
            },
          },
        },
      },
      animation: {
        duration: 2000,
        easing: "easeInOutQuart",
      },
    }),
    []
  );

  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        질문 단어 빈도수 체크
      </h2>
      {chartData && <Bar options={options} data={chartData} />}
    </div>
  );
};

export default React.memo(QuestionAnalysis);
