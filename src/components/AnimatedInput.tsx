
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, icon, className, onChange, value, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== "";
    
    return (
      <div className="relative">
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ 
            scale: isFocused ? 1 : 0.97, 
            opacity: isFocused ? 1 : 0,
            y: isFocused ? -5 : 0 
          }}
          transition={{ duration: 0.2 }}
          className="absolute -top-3 left-3 px-1 bg-background text-xs font-medium text-primary z-10"
        >
          {label}
        </motion.div>
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          
          <Input
            ref={ref}
            className={cn(
              "glass-input transition-all duration-300", 
              isFocused && "border-primary/50 shadow-sm shadow-primary/20",
              icon && "pl-9",
              className
            )}
            placeholder={!isFocused ? label : ""}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(hasValue)}
            onChange={onChange}
            value={value}
            {...props}
          />
          
          <motion.span
            className="absolute bottom-0 left-0 h-[2px] bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: isFocused ? "100%" : "0%" }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export default AnimatedInput;
