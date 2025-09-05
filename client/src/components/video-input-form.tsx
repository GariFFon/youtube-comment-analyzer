import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { analyzeVideoSchema, type AnalyzeVideoRequest, type Video, type Analysis } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Youtube, Search, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoInputFormProps {
  onAnalysisComplete: (video: Video, analysis: Analysis) => void;
}

export function VideoInputForm({ onAnalysisComplete }: VideoInputFormProps) {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);

  const form = useForm<AnalyzeVideoRequest>({
    resolver: zodResolver(analyzeVideoSchema),
    defaultValues: {
      url: "",
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: AnalyzeVideoRequest) => {
      console.log('Starting API request to /api/analyze with data:', data);
      const response = await apiRequest("POST", "/api/analyze", data);
      console.log('API response received:', response);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Analysis completed successfully:', data);
      toast({
        title: "Analysis Complete",
        description: data.message || "Comments have been analyzed successfully!",
      });
      onAnalysisComplete(data.video, data.analysis);
      form.reset();
      setProgress(0);
    },
    onError: (error: Error) => {
      console.error('Analysis failed with error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
      setProgress(0);
    },
  });

  const handleSubmit = (data: AnalyzeVideoRequest) => {
    console.log('Form submitted with data:', data);
    setProgress(0);
    analyzeMutation.mutate(data);
  };

  // Simulate progress for UX (real implementation would need websockets for actual progress)
  useEffect(() => {
    if (analyzeMutation.isPending) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [analyzeMutation.isPending]);

  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
          <Youtube className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-white">
            Analyze Video Comments
          </h2>
          <p className="text-sm text-gray-400">
            Enter a YouTube video URL to analyze comments
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-300">
                  YouTube Video URL
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="bg-[#0f0f0f] border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20 h-10"
                      disabled={analyzeMutation.isPending}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center text-xs text-gray-500">
              <Info className="h-3 w-3 mr-1" />
              Supports all YouTube video formats
            </div>
            <Button 
              type="submit" 
              disabled={analyzeMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium rounded-sm"
            >
              {analyzeMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Progress Bar */}
      {analyzeMutation.isPending && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-300">Fetching and analyzing comments...</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This may take a moment for videos with many comments
          </p>
        </div>
      )}
    </div>
  );
}
