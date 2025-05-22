"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Loading } from "@/app/components/ui/loading";
import { AdaptivePanel } from "@/app/components/ui/adaptive-panel";
import { ProgressTracker } from "@/app/components/ui/progress-tracker";
import { 
  HoverCard, 
  AnimatedIconButton, 
  AnimatedText,
  NotificationBadge,
  FeedbackMessage
} from "@/app/components/ui/micro-interactions";
import { 
  Bell, 
  Check, 
  ChevronRight, 
  Download, 
  Heart, 
  Info, 
  Lightbulb, 
  Settings, 
  Star, 
  Trash, 
  Upload, 
  X 
} from "lucide-react";

export default function UIDesignShowcase() {
  const [activeTab, setActiveTab] = useState("colors");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info" | "warning">("success");

  // Progress tracker demo data
  const progressSteps = [
    { id: "step1", title: "Upload Image", description: "Upload your character image", completed: true },
    { id: "step2", title: "Extract Assets", description: "Extract character assets", completed: true },
    { id: "step3", title: "Customize", description: "Customize your character", completed: false },
    { id: "step4", title: "Export", description: "Export your character", completed: false, locked: true },
  ];

  const progressLevels = [
    { level: 1, title: "Beginner", description: "Just getting started", requiredSteps: 0, maxSteps: 5 },
    { level: 2, title: "Intermediate", description: "Getting the hang of it", requiredSteps: 5, maxSteps: 10 },
    { level: 3, title: "Advanced", description: "Becoming a pro", requiredSteps: 10, maxSteps: 15 },
    { level: 4, title: "Expert", description: "Master of character creation", requiredSteps: 15, maxSteps: 20 },
  ];

  const showFeedbackMessage = (type: "success" | "error" | "info" | "warning") => {
    setFeedbackType(type);
    setShowFeedback(true);
  };

  const getFeedbackIcon = () => {
    switch (feedbackType) {
      case "success": return <Check className="h-4 w-4" />;
      case "error": return <X className="h-4 w-4" />;
      case "info": return <Info className="h-4 w-4" />;
      case "warning": return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getFeedbackMessage = () => {
    switch (feedbackType) {
      case "success": return "Operation completed successfully!";
      case "error": return "An error occurred. Please try again.";
      case "info": return "Here's some useful information for you.";
      case "warning": return "Warning: This action cannot be undone.";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">UI Design System Showcase</h1>
        <p className="mt-2 text-muted-foreground">
          Explore the new UI components and design system
        </p>
      </header>

      {/* Feedback message */}
      <div className="mb-6">
        <FeedbackMessage
          message={getFeedbackMessage()}
          type={feedbackType}
          visible={showFeedback}
          onClose={() => setShowFeedback(false)}
          icon={getFeedbackIcon()}
        />
      </div>

      {/* Navigation tabs */}
      <div className="mb-6 flex space-x-2 border-b border-border pb-2">
        {["colors", "components", "interactions", "panels", "progress"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      <div className="flex-1">
        {/* Colors showcase */}
        {activeTab === "colors" && (
          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-xl font-semibold">Brand Colors</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex h-24 flex-col justify-between rounded-lg bg-[var(--brand-primary)] p-4 text-white">
                  <span className="text-xs opacity-80">Brand Primary</span>
                  <span className="font-mono text-xs">var(--brand-primary)</span>
                </div>
                <div className="flex h-24 flex-col justify-between rounded-lg bg-[var(--brand-secondary)] p-4 text-white">
                  <span className="text-xs opacity-80">Brand Secondary</span>
                  <span className="font-mono text-xs">var(--brand-secondary)</span>
                </div>
                <div className="flex h-24 flex-col justify-between rounded-lg bg-[var(--brand-tertiary)] p-4 text-white">
                  <span className="text-xs opacity-80">Brand Tertiary</span>
                  <span className="font-mono text-xs">var(--brand-tertiary)</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">Functional Colors</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="flex h-24 flex-col justify-between rounded-lg bg-[var(--success)] p-4 text-white">
                  <span className="text-xs opacity-80">Success</span>
                  <span className="font-mono text-xs">var(--success)</span>
                </div>
                <div className="flex h-24 flex-col justify-between rounded-lg bg-[var(--warning)] p-4 text-white">
                  <span className="text-xs opacity-80">Warning</span>
                  <span className="font-mono text-xs">var(--warning)</span>
                </div>
                <div className="flex h-24 flex-col justify-between rounded-lg bg-[var(--error)] p-4 text-white">
                  <span className="text-xs opacity-80">Error</span>
                  <span className="font-mono text-xs">var(--error)</span>
                </div>
                <div className="flex h-24 flex-col justify-between rounded-lg bg-[var(--info)] p-4 text-white">
                  <span className="text-xs opacity-80">Info</span>
                  <span className="font-mono text-xs">var(--info)</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Components showcase */}
        {activeTab === "components" && (
          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-xl font-semibold">Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <Button>Default Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="gradient">Gradient</Button>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Settings className="h-4 w-4" /></Button>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4">
                <Button loading>Loading</Button>
                <Button icon={<Download className="h-4 w-4" />}>With Icon</Button>
                <Button icon={<Upload className="h-4 w-4" />} iconPosition="right">
                  Icon Right
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">Loading States</h2>
              <div className="flex flex-wrap gap-8">
                <Loading variant="spinner" text="Loading..." />
                <Loading variant="dots" text="Processing" />
                <Loading variant="pulse" text="Thinking" />
                <Loading variant="progress" progress={65} text="Uploading 65%" />
                <div className="h-12 w-64">
                  <Loading variant="skeleton" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Micro-interactions showcase */}
        {activeTab === "interactions" && (
          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-xl font-semibold">Hover Cards</h2>
              <div className="flex flex-wrap gap-4">
                <HoverCard className="h-32 w-48 bg-card p-4 text-card-foreground">
                  <h3 className="font-medium">Default Hover</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hover over me to see the effect
                  </p>
                </HoverCard>
                
                <HoverCard 
                  className="h-32 w-48 bg-card p-4 text-card-foreground"
                  hoverScale={1.05}
                  hoverRotate={2}
                >
                  <h3 className="font-medium">Scale & Rotate</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    With custom scale and rotation
                  </p>
                </HoverCard>
                
                <HoverCard 
                  className="h-32 w-48 bg-card p-4 text-card-foreground"
                  hoverGlow={true}
                  glowColor="rgba(96, 165, 250, 0.4)"
                >
                  <h3 className="font-medium">Glow Effect</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    With a subtle glow effect
                  </p>
                </HoverCard>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">Animated Icon Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <AnimatedIconButton 
                  icon={<Heart className="h-5 w-5" />} 
                  animationType="bounce"
                  tooltip="Like"
                  ariaLabel="Like"
                />
                
                <AnimatedIconButton 
                  icon={<Star className="h-5 w-5" />} 
                  animationType="pulse"
                  variant="outline"
                  tooltip="Favorite"
                  ariaLabel="Favorite"
                />
                
                <AnimatedIconButton 
                  icon={<Trash className="h-5 w-5" />} 
                  animationType="shake"
                  variant="ghost"
                  tooltip="Delete"
                  tooltipSide="bottom"
                  ariaLabel="Delete"
                />
                
                <AnimatedIconButton 
                  icon={<Settings className="h-5 w-5" />} 
                  animationType="rotate"
                  tooltip="Settings"
                  tooltipSide="right"
                  ariaLabel="Settings"
                />
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">Animated Text</h2>
              <div className="space-y-4">
                <AnimatedText 
                  text="Fade In Text Animation" 
                  animationType="fade"
                  className="text-xl font-medium"
                />
                
                <AnimatedText 
                  text="Typewriter Effect" 
                  animationType="typewriter"
                  className="text-xl font-medium"
                />
                
                <AnimatedText 
                  text="Wave Animation" 
                  animationType="wave"
                  className="text-xl font-medium"
                />
                
                <AnimatedText 
                  text="Highlight Text Effect" 
                  animationType="highlight"
                  className="text-xl font-medium"
                  highlightColor="rgba(96, 165, 250, 0.4)"
                />
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">Notification Badges</h2>
              <div className="flex flex-wrap gap-8">
                <div className="relative">
                  <Button icon={<Bell className="h-4 w-4" />}>
                    Notifications
                  </Button>
                  <NotificationBadge count={5} />
                </div>
                
                <div className="relative">
                  <Button variant="outline" icon={<Bell className="h-4 w-4" />}>
                    Messages
                  </Button>
                  <NotificationBadge count={99} maxCount={9} />
                </div>
                
                <div className="relative">
                  <Button variant="ghost" icon={<Bell className="h-4 w-4" />}>
                    Alerts
                  </Button>
                  <NotificationBadge variant="dot" pulseAnimation={true} count={1} />
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">Feedback Messages</h2>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => showFeedbackMessage("success")}
                >
                  Show Success
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => showFeedbackMessage("error")}
                >
                  Show Error
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => showFeedbackMessage("info")}
                >
                  Show Info
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => showFeedbackMessage("warning")}
                >
                  Show Warning
                </Button>
              </div>
            </section>
          </div>
        )}

        {/* Adaptive panels showcase */}
        {activeTab === "panels" && (
          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-xl font-semibold">Adaptive Panels</h2>
              <div className="flex h-[400px] gap-4 border border-border rounded-lg">
                <AdaptivePanel
                  title="Left Panel"
                  position="left"
                  defaultWidth="250px"
                  className="h-full"
                >
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This is a resizable and collapsible panel.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <ChevronRight className="mr-2 h-4 w-4" />
                        Item 1
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="mr-2 h-4 w-4" />
                        Item 2
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="mr-2 h-4 w-4" />
                        Item 3
                      </li>
                    </ul>
                  </div>
                </AdaptivePanel>

                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Main Content Area</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Resize the panels to see how they adapt
                    </p>
                  </div>
                </div>

                <AdaptivePanel
                  title="Right Panel"
                  position="right"
                  defaultWidth="300px"
                  fullscreenable={true}
                  className="h-full"
                >
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This panel can be toggled to fullscreen mode.
                    </p>
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="font-medium">Properties</h4>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Width:</span>
                          <span>300px</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Position:</span>
                          <span>Right</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Collapsible:</span>
                          <span>Yes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AdaptivePanel>
              </div>
            </section>
          </div>
        )}

        {/* Progress tracking showcase */}
        {activeTab === "progress" && (
          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-xl font-semibold">Progress Tracking</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Horizontal Progress Tracker</h3>
                  <ProgressTracker 
                    steps={progressSteps}
                    currentStepId="step2"
                    orientation="horizontal"
                  />
                </div>
                
                <div className="flex gap-8">
                  <div className="w-1/2">
                    <h3 className="mb-4 text-lg font-medium">Vertical Progress Tracker</h3>
                    <ProgressTracker 
                      steps={progressSteps}
                      currentStepId="step2"
                      orientation="vertical"
                    />
                  </div>
                  
                  <div className="w-1/2">
                    <h3 className="mb-4 text-lg font-medium">With Level Information</h3>
                    <ProgressTracker 
                      steps={progressSteps}
                      currentStepId="step2"
                      orientation="vertical"
                      levels={progressLevels}
                      showLevelInfo={true}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

