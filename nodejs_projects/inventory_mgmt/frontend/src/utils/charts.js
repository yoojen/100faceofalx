export const LineOneOptions = {
    responsive: true,
    mantainAspectRatio: false,
    scales: {
        y: {
            title: {
                text: 'Amount in Frw',
                display: true,
            },
            beginAtZero: true,
            ticks: {
                stepSize: 100000,
            },
            border: {
                color: 'rgba(0, 0, 0, 1)',
            },
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
            }
        },
        x: {
            border: {
                color: 'rgba(0, 0, 0, 1)',
            },
            grid: {
                display: false
            }
        }
    },

    plugins: {
        title: {
            display: true,
            text: 'Revenue Vs. Cost',
            font: {
                size: 20
            }
        },
        legend: {
            display: true,
            position: 'right'
        }
    }
}

export const LineTwoOptions = {
    responsive: true,
    mantainAspectRatio: false,
    scales: {
        y: {
            title: {
                text: 'Amount in Frw',
                display: true,
            },
            beginAtZero: true,
            ticks: {
                stepSize: 100000,
            },
            border: {
                color: 'rgba(0, 0, 0, 1)',
            },
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
            }
        },
        x: {
            border: {
                color: 'rgba(0, 0, 0, 1)',
            },
            grid: {
                display: false
            }
        }
    },

    plugins: {
        title: {
            display: true,
            text: 'Revenue Vs. Profit',
            font: {
                size: 20
            }
        },
        legend: {
            display: true,
            position: 'right'
        }
    }
}

export const HorizontalBarOptions = {
    responsive: true,
    indexAxis: 'y',
    type: 'bar',

    plugins: {
        title: {
            display: true,
            text: 'Purchase Per Product (4 weeks)',
            font: {
                size: 16
            }
        },
        legend: {
            display: true,
            position: 'top'
        }
    }
}