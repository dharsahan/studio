"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Heart, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getPlayfulMessageAction, saveCalculationAction } from "@/lib/actions";
import Sparkles from "./Sparkles";

const formSchema = z.object({
  name1: z.string().min(1, "Please enter the first name.").max(50),
  name2: z.string().min(1, "Please enter the second name.").max(50),
});

type FormValues = z.infer<typeof formSchema>;

type Result = {
  percentage: number;
  message: string;
  names: FormValues;
};

const calculateCompatibility = (name1: string, name2: string): number => {
    const combinedNames = (name1.toLowerCase() + name2.toLowerCase()).split('').sort().join('');
    let hash = 0;
    for (let i = 0; i < combinedNames.length; i++) {
      const char = combinedNames.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; 
    }
    const percentage = (Math.abs(hash) % 71) + 30; // Between 30 and 100
    return percentage;
};

export default function LoveSparkCalculator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name1: "",
      name2: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setResult(null);

    const compatibilityPercentage = calculateCompatibility(values.name1, values.name2);

    const messageResult = await getPlayfulMessageAction({
      ...values,
      compatibilityPercentage,
    });

    if (!messageResult.success) {
      toast({
        variant: "destructive",
        title: "Oh no!",
        description: messageResult.message,
      });
      setLoading(false);
      return;
    }
    
    setResult({
        percentage: compatibilityPercentage,
        message: messageResult.message,
        names: values,
    });

    await saveCalculationAction({
        ...values,
        percentage: compatibilityPercentage,
        message: messageResult.message,
    });
    
    setLoading(false);
    form.reset();
  }

  return (
    <Card className="w-full max-w-md shadow-2xl shadow-primary/10">
      <CardHeader className="text-center">
        <h2 className="text-3xl font-headline tracking-wider text-accent mx-auto">Find Your Spark!</h2>
        <CardDescription className="font-body text-lg">
          Enter two names to calculate your love compatibility.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <FormField
                control={form.control}
                name="name1"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Romeo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-primary pt-6">
                <Heart className="size-6 fill-current" />
              </div>
              <FormField
                control={form.control}
                name="name2"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Second Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Juliet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Calculate Spark"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full text-center space-y-4 pt-4"
            >
              <h3 className="text-xl font-headline text-primary">{result.names.name1} & {result.names.name2}</h3>
              <Sparkles>
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                    <svg className="absolute inset-0" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="hsl(var(--border))" strokeWidth="4" fill="none" />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="hsl(var(--primary))"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: result.percentage / 100 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </svg>
                    <span className="text-4xl font-headline text-accent">{result.percentage}%</span>
                </div>
              </Sparkles>
              <p className="font-body text-lg leading-relaxed text-foreground/80 px-4">{result.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  );
}
