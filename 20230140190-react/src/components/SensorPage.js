// src/components/SensorPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function SensorPage() {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [latest, setLatest] = useState({ suhu: 0, kelembaban: 0, cahaya: 0 });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // GANTI DENGAN IP & PORT SERVER ANDA!
            const response = await axios.get('http://172.20.10.3:5000/api/iot/history');
            const dataSensor = response.data.data;

            if (dataSensor.length === 0) {
                setChartData({ labels: [], datasets: [] });
                setLatest({ suhu: 0, kelembaban: 0, cahaya: 0 });
                setLoading(false);
                return;
            }

            const labels = dataSensor.map(item =>
                new Date(item.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            );

            const dataSuhu = dataSensor.map(item => item.suhu);
            const dataLembab = dataSensor.map(item => item.kelembaban);
            const dataCahaya = dataSensor.map(item => item.cahaya);

            // Ambil data terakhir untuk kartu
            const last = dataSensor[dataSensor.length - 1];
            setLatest({
                suhu: last.suhu,
                kelembaban: last.kelembaban,
                cahaya: last.cahaya
            });

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Suhu (°C)',
                        data: dataSuhu,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        tension: 0.2
                    },
                    {
                        label: 'Kelembaban (%)',
                        data: dataLembab,
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.2)',
                        tension: 0.2
                    },
                    {
                        label: 'Cahaya (LDR)',
                        data: dataCahaya,
                        borderColor: 'rgb(255, 205, 86)',
                        backgroundColor: 'rgba(255, 205, 86, 0.2)',
                        tension: 0.2,
                        // Opsional: gunakan yAxisID jika ingin sumbu Y terpisah
                    }
                ]
            });
            setLoading(false);
        } catch (err) {
            console.error("Gagal ambil data:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monitoring Suhu, Kelembaban & Cahaya Real-time' }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Dashboard IoT - Lab Kimia</h1>

            {/* Kartu Indikator */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-sm text-red-700">Suhu Terakhir</p>
                    <p className="text-2xl font-bold text-red-800">{latest.suhu}°C</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-700">Kelembaban</p>
                    <p className="text-2xl font-bold text-blue-800">{latest.kelembaban}%</p>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <p className="text-sm text-yellow-700">Cahaya (LDR)</p>
                    <p className="text-2xl font-bold text-yellow-800">{latest.cahaya}</p>
                </div>
            </div>

            {/* Grafik */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                {loading ? (
                    <p className="text-center text-gray-600">Memuat data sensor...</p>
                ) : (
                    <Line options={options} data={chartData} />
                )}
            </div>
        </div>
    );
}

export default SensorPage;