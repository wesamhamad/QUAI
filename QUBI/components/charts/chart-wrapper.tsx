"use client";

import * as React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChartWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartWrapper({
  title,
  description,
  children,
  className,
}: ChartWrapperProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  return (
    <Card
      className={cn(
        isFullscreen &&
          "fixed inset-4 z-50 h-auto max-h-[calc(100vh-2rem)]",
        className
      )}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <CardAction>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div
          dir="ltr"
          className={cn(
            "w-full",
            isFullscreen ? "h-[calc(100vh-12rem)]" : "h-80"
          )}
        >
          {children}
        </div>
      </CardContent>
      {isFullscreen && (
        <div
          className="fixed inset-0 -z-10 bg-black/50"
          onClick={() => setIsFullscreen(false)}
          aria-hidden="true"
        />
      )}
    </Card>
  );
}
