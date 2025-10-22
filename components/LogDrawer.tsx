"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, X } from "lucide-react";

interface ApiLog {
  path: string;
  method: string;
  status: number;
  ms: number;
  timestamp: string;
}

export function LogDrawer() {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<ApiLog[]>([]);

  useEffect(() => {
    const handleLog = (event: any) => {
      setLogs((prev) => [event.detail, ...prev].slice(0, 50));
    };

    window.addEventListener("api:log", handleLog);
    return () => window.removeEventListener("api:log", handleLog);
  }, []);

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 rounded-full shadow-lg"
        size="icon"
        onClick={() => setOpen(!open)}
      >
        <FileText className="h-5 w-5" />
      </Button>

      {open && (
        <div className="fixed bottom-20 right-6 w-96 max-h-[500px] border rounded-lg shadow-xl bg-background">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">API Request Log</h3>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="h-[400px] p-4">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No requests yet</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className="text-xs p-2 rounded bg-muted space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold">{log.method}</span>
                      <span className={`px-2 py-0.5 rounded ${
                        log.status < 300 ? "bg-green-500/20 text-green-600" :
                        log.status < 400 ? "bg-yellow-500/20 text-yellow-600" :
                        "bg-red-500/20 text-red-600"
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <div className="font-mono text-muted-foreground truncate">
                      {log.path}
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{log.ms}ms</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </>
  );
}
