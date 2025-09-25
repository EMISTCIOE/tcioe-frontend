"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { AnimatedSection } from "@/components/animated-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CampusMapPage() {
  const [mode, setMode] = useState<"3d" | "2d">("3d");
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setMode((m) => (m === "3d" ? "2d" : "3d"));
    // Reset zoom and position when switching modes
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      }
    },
    [zoom, position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart, zoom]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  return (
    <AnimatedSection className="container mx-auto px-4 lg:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-primary-blue">Campus Map</h1>
          <div className="flex gap-2">
            <Button onClick={handleZoomOut} disabled={zoom <= 0.5} size="sm">
              Zoom Out
            </Button>
            <Button onClick={handleResetView} size="sm" variant="outline">
              Reset View
            </Button>
            <Button onClick={handleZoomIn} disabled={zoom >= 3} size="sm">
              Zoom In
            </Button>
            <Button onClick={toggle} className="min-w-32">
              {mode === "3d" ? "2D Map" : "3D Map"}
            </Button>
          </div>
        </div>
        <p className="text-text-dark mb-6">
          Explore the campus visually. Use mouse wheel to zoom, drag to pan when
          zoomed in.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <Card className="lg:col-span-2 p-3">
            <div
              ref={imageRef}
              className="rounded-xl overflow-hidden bg-gray-100 relative"
              style={{ height: "600px" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <div
                className={`transition-transform duration-200 ${
                  isDragging
                    ? "cursor-grabbing"
                    : zoom > 1
                    ? "cursor-grab"
                    : "cursor-default"
                }`}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                }}
              >
                <Image
                  src={
                    mode === "3d"
                      ? "/images/campus/maps/3d.webp"
                      : "/images/campus/maps/2d.webp"
                  }
                  alt={mode === "3d" ? "3D campus map" : "2D campus map"}
                  width={2200}
                  height={1500}
                  className="w-full h-auto select-none"
                  priority
                  draggable={false}
                />
              </div>

              {/* Zoom indicator */}
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {Math.round(zoom * 100)}%
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-5">
              <h2 className="text-xl font-semibold mb-3">How to Use</h2>
              <ul className="text-sm text-text-dark space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Toggle between 3D and 2D maps
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Mouse wheel to zoom in/out
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Click and drag to pan when zoomed
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Use buttons for precise zoom control
                </li>
              </ul>
            </Card>

            <Card className="p-5">
              <h2 className="text-xl font-semibold mb-3">Map Info</h2>
              <div className="space-y-2 text-sm text-text-dark">
                <div className="flex justify-between">
                  <span>Current View:</span>
                  <span className="font-medium">{mode.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Zoom Level:</span>
                  <span className="font-medium">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Pan Position:</span>
                  <span className="font-medium text-xs">
                    {position.x !== 0 || position.y !== 0
                      ? `${Math.round(position.x)}, ${Math.round(position.y)}`
                      : "Center"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
