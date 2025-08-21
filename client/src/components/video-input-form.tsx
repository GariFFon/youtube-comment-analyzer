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
    <>
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-card-gradient rounded-2xl transform rotate-1"></div>
        <Card className="relative bg-card-gradient border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-youtube-gradient"></div>
          <CardContent className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-youtube-gradient rounded-lg flex items-center justify-center">
                <Youtube className="text-white text-sm" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Analyze YouTube Video
              </h2>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        YouTube Video URL
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            {...field}
                            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            className="pl-12 h-12 text-base border-2 border-gray-200 dark:border-gray-600 focus:border-youtube-500 transition-all duration-200 rounded-xl"
                            disabled={analyzeMutation.isPending}
                          />
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                            <Youtube className="h-5 w-5 text-youtube-500" />
                          </div>
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-2 h-2 bg-youtube-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Info className="h-4 w-4 mr-2 text-youtube-500" />
                    Supports YouTube videos, shorts, and live streams
                  </div>
                  <Button 
                    type="submit" 
                    disabled={analyzeMutation.isPending}
                    variant="youtube"
                    size="lg"
                    className="px-8 py-3 text-base font-semibold rounded-xl h-auto"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    {analyzeMutation.isPending ? "Analyzing..." : "Analyze Comments"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {analyzeMutation.isPending && (
        <div className="relative mb-8">
          <Card className="bg-card-gradient border-0 shadow-xl rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-youtube-gradient"></div>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-youtube-200 rounded-full animate-spin">
                    <div className="w-16 h-16 border-4 border-transparent border-t-youtube-500 rounded-full animate-spin"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Youtube className="h-6 w-6 text-youtube-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Fetching Comments...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    This may take a moment for videos with many comments
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-youtube-gradient h-3 rounded-full transition-all duration-500 relative" 
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
