
export const exportToCSV = (data, filename = "api_usage_report.csv") => {
    const headers = ["Date", "Total Requests", "Successful Requests", "Failed Requests"];
    const rows = data.map((item) =>
      [item.date, item.total, item.success, item.failed].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  