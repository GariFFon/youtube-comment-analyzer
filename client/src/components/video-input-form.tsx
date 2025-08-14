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
      const response = await apiRequest("POST", "/api/analyze", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: data.message || "Comments have been analyzed successfully!",
      });
      onAnalysisComplete(data.video, data.analysis);
      form.reset();
      setProgress(0);
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
      setProgress(0);
    },
  });

  const handleSubmit = (data: AnalyzeVideoRequest) => {
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
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Analyze YouTube Video</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      YouTube Video URL
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="pl-10"
                          disabled={analyzeMutation.isPending}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <Youtube className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Info className="h-4 w-4 mr-1" />
                  Supports YouTube video and shorts URLs
                </div>
                <Button 
                  type="submit" 
                  disabled={analyzeMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {analyzeMutation.isPending ? "Analyzing..." : "Analyze Comments"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {analyzeMutation.isPending && (
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Fetching Comments...</h3>
            <p className="text-gray-500">This may take a moment for videos with many comments</p>
            <div className="mt-4 bg-gray-100 rounded-lg p-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
