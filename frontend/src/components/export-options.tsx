import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Share, Download } from "lucide-react";

export function ExportOptions() {
  const handleExportCSV = () => {
    // TODO: Implement CSV export
    alert("CSV export functionality will be implemented");
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert("PDF export functionality will be implemented");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    alert("Share functionality will be implemented");
  };

  return (
    <div className="mb-8">
      <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Export Analysis</h3>
          <Download className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Export your comment analysis data in various formats
        </p>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            className="bg-[#0f0f0f] border-gray-600 text-white hover:bg-gray-800 flex items-center space-x-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            className="bg-[#0f0f0f] border-gray-600 text-white hover:bg-gray-800 flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Export PDF</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="bg-[#0f0f0f] border-gray-600 text-white hover:bg-gray-800 flex items-center space-x-2"
          >
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
