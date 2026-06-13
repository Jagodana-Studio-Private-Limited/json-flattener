"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, ArrowRightLeft, RotateCcw, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolEvents } from "@/lib/analytics";

type Mode = "flatten" | "unflatten";

function flattenJson(
  obj: unknown,
  delimiter: string,
  prefix = "",
  result: Record<string, unknown> = {}
): Record<string, unknown> {
  if (obj === null || typeof obj !== "object") {
    result[prefix] = obj;
    return result;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      result[prefix] = obj;
      return result;
    }
    obj.forEach((item, index) => {
      const key = prefix ? `${prefix}[${index}]` : `[${index}]`;
      flattenJson(item, delimiter, key, result);
    });
    return result;
  }
  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0) {
    if (prefix) result[prefix] = {};
    return result;
  }
  entries.forEach(([k, v]) => {
    const key = prefix ? `${prefix}${delimiter}${k}` : k;
    flattenJson(v, delimiter, key, result);
  });
  return result;
}

function unflattenJson(
  flat: Record<string, unknown>,
  delimiter: string
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [flatKey, value] of Object.entries(flat)) {
    const parts = flatKey.split(delimiter);
    let current: Record<string, unknown> = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (current[part] === undefined || typeof current[part] !== "object" || current[part] === null) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

const EXAMPLE_NESTED = `{
  "user": {
    "name": "Alice",
    "age": 30,
    "address": {
      "city": "London",
      "zip": "EC1A 1BB"
    },
    "tags": ["admin", "developer"]
  },
  "config": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "sms": false
    }
  }
}`;

const EXAMPLE_FLAT = `{
  "user.name": "Alice",
  "user.age": 30,
  "user.address.city": "London",
  "user.address.zip": "EC1A 1BB",
  "user.tags[0]": "admin",
  "user.tags[1]": "developer",
  "config.theme": "dark",
  "config.notifications.email": true,
  "config.notifications.sms": false
}`;

const DELIMITERS = [
  { label: "Dot  ·  user.name", value: "." },
  { label: "Underscore  ·  user_name", value: "_" },
  { label: "Slash  ·  user/name", value: "/" },
  { label: "Arrow  ·  user->name", value: "->" },
];

export function JsonFlattenerTool() {
  const [mode, setMode] = useState<Mode>("flatten");
  const [input, setInput] = useState(EXAMPLE_NESTED);
  const [delimiter, setDelimiter] = useState(".");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showDelimiters, setShowDelimiters] = useState(false);

  const process = useCallback(
    (raw: string, currentMode: Mode, currentDelimiter: string) => {
      setError("");
      if (!raw.trim()) {
        setOutput("");
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        let result: unknown;
        if (currentMode === "flatten") {
          result = flattenJson(parsed, currentDelimiter);
        } else {
          if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
            throw new Error("Unflatten input must be a flat JSON object.");
          }
          result = unflattenJson(parsed as Record<string, unknown>, currentDelimiter);
        }
        setOutput(JSON.stringify(result, null, 2));
        ToolEvents.toolUsed(currentMode);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Invalid JSON");
        setOutput("");
      }
    },
    []
  );

  const handleInput = useCallback(
    (value: string) => {
      setInput(value);
      process(value, mode, delimiter);
    },
    [mode, delimiter, process]
  );

  const handleModeChange = useCallback(
    (value: string) => {
      const newMode = value as Mode;
      setMode(newMode);
      const newInput = newMode === "flatten" ? EXAMPLE_NESTED : EXAMPLE_FLAT;
      setInput(newInput);
      process(newInput, newMode, delimiter);
    },
    [delimiter, process]
  );

  const handleDelimiter = useCallback(
    (value: string) => {
      setDelimiter(value);
      setShowDelimiters(false);
      process(input, mode, value);
    },
    [input, mode, process]
  );

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    ToolEvents.resultCopied();
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleReset = useCallback(() => {
    const defaultInput = mode === "flatten" ? EXAMPLE_NESTED : EXAMPLE_FLAT;
    setInput(defaultInput);
    setError("");
    process(defaultInput, mode, delimiter);
  }, [mode, delimiter, process]);

  const selectedDelimiterLabel =
    DELIMITERS.find((d) => d.value === delimiter)?.label ?? `Custom: ${delimiter}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Mode + Delimiter controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <Tabs value={mode} onValueChange={handleModeChange}>
          <TabsList>
            <TabsTrigger value="flatten">
              <ArrowRightLeft className="h-4 w-4 mr-1.5" />
              Flatten
            </TabsTrigger>
            <TabsTrigger value="unflatten">
              <ArrowRightLeft className="h-4 w-4 mr-1.5 rotate-90" />
              Unflatten
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Delimiter:</span>
          <div className="relative">
            <button
              onClick={() => setShowDelimiters((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg bg-background hover:bg-muted transition-colors"
            >
              <span className="font-mono">{selectedDelimiterLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {showDelimiters && (
              <div className="absolute right-0 top-full mt-1 z-10 bg-popover border border-border rounded-lg shadow-lg overflow-hidden min-w-[200px]">
                {DELIMITERS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => handleDelimiter(d.value)}
                    className={`w-full text-left px-3 py-2 text-sm font-mono hover:bg-muted transition-colors ${
                      d.value === delimiter ? "bg-brand/10 text-brand" : ""
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            title="Reset to example"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor panels */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {mode === "flatten" ? "Nested JSON" : "Flat JSON (dot-notation)"}
            </span>
            <span className="text-xs text-muted-foreground/60">Input</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            spellCheck={false}
            placeholder={`Paste ${mode === "flatten" ? "nested" : "flat"} JSON here…`}
            className="w-full h-80 font-mono text-sm p-4 rounded-xl border border-border bg-muted/30 resize-none focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/60 transition-colors"
          />
          {error && (
            <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {mode === "flatten" ? "Flat JSON (dot-notation)" : "Nested JSON"}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              disabled={!output}
              className="h-7 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="relative h-80">
            <pre className="w-full h-full font-mono text-sm p-4 rounded-xl border border-border bg-muted/20 overflow-auto whitespace-pre-wrap break-all">
              {output || (
                <span className="text-muted-foreground/50">
                  Output will appear here…
                </span>
              )}
            </pre>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      {output && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground"
        >
          {mode === "flatten" ? (
            <>
              <span>
                Keys in output:{" "}
                <strong>{Object.keys(JSON.parse(output)).length}</strong>
              </span>
              <span>
                Delimiter: <strong className="font-mono">{delimiter}</strong>
              </span>
            </>
          ) : (
            <>
              <span>
                Top-level keys:{" "}
                <strong>{Object.keys(JSON.parse(output)).length}</strong>
              </span>
            </>
          )}
          <span>
            Output size:{" "}
            <strong>{new Blob([output]).size} bytes</strong>
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
