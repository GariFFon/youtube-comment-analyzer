import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Share } from "lucide-react";

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
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            className="flex items-center space-x-2"
          >
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
            <span>Export as CSV</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4 text-red-600" />
            <span>Export as PDF</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="flex items-center space-x-2"
          >
            <Share className="h-4 w-4 text-blue-600" />
            <span>Share Analysis</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
