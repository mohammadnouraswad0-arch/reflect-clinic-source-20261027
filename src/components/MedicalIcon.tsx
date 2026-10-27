import React from "react";
import {
  HeartPulse,
  Activity,
  ScanFace,
  Stethoscope,
  Sparkles,
  UserRound,
  Syringe,
  Microscope,
  Eye,
  Brain,
  ShieldCheck,
  Waves,
  Scissors,
  HeartHandshake,
  Heart,
  Zap,
  UserCheck,
  HandHeart,
  SunMedium,
  Smile,
  CalendarCheck,
  Award,
  CheckCircle2,
  Clock,
  Shield,
} from "lucide-react";

interface MedicalIconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

export function MedicalIcon({
  name,
  className = "w-6 h-6",
  strokeWidth = 1.75,
}: MedicalIconProps) {
  const iconMap: Record<
    string,
    React.ComponentType<{ className?: string; strokeWidth?: number }>
  > = {
    HeartPulse,
    Activity,
    ScanFace,
    Stethoscope,
    Sparkles,
    UserRound,
    Syringe,
    Microscope,
    Eye,
    Brain,
    ShieldCheck,
    Waves,
    Scissors,
    HeartHandshake,
    Heart,
    Zap,
    UserCheck,
    HandHeart,
    SunMedium,
    Smile,
    CalendarCheck,
    Award,
    CheckCircle2,
    Clock,
    Shield,
  };

  const IconComponent = iconMap[name] || Sparkles;
  return <IconComponent className={className} strokeWidth={strokeWidth} />;
}
