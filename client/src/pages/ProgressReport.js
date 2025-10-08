import React, { useEffect, useState } from "react";
import axios from "axios";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressReport = () => {
  const [progress, setProgress] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await axios.get(`http://localhost:5000/api/assessments/progress/${userId}`);
      setProgress(res.data);
    };
    fetchProgress();
  }, [userId]);

  const data = {
    labels: progress.map((p) => p.assessmentTitle),
    datasets: [
      {
        label: "Score",
        data: progress.map((p) => p.score),
        backgroundColor: "#007bff",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "📊 Assessment Progress Report" },
    },
  };

  return (
    <div style={{ padding: "30px", marginLeft: "250px" }}>
      <h2>📈 Performance Analytics</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ProgressReport;
